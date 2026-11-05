import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
  inject,
  provideAppInitializer,
} from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { provideTanStackQuery, QueryClient, onlineManager } from '@tanstack/angular-query-experimental';

import { routes } from './app.routes';
import { environment } from '@env';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { authInterceptor } from '@core/interceptors/auth.interceptor';
import { PwaUpdateService } from '@core/services/pwa-update.service';
import {
  HomeOutline,
  PlayCircleOutline,
  DollarCircleOutline,
  HeartOutline,
  HeartFill,
  UserOutline,
  SearchOutline,
  BellOutline,
  CalendarOutline,
  ClockCircleOutline,
  TeamOutline,
  ReadOutline,
  SoundOutline,
  GiftOutline,
  SettingOutline,
  EditOutline,
  LogoutOutline,
  RightOutline,
  LeftOutline,
  FireOutline,
  StarOutline,
  StarFill,
  ShareAltOutline,
  EnvironmentOutline,
  PhoneOutline,
  MailOutline,
  SafetyOutline,
  LockOutline,
  QuestionCircleOutline,
  PlusOutline,
  SendOutline,
  LikeOutline,
  LikeFill,
  CreditCardOutline,
  BankOutline,
  WalletOutline,
  CheckCircleOutline,
  CheckCircleFill,
  InfoCircleOutline,
  FilterOutline,
  DownOutline,
  CameraOutline,
  BookOutline,
  EyeOutline,
  EyeInvisibleOutline,
  ArrowLeftOutline,
  ArrowRightOutline,
  CaretRightFill,
  PlayCircleFill,
  AudioOutline,
  MessageOutline,
  DeleteOutline,
  LoadingOutline,
  ArrowDownOutline,
  DisconnectOutline,
} from '@ant-design/icons-angular/icons';

const icons = [
  HomeOutline, PlayCircleOutline, DollarCircleOutline, HeartOutline, HeartFill,
  UserOutline, SearchOutline, BellOutline, CalendarOutline, ClockCircleOutline,
  TeamOutline, ReadOutline, SoundOutline, GiftOutline, SettingOutline,
  EditOutline, LogoutOutline, RightOutline, LeftOutline, FireOutline,
  StarOutline, StarFill, ShareAltOutline, EnvironmentOutline, PhoneOutline,
  MailOutline, SafetyOutline, LockOutline, QuestionCircleOutline, PlusOutline,
  SendOutline, LikeOutline, LikeFill, CreditCardOutline, BankOutline,
  WalletOutline, CheckCircleOutline, CheckCircleFill, InfoCircleOutline,
  FilterOutline, DownOutline, CameraOutline, BookOutline,
  EyeOutline, EyeInvisibleOutline, ArrowLeftOutline, ArrowRightOutline,
  CaretRightFill, PlayCircleFill, AudioOutline, MessageOutline, DeleteOutline,
  LoadingOutline, ArrowDownOutline, DisconnectOutline,
];

// TanStack se croit en ligne au démarrage et ne suit ensuite que les événements
// online/offline. Sans cet alignement, une app ouverte hors ligne épuise ses
// tentatives et finit en erreur au lieu de se mettre en pause puis de repartir
// seule au retour du réseau.
onlineManager.setOnline(navigator.onLine);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    provideNzIcons(icons),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),
      withComponentInputBinding(),
    ),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor]),
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideApollo(() => {
      const httpLink = inject(HttpLink);
      return {
        link: httpLink.create({ uri: environment.apiUrl }),
        cache: new InMemoryCache(),
        defaultOptions: {
          query: { fetchPolicy: 'no-cache' },
          watchQuery: { fetchPolicy: 'no-cache' },
          mutate: { fetchPolicy: 'no-cache' },
        },
      };
    }),
    provideTanStackQuery(
      new QueryClient({
        defaultOptions: {
          queries: {
            // Une première tentative part toujours (navigator.onLine peut se
            // tromper) ; les suivantes attendent le retour du réseau.
            networkMode: 'offlineFirst',
            // Hors ligne, la mise en pause est immédiate : pas de délai de
            // retry pendant lequel l'écran resterait en squelette.
            retryDelay: (failureCount) =>
              onlineManager.isOnline()
                ? Math.min(1000 * 2 ** failureCount, 30_000)
                : 0,
          },
          // Un formulaire envoyé hors ligne échoue tout de suite, avec son
          // erreur, au lieu de rester en attente jusqu'au retour du réseau.
          mutations: { networkMode: 'offlineFirst' },
        },
      }),
    ),
    provideAppInitializer(() => inject(PwaUpdateService).init()),
  ],
};
