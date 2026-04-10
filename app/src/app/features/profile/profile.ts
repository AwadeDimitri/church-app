import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { Avatar } from '@shared/components/avatar/avatar';
import { StatCard } from '@shared/components/stat-card/stat-card';
import { MenuItem } from '@shared/components/menu-item/menu-item';

interface Stat {
  readonly value: number;
  readonly label: string;
  readonly color: string;
}

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
  readonly stats: Stat[] = [
    { value: 48, label: 'Cultes',  color: 'text-church-blue' },
    { value: 12, label: 'Dons',    color: 'text-church-green' },
    { value: 7,  label: 'Prières', color: 'text-church-gold' },
  ];

  readonly mainMenu: MenuEntry[] = [
    { icon: 'user',    label: 'Informations personnelles', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'bell',    label: 'Notifications',             bgClass: 'bg-amber-50',           iconColor: 'text-church-gold' },
    { icon: 'lock',    label: 'Confidentialité',           bgClass: 'bg-green-50',            iconColor: 'text-church-green' },
    { icon: 'setting', label: 'Paramètres',                bgClass: 'bg-purple-50',           iconColor: 'text-purple-500' },
  ];

  readonly supportMenu: MenuEntry[] = [
    { icon: 'question-circle', label: 'Aide & Support', bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
    { icon: 'info-circle',     label: 'À propos',       bgClass: 'bg-church-blue-light', iconColor: 'text-church-blue' },
  ];
}
