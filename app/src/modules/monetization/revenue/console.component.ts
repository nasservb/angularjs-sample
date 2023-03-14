import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Client } from '../../../common/api/client.service';
import { Session, SessionFactory } from '../../../services/session';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'm-revenue--console',
  templateUrl: 'console.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class RevenueConsoleComponent {

  currency: string = 'usd';
  balance: number | string = 0;
  payouts: number | string = 0;
  net: number | string = 0;
  ready: boolean = false;
  session: Session = SessionFactory.build();


  filter: string = 'payments';
  ledgerType: string = 'charge';

  constructor(private client: Client, private cd: ChangeDetectorRef,private router: Router) {

  }

  ngOnInit() {
    /**
     * Remove wallet
     * M.Barzegar
     * 1396-08-10 13:16
     */
    if (this.session.isLoggedIn() || !this.session.isLoggedIn()) {
        this.router.navigate(['/newsfeed']);
        return;
    }
    this.getTotals();
  }

  getTotals() {
    this.client.get('api/v1/monetization/revenue/overview')
      .then((response: any) => {
        this.currency = response.currency;
        this.balance = response.balance;
        this.payouts = response.payouts;
        this.net = response.total.net;
        this.ready = true;

        this.cd.markForCheck();
        this.cd.detectChanges();
      });
  }

  getCurrencySymbol(currency) {
    switch (currency) {
      case 'gbp':
        return '£';
      case 'eur':
        return '€';
      case 'usd':
      default:
        return '$';
    }
  }

}
