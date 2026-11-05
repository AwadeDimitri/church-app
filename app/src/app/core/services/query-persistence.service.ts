import { Injectable, effect, inject, untracked } from '@angular/core';
import { QueryClient, type Query } from '@tanstack/angular-query-experimental';
import {
  persistQueryClientRestore,
  persistQueryClientSave,
  persistQueryClientSubscribe,
  removeOldestQuery,
  type PersistedClient,
  type PersistedQueryClientSaveOptions,
} from '@tanstack/query-persist-client-core';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { AuthService } from '@core/services/auth.service';

declare module '@tanstack/angular-query-experimental' {
  interface Register {
    /** `persist: false` : la requête n'est jamais gardée sur l'appareil. */
    queryMeta: { persist?: boolean };
  }
}

/**
 * Durée pendant laquelle un contenu reste lisible hors ligne. Le `gcTime` des
 * requêtes doit être au moins égal, sinon un contenu restauré est jeté avant.
 */
export const QUERY_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const STORAGE_KEY = 'cijcm-query-cache';

/** À incrémenter quand la forme des données mises en cache change. */
const CACHE_VERSION = 'v1';

/**
 * Racines des clés de requête dont le contenu est public. Tout le reste est
 * traité comme personnel : une nouvelle requête est donc protégée par défaut.
 */
const PUBLIC_QUERY_ROOTS = new Set<unknown>([
  'events',
  'sermons',
  'sermon-categories',
]);

const isPersonalQuery = (query: Query): boolean =>
  !PUBLIC_QUERY_ROOTS.has(query.queryKey[0]);

/**
 * Seule la donnée est gardée : l'erreur d'un rafraîchissement raté ne doit ni
 * être stockée, ni réapparaître à la relecture.
 */
const serialize = (client: PersistedClient): string =>
  JSON.stringify({
    ...client,
    clientState: {
      ...client.clientState,
      queries: client.clientState.queries.map((query) => ({
        ...query,
        state: { ...query.state, error: null, fetchFailureReason: null },
      })),
    },
  });

function safeLocalStorage(): Storage | undefined {
  try {
    return window.localStorage;
  } catch {
    return undefined; // stockage désactivé : la persistance devient inopérante
  }
}

/**
 * Garde le dernier contenu chargé sur l'appareil pour qu'il reste lisible hors
 * ligne. Le cache stocké appartient à un compte : il n'est jamais restauré pour
 * un autre, et le contenu personnel est effacé dès que le compte change
 * (déconnexion comprise).
 */
@Injectable({ providedIn: 'root' })
export class QueryPersistenceService {
  private readonly queryClient = inject(QueryClient);
  private readonly auth = inject(AuthService);

  private readonly persister = createSyncStoragePersister({
    storage: safeLocalStorage(),
    key: STORAGE_KEY,
    serialize,
    retry: removeOldestQuery,
  });

  private ownerId = this.currentUserId();
  private unsubscribe: (() => void) | null = null;

  constructor() {
    // Ce service est créé au démarrage, avant les stores : au changement de
    // compte, son effet passe donc avant que leurs requêtes ne repartent.
    effect(() => {
      const userId = this.currentUserId();
      if (userId !== this.ownerId) {
        untracked(() => this.changeOwner(userId));
      }
    });
  }

  /** Restaure le cache stocké puis le tient à jour. Lecture locale uniquement, à appeler au démarrage. */
  async init(): Promise<void> {
    const options = this.optionsFor(this.ownerId);
    try {
      await persistQueryClientRestore({ ...options, maxAge: QUERY_CACHE_MAX_AGE });
    } catch {
      // Cache illisible : il a été supprimé, l'app démarre sans.
    }
    this.unsubscribe = persistQueryClientSubscribe(options);
  }

  private changeOwner(userId: string | null): void {
    this.ownerId = userId;
    this.unsubscribe?.();
    // Suppression immédiate de ce qui est stocké, sans attendre l'écriture différée.
    this.persister.removeClient();
    // reset() vide les données que les stores tiennent encore (sinon
    // `keepPreviousData` les resservirait au compte suivant), puis le cache
    // les oublie.
    this.queryClient
      .getQueryCache()
      .findAll({ predicate: isPersonalQuery })
      .forEach((query) => query.reset());
    this.queryClient.removeQueries({ predicate: isPersonalQuery });

    const options = this.optionsFor(userId);
    this.unsubscribe = persistQueryClientSubscribe(options);
    // Réécrit le contenu public restant, et remplace une écriture différée
    // encore en attente pour l'ancien compte.
    void persistQueryClientSave(options);
  }

  private optionsFor(userId: string | null): PersistedQueryClientSaveOptions {
    return {
      queryClient: this.queryClient,
      persister: this.persister,
      // Un cache écrit pour un autre compte (ou une autre version) est rejeté à la restauration.
      buster: `${CACHE_VERSION}:${userId ?? 'anonymous'}`,
      dehydrateOptions: {
        // Toute donnée encore assez récente est gardée, même si son dernier
        // rafraîchissement a échoué : c'est justement le cas d'un mauvais réseau.
        shouldDehydrateQuery: (query) =>
          query.state.data !== undefined &&
          Date.now() - query.state.dataUpdatedAt < QUERY_CACHE_MAX_AGE &&
          query.meta?.persist !== false,
        shouldDehydrateMutation: () => false,
      },
    };
  }

  private currentUserId(): string | null {
    return this.auth.user()?.id ?? null;
  }
}
