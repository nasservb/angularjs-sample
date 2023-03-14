import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { SessionFactory } from '../../../services/session';
import { Client } from '../../../services/api';
import { ThirdPartyNetworksService } from '../../../services/third-party-networks';

@Component({
  moduleId: module.id,
  selector: 'afs-settings-general',
  templateUrl: 'general.html'
})

export class SettingsGeneral {

  session = SessionFactory.build();
  minds: Minds;
  settings: string;
  @Input() object: any;

  @Input() card: string; // card we'll scroll to

  error: string = '';
  changed: boolean = false;
  saved: boolean = false;
  inProgress: boolean = false;

  guid: string = '';
  name: string;
  email: string;
  mature: boolean = false;
  enabled_mails: boolean = true;

  password: string;
  password1: string;
  password2: string;

  language: string = 'en';

  categories: { id, label, selected }[];
  selectedCategories: string[] = [];

  paramsSubscription: Subscription;

  constructor(
    public element: ElementRef,
    public client: Client,
    public route: ActivatedRoute,
    public thirdpartynetworks: ThirdPartyNetworksService
  ) {
    this.minds = window.Afs;
    this.getCategories();
  }

  ngOnInit() {
    this.paramsSubscription = this.route.params.subscribe(params => {
      if (params['guid'] && params['guid'] === this.session.getLoggedInUser().guid) {
        this.load(true);
      } else {
        this.load(false);
      }
    });
  }

  ngAfterViewInit() {
    if (this.card && this.card !== '') {
      const el = this.element.nativeElement.querySelector('.m-settings--' + this.card);
      window.scrollTo(0, el.offsetTop - 64); // 64 comes from the topbar's height
    }
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  load(remote: boolean = false) {
    if (!remote) {
      const user = this.session.getLoggedInUser();
      this.name = user.name;
    }

    this.client.get('api/v1/settings/' + this.guid)
      .then((response: any) => {
        console.log('LOAD', response.channel);
        this.email = response.channel.email;
        this.mature = !!parseInt(response.channel.mature, 10);
        this.enabled_mails = !parseInt(response.channel.disabled_emails, 10);
        this.language = response.channel.language || 'en';
        this.selectedCategories = response.channel.categories || [];

        this.thirdpartynetworks.overrideStatus(response.thirdpartynetworks);

        if (window.Afs.user) {
          window.Afs.user.mature = this.mature;
        }
        if (this.selectedCategories.length > 0) {
          this.selectedCategories.forEach((item, index, array) => {
            const i: number = this.categories.findIndex(i => i.id === item);
            if (i !== -1)
              this.categories[i].selected = true;
          });
        }
      });
  }

  canSubmit() {
    //if (!this.changed)
     // return false;

    if ((this.password && !this.password1) || (this.password && !this.password2))
	{
		this.error = 'یکی از رمزهای عبور خالی است .';
		return false;
	}
	
    if (this.password1 && !this.password) {
      this.error = 'رمز عبور فعلی خود را باید وارد کنید';
      return false;
    }

    if (this.password1 !== this.password2) {
      this.error = 'رمز عبور ها باهم یکسان نیستند';
      return false;
    }

    this.error = '';

    return true;
  }

  change() {
    this.changed = true;
    this.saved = false;
  }

  save() {
    if (!this.canSubmit())
      return;

    this.inProgress = true;
	
	let data : any =[];
	
	if (this.password)
		data.password= this.password;
	
	if (this.password2)
		data.new_password= this.password2;	
	
	if (this.name)
		data.name= this.name;	
	
	if (this.email)
		data.email= this.email;
	
	data.disabled_emails= 0;
	if (this.enabled_mails)
		data.disabled_emails= 1;
	
	data.mature= 0;
	if (this.mature)
		data.mature= 1;
	 
		
	if (this.language)
		data.language= this.language;
	 
		
	if (this.selectedCategories)
		data.categories= this.selectedCategories;
	 
		
	
	
	
    this.client.post('api/v1/settings/' + this.guid,data)
      .then((response: any) => {
		
        this.changed = false;
        this.saved = true;
        this.error = '';

        this.password = '';
        this.password1 = '';
        this.password2 = '';
		alert('اطلاعات با موفقیت ذخیره شد .');
        if (window.Afs.user) {
          window.Afs.user.mature = this.mature ? 1 : 0;

          if (window.Afs.user.name !== this.name) {
            window.Afs.user.name = this.name;
          }

        }

        if (this.language !== window.Afs['language']) {
          window.location.reload(true);
        }

        this.inProgress = false;
      });
  }

  // Third Party Networks

  connectFb() {
    this.thirdpartynetworks.connect('facebook')
      .then(() => {
        this.load();
      });
  }

  connectTw() {
    this.thirdpartynetworks.connect('twitter')
      .then(() => {
        this.load();
      });
  }

  removeFbLogin() {
    this.thirdpartynetworks.removeFbLogin();
  }

  removeFb() {
    this.thirdpartynetworks.disconnect('facebook');
  }

  removeTw() {
    this.thirdpartynetworks.disconnect('twitter');
  }

  getCategories() {
    this.categories = [];

    for (let id in window.Afs.categories) {
      this.categories.push({
        id: id,
        label: window.Afs.categories[id].title,
        selected: false
      });
    }

    this.categories.sort((a, b) => a.label > b.label ? 1 : -1);
  }

  onCategoryClick(category) {
    category.selected = !category.selected;

    if (category.selected) {
      this.selectedCategories.push(category.id);
    } else {
      this.selectedCategories.splice(this.selectedCategories.indexOf(category.id), 1);
    }

    this.changed = true;
    this.saved = false;
  }
}
