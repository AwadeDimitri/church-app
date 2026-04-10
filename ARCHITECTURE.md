# Architecture & Bonnes Pratiques — Church App

## Vue d'ensemble

Application mobile PWA pour l'Église de Grâce, construite avec Angular 20, Tailwind CSS v4, ng-zorro-antd et Apollo GraphQL.

---

## Structure du projet

```
src/
├── app/
│   ├── core/                    Services singleton, intercepteurs, modèles du domaine
│   │   ├── interceptors/        Intercepteurs HTTP fonctionnels
│   │   ├── models/              Interfaces TypeScript du domaine métier
│   │   └── services/            Services globaux (un seul instance dans toute l'app)
│   ├── features/                Pages/écrans de l'application (lazy-loaded)
│   │   ├── home/
│   │   ├── sermons/
│   │   ├── donate/
│   │   ├── prayer/
│   │   └── profile/
│   └── shared/                  Composants, pipes et directives réutilisables
│       └── components/
├── environments/                Configuration par environnement (dev, prod)
└── index.html                   Point d'entrée avec meta tags PWA
```

### Pourquoi cette structure ?

**`core/`** contient tout ce qui existe en une seule instance dans l'application. Un intercepteur HTTP, un service de mise à jour PWA, les interfaces du domaine — ce sont des éléments qui ne sont jamais dupliqués. Les mettre dans `core/` rend leur rôle immédiatement clair : ce sont les fondations de l'app, pas des briques réutilisables.

**`features/`** regroupe chaque écran dans son propre dossier. Chaque feature est indépendante et lazy-loaded. Si un développeur travaille sur la page "Sermons", il sait exactement où chercher. Si on supprime une feature, on supprime un dossier — zéro effet de bord.

**`shared/`** contient les composants utilisés par plusieurs features. La navbar par exemple : elle apparaît sur tous les écrans, elle n'appartient à aucune feature en particulier.

---

## Décisions Angular

### Standalone Components (pas de NgModules)

```typescript
@Component({
  selector: 'app-home',
  imports: [NzIconDirective],       // Imports directs, pas de module intermédiaire
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
```

Depuis Angular 20, `standalone: true` est le comportement par défaut. On ne le déclare plus explicitement. Chaque composant déclare ses propres dépendances dans `imports` — on voit immédiatement ce qu'il utilise sans ouvrir un fichier module séparé. Le code est plus lisible, plus portable, et chaque composant forme une unité autonome.

### ChangeDetectionStrategy.OnPush

```typescript
changeDetection: ChangeDetectionStrategy.OnPush
```

Appliqué sur **tous** les composants sans exception. Angular vérifie les changements dans le template uniquement quand :
- un `@Input` change de référence
- un signal émet une nouvelle valeur
- un événement est déclenché dans le template
- un Observable utilisé avec `async` pipe émet

Le gain est direct : Angular ne parcourt plus inutilement l'arbre de composants à chaque cycle. Sur mobile, où chaque milliseconde de CPU compte pour la batterie et la fluidité, c'est une décision non négociable.

### Signals pour l'état réactif

```typescript
readonly selectedAmount = signal<number | null>(null);
readonly frequency = signal<'once' | 'weekly' | 'monthly'>('once');
```

Les signals sont le mécanisme réactif natif d'Angular 20. Ils remplacent les propriétés simples pour l'état du composant. Avantages par rapport à une propriété classique :
- Ils déclenchent automatiquement la mise à jour du template avec OnPush
- Ils sont synchrones et simples (pas besoin de `subscribe` / `unsubscribe`)
- Ils préparent la transition vers le futur zoneless Angular

### Lazy Loading avec default export

```typescript
// app.routes.ts
{
  path: 'sermons',
  loadComponent: () => import('./features/sermons/sermons'),
}

// sermons.ts
export default class Sermons {}
```

Chaque feature est un `default export` chargé dynamiquement via `loadComponent`. Le bundler crée un chunk JavaScript séparé pour chaque page. Résultat : l'utilisateur ne télécharge que le code de la page qu'il visite. Le bundle initial reste léger, le temps de chargement est réduit.

### PreloadAllModules

```typescript
provideRouter(
  routes,
  withPreloading(PreloadAllModules),
  withComponentInputBinding(),
)
```

Une fois la page initiale chargée, Angular précharge silencieusement toutes les autres routes en arrière-plan. L'utilisateur voit la première page rapidement (lazy loading), puis navigue instantanément vers les autres pages (preloading). C'est le meilleur des deux mondes.

`withComponentInputBinding()` permet d'injecter les paramètres de route directement en tant qu'`input()` dans les composants — plus besoin de `ActivatedRoute` pour lire un paramètre d'URL.

### Intercepteur HTTP fonctionnel

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Gestion centralisée des erreurs
    }),
  );
```

Angular 20 favorise les intercepteurs fonctionnels plutôt que les classes avec `implements HttpInterceptor`. Plus léger, plus simple, pas besoin de `@Injectable` ni de token d'injection. Chaque requête HTTP passe par ce pipeline — la gestion d'erreur est centralisée en un seul endroit au lieu d'être dupliquée dans chaque service.

### inject() au lieu du constructeur

```typescript
// Angular 20 — inject()
private readonly swUpdate = inject(SwUpdate);

// Ancien style — à éviter
constructor(private swUpdate: SwUpdate) {}
```

La fonction `inject()` est plus concise, fonctionne dans les fonctions factory (pas seulement les classes), et rend les dépendances explicites. C'est le style recommandé par l'équipe Angular.

### Path Aliases

```json
// tsconfig.json
"paths": {
  "@core/*": ["src/app/core/*"],
  "@features/*": ["src/app/features/*"],
  "@shared/*": ["src/app/shared/*"],
  "@env": ["src/environments/environment"]
}
```

```typescript
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { environment } from '@env';
```

Plus de chemins relatifs fragiles comme `../../../core/interceptors/...`. Si on déplace un fichier, les imports avec alias ne cassent pas. Le code est plus lisible et l'intention est claire : on sait immédiatement si un import vient du core, d'une feature ou du shared.

---

## Décisions PWA

### Service Worker avec stratégie de cache

```json
// ngsw-config.json
"assetGroups": [
  { "name": "app", "installMode": "prefetch" },    // Shell de l'app — toujours en cache
  { "name": "assets", "installMode": "lazy" }       // Images/fonts — en cache à la demande
],
"dataGroups": [
  {
    "name": "api-freshness",
    "urls": ["/graphql"],
    "cacheConfig": {
      "strategy": "freshness",       // Réseau d'abord, cache si hors ligne
      "maxAge": "1h",                // Cache valide 1 heure
      "timeout": "5s"                // Si le réseau ne répond pas en 5s → cache
    }
  }
]
```

**Asset Groups** : le shell de l'app (HTML, CSS, JS) est pré-caché au premier chargement. L'app démarre instantanément même sans réseau. Les images et fonts sont cachés au fur et à mesure.

**Data Groups** : les réponses GraphQL utilisent la stratégie `freshness` — on essaie toujours le réseau d'abord pour avoir des données fraîches, mais si le réseau est lent (> 5s) ou absent, on sert le cache. Pour une app d'église, c'est le bon compromis : les sermons et prières sont à jour quand possible, mais l'app reste fonctionnelle hors ligne.

### Mise à jour automatique

```typescript
@Injectable({ providedIn: 'root' })
export class PwaUpdateService {
  private readonly swUpdate = inject(SwUpdate);

  init(): void {
    if (!this.swUpdate.isEnabled) return;
    this.swUpdate.versionUpdates
      .pipe(filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'))
      .subscribe(() => this.promptUpdate());
  }
}
```

Quand une nouvelle version de l'app est déployée, le service worker la détecte automatiquement. L'utilisateur est invité à rafraîchir. Sans ce mécanisme, les utilisateurs restent bloqués sur une version ancienne en cache — un problème classique des PWA.

Le service est initialisé via `provideAppInitializer` — il démarre avec l'application sans que les features aient besoin de le connaître.

### Meta tags PWA complets

```html
<!-- Thème du navigateur mobile -->
<meta name="theme-color" content="#0047AB">

<!-- Support iOS (Safari ne lit pas le manifest pour tout) -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Église de Grâce">
<link rel="apple-touch-icon" href="icons/icon-192x192.png">

<!-- Safe area pour les écrans à encoche -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

Le `manifest.webmanifest` ne suffit pas. iOS/Safari ignore certains champs du manifest et se base sur les meta tags. Sans `apple-mobile-web-app-capable`, l'app ne se lance pas en plein écran sur iPhone. Sans `viewport-fit=cover`, le contenu ne couvre pas la zone derrière l'encoche.

### Manifest avec branding

```json
{
  "name": "Église de Grâce",
  "short_name": "Église",
  "theme_color": "#0047AB",
  "background_color": "#F8F9FA",
  "orientation": "portrait",
  "lang": "fr"
}
```

Le `theme_color` colore la barre d'état du navigateur. Le `background_color` est affiché pendant le splash screen au lancement. L'`orientation: portrait` verrouille l'app en mode portrait — c'est une app mobile, pas un dashboard. Le `lang: fr` aide les lecteurs d'écran et le SEO.

---

## Décisions TypeScript

### Interfaces readonly pour le domaine

```typescript
export interface Sermon {
  readonly id: string;
  readonly title: string;
  readonly speaker: string;
  readonly duration: number;
  readonly category: SermonCategory;
}

export type SermonCategory = 'foi' | 'priere' | 'famille' | 'guerison' | 'louange';
```

Toutes les propriétés sont `readonly`. Les données qui viennent de l'API ne doivent jamais être mutées directement — on crée de nouveaux objets si on veut modifier quelque chose. Cela élimine une catégorie entière de bugs (mutation accidentelle d'état partagé) et fonctionne naturellement avec OnPush.

Les types union littéraux (`SermonCategory`) remplacent les enums. Ils sont plus légers (pas de code JavaScript généré), fonctionnent comme type et comme valeur, et sont vérifiés exhaustivement par TypeScript.

### export type pour les barrel files

```typescript
export type { Sermon, SermonCategory } from './sermon.model';
```

Avec `isolatedModules: true` (requis pour le bundler moderne d'Angular), les ré-exports de types doivent utiliser `export type`. Cela garantit que le bundler peut éliminer ces imports à la compilation — aucun code mort dans le bundle final.

---

## Décisions de configuration

### Environnements avec fileReplacements

```json
// angular.json (production)
"fileReplacements": [{
  "replace": "src/environments/environment.ts",
  "with": "src/environments/environment.prod.ts"
}]
```

```typescript
// Utilisé partout via l'alias
import { environment } from '@env';
```

L'URL de l'API n'est jamais hardcodée dans le code métier. En dev, `environment.ts` pointe vers `localhost:3000`. En build de production, Angular remplace automatiquement le fichier par `environment.prod.ts`. Un seul code source, deux comportements.

### TypeScript strict

```json
"strict": true,
"noImplicitOverride": true,
"noPropertyAccessFromIndexSignature": true,
"noImplicitReturns": true,
"noFallthroughCasesInSwitch": true,
"isolatedModules": true,
"strictTemplates": true
```

Chaque option stricte est activée. `strictTemplates` vérifie les types dans les templates HTML — une variable mal typée dans un `@for` ou un `@if` est détectée à la compilation, pas en production. `isolatedModules` est requis par le bundler Vite utilisé par Angular 20.

---

## Récapitulatif des gains

| Pratique | Gain principal |
|---|---|
| Standalone components | Autonomie, lisibilité, tree-shaking |
| OnPush partout | Performance rendering, économie batterie mobile |
| Signals | Réactivité synchrone, compatible zoneless futur |
| Lazy loading + preloading | Chargement initial rapide + navigation fluide |
| Intercepteur fonctionnel | Gestion d'erreur centralisée, zéro duplication |
| Path aliases | Imports propres, refactoring sans casse |
| Environnements | Zéro config hardcodée, déploiement fiable |
| Service Worker (freshness) | App fonctionnelle hors ligne, données fraîches |
| PWA Update service | Utilisateurs toujours sur la dernière version |
| Meta tags iOS/OG | Expérience native sur tous les appareils |
| Interfaces readonly | Immutabilité, prévention des bugs de mutation |
| TypeScript strict | Erreurs détectées à la compilation, pas en prod |
