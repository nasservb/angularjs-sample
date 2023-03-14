import { Component, EventEmitter } from '@angular/core';

import { SessionFactory } from '../../../services/session';

@Component({
  selector: 'm-modal-invite',
  inputs: ['open'],
  outputs: ['closed'],
  template: `
    <m-modal [open]="open" (closed)="close($event)">

      <div class="mdl-card__supporting-text forInviteForm">
        <!-- i18n -->لینک معرفی به  دوستان<!-- /i18n -->
      </div>

      <div class="mdl-card__supporting-text">
        <input class="" value="{{url}}" (focus)="copy($event)" (click)="copy($event)" autofocus/>
      </div>

      <div class="m-social-share-buttons">
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-fb"
          (click)="openWindow('https://www.facebook.com/sharer/sharer.php?u=' + encodedUrl + '&display=popup&ref=plugin&src=share_button')">
          <!-- i18n -->فیسبوک<!-- /i18n -->
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-twitter"
          (click)="openWindow('https://twitter.com/intent/tweet?text=%D8%A8%D9%87%20%D8%B4%D8%A8%DA%A9%D9%87%20%D8%A7%D9%81%D8%B3%D8%B1%D8%A7%D9%86%20%D8%A8%D9%BE%DB%8C%D9%88%D9%86%D8%AF%DB%8C%D8%AF&tw_p=tweetbutton&url=' + encodedUrl)">
          <!-- i18n -->توییتر<!-- /i18n -->
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-email" (click)="openEmail()">
          <!-- i18n -->ایمیل<!-- /i18n -->
        </button>
        <button class="mdl-button mdl-button--raised mdl-color-text--white m-social-share-telegram"
                (click)="openWindow('https://t.me/share/url?url=' + encodedUrl)">
            <!-- i18n -->تلگرام<!-- /i18n -->
        </button>
      </div>


    </m-modal>
  `
})

export class InviteModal {

  open: boolean = false;
  closed: EventEmitter<any> = new EventEmitter();
  url: string = '';
  encodedUrl: string = '';
  embedCode: string = '';

  session = SessionFactory.build();

  ngOnInit() {
    this.url = window.Afs.site_url + 'register?referrer=' + this.session.getLoggedInUser().username;
    this.encodedUrl = encodeURI(this.url);
  }

  close(e?) {
    this.open = false;
    this.closed.next(true);
  }

  copy(e) {
    e.target.select();
    document.execCommand('copy');
  }

  openWindow(url: string) {
    window.open(url, '_blank', 'width=600, height=300, left=80, top=80');
  }

  openEmail() {
    window.location.href = 'mailto:?subject=به%20هرخوبان%20بپیوندید&body=به شبکه آی تیمچه بپیوندید ' + this.encodedUrl;
  }

}
