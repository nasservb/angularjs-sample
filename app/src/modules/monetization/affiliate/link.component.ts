import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../common/api/client.service';

@Component({
  selector: 'm-affiliate--link',
  templateUrl: 'link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AffiliateLinkComponent {

  minds = window.Afs;
  user = window.Afs.user;
  showOnboarding: boolean = false;
  link: string = '';
  encodedLink: string = '';

  constructor(private client: Client, private cd: ChangeDetectorRef) {
    this.link = this.minds.site_url + 'register;referrer=' + this.user.username;
    this.encodedLink = encodeURI(this.link);
  }

  openWindow(url: string) {
    window.open(url, '_blank', 'width=600, height=300, left=80, top=80');
  }

  openEmail() {
    window.location.href = 'mailto:?subject=Join%20me%20on%20minds&body=به شبکه شبکه آی تیمچه بپیوندید ' + this.encodedLink;
  }

  detectChanges() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

}
