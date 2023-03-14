import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription } from 'rxjs/Rx';

import { MindsTitle } from '../../../services/ux/title';
import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

@Component({
    moduleId: module.id,
    selector: 'afs-register',
    templateUrl: 'forgot-password.html'
})

export class ForgotPassword {

    session = SessionFactory.build();
    error: string = '';
    inProgress: boolean = false;
    step: number = 1;

    username: string = '';
    code: string = '';
    secret: string = '';

    paramsSubscription: Subscription;

    constructor(public client: Client, public router: Router, public route: ActivatedRoute, public title: MindsTitle) {
    }

    ngOnInit() {
        this.title.setTitle('فراموشی رمز عبور');

        this.paramsSubscription = this.route.params.subscribe((params) => {
            if (params['code']) {
                this.setCode(params['code']);
            }

            if (params['username']) {
                this.username = params['username'];
            }
        });
    }

    ngOnDestroy() {
        this.paramsSubscription.unsubscribe();
    }

    request(username) {
        this.error = '';
        this.inProgress = true;
        var self = this;
        this.client.post('api/v1/forgotpassword/request', {
            username: username.value
        })
            .then((data: any) => {
                this.username = username.value;
                username.value = '';

                this.secret = data.secret;
                this.inProgress = false;
                self.step = 2;
                //self.router.navigate(['/Homepage', {}]);
            })
            .catch((e) => {

                this.inProgress = false;
                if (e.status === 'failed') {
                    self.error = 'There was a problem trying to reset your password. Please try again.';
                }

                if (e.status === 'error') {
                    self.error = e.message;
                }

            });
    }

    setCode(code: string) {
        this.step = 3;
        this.code = code;
    }

    verifyCode(code) {
		this.error = '';
        this.inProgress = true;
        var self = this;
		
		this.code = code.value;
		
        this.client.post('api/v1/forgotpassword/verify', {
            code: code.value,username:this.username,secret:this.secret
        })
            .then((data: any) => {

                this.inProgress = false;
                self.step = 3;
                
				
            })
            .catch((e) => {

                this.inProgress = false;
                if (e.status === 'failed') {
                    self.error = 'خطایی در بازیابی رمز شما اتفاق افتاد . لطفآ دوباره درخواست  نمائید . .';
                }

                if (e.status === 'error') {
                    self.error = e.message;
                }

            });
	}
	
    reset(password) {
        var self = this;
        this.client.post('api/v1/forgotpassword/reset', {
            password: password.value,
            code: this.code,
            secret: this.secret,
            username: this.username
        })
            .then((response: any) => {
                self.session.login(response.user);
                self.router.navigate(['/newsfeed']);
            })
            .catch((e) => {
                self.error = e.message;
                setTimeout(() => {
                    self.router.navigate(['/login']);
                }, 2000);
            });
    }

}