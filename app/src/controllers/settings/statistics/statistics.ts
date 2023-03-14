import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
  moduleId: module.id,
  selector: 'afs-settings-statistics',
  inputs: ['object'],
  templateUrl: 'statistics.html',
})

export class SettingsStatistics {

  minds: Minds;
  user: any;
  settings: string;
  data = {
    fullname: 'iTimche',
    email: 'info@iTimche.net',
    memberSince: new Date(),
    lastLogin: new Date(),
    storage: '0 GB\'s',
    bandwidth: '0 GB\'s',
    referrals: 500,
    earnings: 123123

  };
  constructor(public client: Client) {
    this.minds = window.Afs;
    this.minds.cdn_url = 'http://192.168.164.130';
  }

}
