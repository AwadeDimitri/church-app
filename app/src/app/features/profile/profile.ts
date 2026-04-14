import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Avatar } from '@shared/components/avatar/avatar';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { MenuItem } from '@shared/components/menu-item/menu-item';
import { ProfileService } from '@core/services/profile.service';

interface MenuEntry {
  readonly icon: string;
  readonly label: string;
  readonly bgClass: string;
  readonly iconColor: string;
}

@Component({
  selector: 'app-profile',
  imports: [NzIconDirective, Avatar, StatCard, MenuItem],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Profile {
  private readonly profileService = inject(ProfileService);

  protected readonly user = this.profileService.user;
  protected readonly stats = this.profileService.stats;

  protected readonly displayName = computed(() => this.user()?.full_name ?? '');
  protected readonly memberSince = computed(() => {
    const createdAt = this.user()?.created_at;
    if (!createdAt) return '';
    return `Membre depuis ${new Date(createdAt).getFullYear()}`;
  });

  readonly mainMenu: MenuEntry[] = [
    { icon: 'user',    label: 'Informations personnelles', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'bell',    label: 'Notifications',             bgClass: 'bg-amber-50',          iconColor: 'text-church-gold' },
    { icon: 'lock',    label: 'Confidentialité',           bgClass: 'bg-green-50',          iconColor: 'text-church-green' },
    { icon: 'setting', label: 'Paramètres',                bgClass: 'bg-purple-50',         iconColor: 'text-purple-500' },
  ];

  readonly supportMenu: MenuEntry[] = [
    { icon: 'question-circle', label: 'Aide & Support', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'info-circle',     label: 'À propos',       bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
  ];

  signOut() {
    this.profileService.signOut();
  }
}
