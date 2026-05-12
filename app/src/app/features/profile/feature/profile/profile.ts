import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from '@shared/components/avatar/avatar';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { MenuItem } from '@shared/components/menu-item/menu-item';
import { AuthService } from '@core/services/auth.service';
import { ProfileStore } from '@features/profile/data-access';

interface MenuEntry {
  readonly icon: string;
  readonly label: string;
  readonly route: string;
  readonly bgClass: string;
  readonly iconColor: string;
}

@Component({
  selector: 'app-profile',
  imports: [Avatar, StatCard, MenuItem],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Profile {
  private readonly store = inject(ProfileStore);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.store.user;
  protected readonly stats = this.store.stats;

  protected readonly displayName = computed(() => this.user()?.full_name ?? '');
  protected readonly memberSince = computed(() => {
    const createdAt = this.user()?.created_at;
    if (!createdAt) return '';
    const date = new Date(createdAt);
    const formatted = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(date);
    return `Membre depuis ${formatted}`;
  });

  readonly mainMenu: MenuEntry[] = [
    { icon: 'user', label: 'Informations personnelles', route: '/profile/edit', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'info-circle', label: 'À propos', route: '/about', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
  ];

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }

  signOut() {
    this.authService.signOut();
  }
}
