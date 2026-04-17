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
import { provideTanStackQuery, QueryClient } from '@tanstack/angular-query-experimental';

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
];

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
      };
    }),
    provideTanStackQuery(new QueryClient()),
    provideAppInitializer(() => inject(PwaUpdateService).init()),
  ],
};
