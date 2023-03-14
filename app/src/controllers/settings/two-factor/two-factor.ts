import { Component } from '@angular/core';

import { Client } from '../../../services/api';

@Component({
    moduleId: module.id,
    selector: 'afs-settings-two-factor',
    inputs: ['object'],
    templateUrl: 'two-factor.html'
})

export class SettingsTwoFactor {

    minds: Minds;
    telno: number;
    secret;
    waitingForCheck: boolean = false;
    sendingSms: boolean = false;
    object: any;

    inProgress: boolean = false;
    error: string = '';

    constructor(public client: Client) {
        this.minds = window.Afs;
        this.load();
    }

    load() {
        this.inProgress = true;
        this.client.get('api/v1/twofactor')
            .then((response: any) => {
                //if (response.telno)
                //this.telno = response.telno;
                this.inProgress = false;
            });
    }

    setup(smsNumber: any) {
        this.telno = smsNumber;
        this.waitingForCheck = true;
        this.sendingSms = true;
        this.error = '';
        this.client.post('api/v1/twofactor/setup', { tel: smsNumber })
            .then((response: any) => {
                this.secret = response.secret;
                this.sendingSms = false;
            })
            .catch(e => {
                this.waitingForCheck = false;
                this.sendingSms = false;
                this.telno = null;
                this.error = e.message;
            });
    }

    check(code: number) {
        this.client.post('api/v1/twofactor/check/' + this.secret, {
            code: code,
            telno: this.telno
        })
            .then((response: any) => {
                this.waitingForCheck = false;
            })
            .catch((response: any) => {
                this.waitingForCheck = false;
                this.telno = null;
                this.error = 'کد نادرست است، لطفا دوباره تلاش کنید.';
            });
    }

    retry() {
        this.telno = null;
        this.waitingForCheck = false;
    }

    cancel() {
        this.client.delete('api/v1/twofactor');
        this.telno = null;
        this.error = '';
    }

}