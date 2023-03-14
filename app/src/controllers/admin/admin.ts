import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Client, Upload } from '../../services/api';
import { MindsTitle } from '../../services/ux/title';
import { Session, SessionFactory } from '../../services/session';

@Component({
  selector: 'afs-admin',
  template: `

    <afs-admin-media *ngIf="filter == 'media'"></afs-admin-media>
    <afs-admin-analytics *ngIf="filter == 'analytics'"></afs-admin-analytics>
    <afs-admin-boosts *ngIf="filter == 'boosts'"></afs-admin-boosts>
    <afs-admin-pages *ngIf="filter == 'pages'"></afs-admin-pages>
    <afs-admin-reports *ngIf="filter == 'reports' || filter == 'appeals'"></afs-admin-reports>
    <afs-admin-monetization *ngIf="filter == 'monetization'"></afs-admin-monetization>
    <afs-admin-comments *ngIf="filter == 'comments'"></afs-admin-comments>
    <afs-admin-programs *ngIf="filter == 'programs'"></afs-admin-programs>
    <afs-admin-payouts *ngIf="filter == 'payouts'"></afs-admin-payouts>
    <afs-admin-featured *ngIf="filter == 'featured'"></afs-admin-featured>
    <afs-admin-tagcloud *ngIf="filter == 'tagcloud'"></afs-admin-tagcloud>
    <m-admin--verify *ngIf="filter == 'verify'"></m-admin--verify>
  `
})

export class Admin {

  filter: string = '';
  session: Session = SessionFactory.build();
  paramsSubscription: Subscription;

  constructor(private route: ActivatedRoute, public title: MindsTitle, public router: Router) {
  }

  ngOnInit() {

    let node = document.createElement('script');
    node.src = "/js/tinymce.min.js";
    document.getElementsByTagName('head')[0].appendChild(node);

    if (!this.session.isAdmin()) {
      this.router.navigate(['/']);
    }

    this.title.setTitle('Admin');
    this.paramsSubscription = this.route.params.subscribe((params: any) => {
      if (params['filter']) {
        this.filter = params['filter'];
      }
    });
  }

  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }
}
