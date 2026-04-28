import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Avatar } from '@shared/components/avatar/avatar';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { MenuItem } from '@shared/components/menu-item/menu-item';
import { ProfileService } from '@core/services/profile.service';

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
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  protected readonly user = this.profileService.user;
  protected readonly stats = this.profileService.stats;

  protected readonly displayName = computed(() => this.user()?.full_name ?? '');
  protected readonly memberSince = computed(() => {
    const createdAt = this.user()?.created_at;
    if (!createdAt) return '';
    return `Membre depuis ${new Date(createdAt).getFullYear()}`;
  });

  readonly mainMenu: MenuEntry[] = [
    { icon: 'user', label: 'Informations personnelles', route: '/profile/edit', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'info-circle', label: 'À propos', route: '/about', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
  ];

  navigate(route: string) {
    this.router.navigateByUrl(route);
  }

  signOut() {
    this.profileService.signOut();
  }
}
