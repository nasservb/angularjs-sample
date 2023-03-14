import { Component, EventEmitter, ViewChild, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Client } from '../../../services/api';
import { SessionFactory } from '../../../services/session';


@Component({
  moduleId: module.id,
  selector: 'afs-form-register',
  templateUrl: 'register.html'
})

export class RegisterForm {

  session = SessionFactory.build();
  errorMessage: string = '';
  twofactorToken: string = '';
  
  secret: string = '';
  
  isVerificationCode: boolean = false;
  
  inProgress: boolean = false;
  
  user : any; 
  guid : string =''; 
   
  
  @Input() referrer: string;
  captcha: string;

  form: FormGroup;
  minds = window.Afs;

  @Output() done: EventEmitter<any> = new EventEmitter();

  //@ViewChild('reCaptcha') reCaptcha: ReCaptchaComponent;

  constructor(public client: Client, fb: FormBuilder) {
    this.form = fb.group({
      username: ['', Validators.required],
      mobile: ['', Validators.required],
      password: ['', Validators.required],
      password2: ['', Validators.required],
      verfyCode: ['']
    });
  }

  register(e) {
	  
    e.preventDefault();
    this.errorMessage = '';

	
	console.log(this.form.value.mobile.toString()) ; 	
	
	console.log(this.form.value.mobile.toString()) ; 	
	
	
    if (this.form.value.mobile.toString().length != 11 || !this.form.value.mobile.toString().startsWith('09') ) {
      this.errorMessage = 'شماره موبایل وارد شده صحیح نیست .لطفآ با اعداد انگلیسی وارد نمائید';
      return;
    }
	
    if (this.form.value.password !== this.form.value.password2) {
      this.errorMessage = 'رمزهای عبور باید یکسان باشند.';
      return;
    }

    this.form.value.referrer = this.referrer;

    this.inProgress = true;
    
	var self = this; //this <=> that for promises
    
	this.client.post('api/v1/register/register', this.form.value)
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

        this.inProgress = false;
		
		this.guid = data.guid ; 
		
		this.secret = data.secret ; 
		
		this.isVerificationCode = true ; 
		
		this.verificationCode(); 
		
		
      })
      .catch((e) => {
      
        this.inProgress = false;
          

        if (e.status === 'failed') {
          //incorrect login details
          self.errorMessage = 'نام کاربری یا رمزعبور صحیح نمی باشد،';
          
        }

        if (e.status === 'error') {
          //two factor?
          self.errorMessage = e.message;
          
        }

        return;
      });
  }
  
  
  verificationCode() 
  { 
       alert("کد فعال سازی به شماره موبایل شما ارسال شد ." );
  }
  
  verify(e)  
  { 
	e.preventDefault();
    this.errorMessage = '';

    if (this.form.value.verfyCode.toString().length < 4 ) {

      this.errorMessage = 'کد دریافتی را وارد نمائید.';
      return;
    }

    this.form.value.referrer = this.referrer;

    this.inProgress = true;
    
	var self = this; //this <=> that for promises
	
	let verifyData = [];  
	
    verifyData['code'] = this.form.value.verfyCode;
	
	
    verifyData['user'] = this.guid;
	
    verifyData['secret'] = this.secret;
	

	
	this.client.post('api/v1/register/verify',{code:this.form.value.verfyCode,user:this.guid,secret:this.secret,mobile:this.form.value.mobile} )
      .then((data: any) => {
        // TODO: [emi/sprint/bison] Find a way to reset controls. Old implementation throws Exception;

		
        
         
		
        this.inProgress = false;
		
        this.user = data.user;
		
        this.session.login(this.user);
 
        this.done.next(this.user);
	})
    .catch((e) => {
        console.log(e);
        this.inProgress = false;
		
     
 
        if (e.status === 'failed') {
          //incorrect login details
          this.errorMessage = 'کد دریافتی صحیح نیست .';
          this.session.logout();
        }

        if (e.status === 'error') {
          //two factor?
          this.errorMessage = 'خطا در فعال سازی . لطفآ لحظاتی دیگر تلاش نمائید یا با ایمیل info@itimcheh.ir مکاتبه نمائید  .';
          this.session.logout();
        }

        return;
    });



	  
  }

  
	reSend(e) 
	{ 	   
		e.preventDefault();
	    this.form.value.verfyCode = "" ;
		 
		
        this.client.post('api/v1/register/resend',this.form.value)
		  .then((data: any) => {			

			this.inProgress = false;
			
			alert("کد فعال سازی به شماره موبایل شما ارسال شد .");
			
		})
		  .catch((e) => {
			console.log(e);
			this.inProgress = false;
			

			if (e.status === 'failed') {
			  //incorrect login details
			  this.errorMessage = 'خطا در ارسال کد جدید . لطفآ لحظاتی دیگر تلاش نمائید یا با ایمیل info@itimcheh.ir مکاتبه نمائید  .';
			  
			}

			if (e.status === 'error') {
			  //two factor?
			  this.errorMessage = 'خطا در ارسال کد جدید . لطفآ لحظاتی دیگر تلاش نمائید یا با ایمیل info@itimcheh.ir مکاتبه نمائید  .';
			  
			}

			return;
		});
  }

  
  
  
}
