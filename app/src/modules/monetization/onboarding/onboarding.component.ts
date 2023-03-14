import { Component, OnInit, Output, EventEmitter, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Client } from '../../../services/api';

import { requiredFor, optionalFor } from './onboarding.validators';

@Component({
    selector: 'm-monetization--onboarding',
    templateUrl: 'onboarding.component.html'
})
export class MonetizationOnboardingComponent implements OnInit {

    form: FormGroup;
    inProgress: boolean = false;
    restrictAsVerified: boolean = false;
    user = window.Afs.user;
    minds = window.Afs;
    merchant: any;
    error: string;

    /**
     * add parameter for sending sms
     * M.Barzegar
     * 1396-07-24 8:40
     */
    telno: number;
    secret;
    waitingForCheck: boolean = false;
    sendingSms: boolean = false;
    //End it


    @Input() edit: boolean = false;

    @Output() completed: EventEmitter<any> = new EventEmitter<any>();

    constructor(private fb: FormBuilder, private client: Client, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.form = this.fb.group({
            country: [''],
            firstName: [''],
            lastName: [''],
            gender: ['',Validators.required],
            dob: [''],
            city: [''],
            phoneNumber: ['',Validators.required],
            profileAgree: ['', Validators.required]
        });
        this.restrictAsVerified = false;

        if (this.merchant) {
            if (this.edit) {
                this.merchant.profileAgree = true;
                this.restrictAsVerified = this.merchant.verified;
            }

            this.form.patchValue(this.merchant);
        }

        this.disableRestrictedFields();
    }

    @Input('merchant') set _merchant(value) {
        if (!value) {
            return;
        }

        this.restrictAsVerified = false;

        if (this.form) {
            if (this.edit) {
                value.profileAgree = true;
            }

            this.form.patchValue(value);
        }

        this.merchant = value;
        this.restrictAsVerified = this.merchant.verified;
        this.disableRestrictedFields();
    }

    submit() {
        if (!this.edit) {
            this.onboard();
        } else {
            this.update();
        }
    }

    onboard() {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.error = '';

        this.client.post('api/v1/merchant/onboard', this.form.value)
            .then((response: any) => {
                this.inProgress = false;

                if (!this.minds.user.programs)
                    this.minds.user.programs = [];
                this.minds.user.programs.push('affiliate');

                this.completed.emit(response);
                this.detectChanges();
            })
            .catch((e) => {
                this.inProgress = false;
                this.error = e.message;
                this.detectChanges();
            });
    }

    update() {
        if (this.inProgress) {
            return;
        }

        this.inProgress = true;
        this.error = '';

        this.client.post('api/v1/merchant/update', this.form.value)
            .then((response: any) => {
                this.inProgress = false;
                this.completed.emit(response);
                this.detectChanges();
            })
            .catch((e) => {
                this.inProgress = false;
                this.error = e.message;
                this.detectChanges();
            });
    }

    disableRestrictedFields() {
        if (!this.form) {
            return;
        }

        const action = this.restrictAsVerified ? 'disable' : 'enable';

        this.form.controls.firstName[action]();
        this.form.controls.lastName[action]();
        this.form.controls.gender[action]();
        this.form.controls.dob[action]();
        this.form.controls.street[action]();
        this.form.controls.city[action]();
        this.form.controls.state[action]();
        this.form.controls.postCode[action]();
        this.form.controls.phoneNumber[action]();
    }

    isCountry(countries: string[]) {
        const currentCountry = this.form.controls.country.value;
        return countries.indexOf(currentCountry) > -1;
    }

    detectChanges() {
        this.cd.markForCheck();
        this.cd.detectChanges();
    }
    /**
     * setup for sending sms
     * @param smsNumber
     * M.Barzegar
     * 1396-07-24 8:40
     */
    setup() {
        if(this.user && this.user.merchant.id)
        {
            location.reload();
        }
        else
        {
            this.telno = this.form.value.phoneNumber;
            this.waitingForCheck = true;
            this.sendingSms = true;
            this.error = '';
            this.client.post('api/v1/twofactor/setup', {tel: this.form.value.phoneNumber})
                .then((response: any) => {
                    this.secret = response.secret;
                    this.sendingSms = false;
                })
                .catch((e) => {
                    this.waitingForCheck = false;
                    this.sendingSms = false;
                    this.telno = null;
                    this.inProgress = false;
                    this.error = e.message;
                    alert(e.message);
                    location.reload();
                });
        }
    }

    check(code: number) {
        this.client.post('api/v1/twofactor/check/' + this.secret, {
            code: code,
            telno: this.telno
        })
            .then((response: any) => {
                this.waitingForCheck = false;
                this.submit();
                location.href = '/newsfeed';
            })
            .catch((response: any) => {
                this.waitingForCheck = false;
                this.telno = null;
                this.error = 'کد نادرست است، لطفا دوباره تلاش کنید. ';
            });
    }

    cancel() {
        this.client.delete('api/v1/twofactor');
        this.telno = null;
        this.error = '';
    }

    checkagain(code: number) {
        this.telno = null;
        this.inProgress = false;
        this.error = '';
        location.reload();
    }
}