import { Component, EventEmitter, OnInit, Input, Output } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'afs-country-input',
    template: `
        <select style="padding-right: 28px;" [ngModel]="country" (ngModelChange)="country = $event; countryChange.next($event)">
            <option value="" disabled hidden><i>استان</i></option>
            <option *ngFor="let country of countries"
                    [value]="country.code"
            >{{ country.name }}</option>
        </select>
    `
})

export class CountryInputComponent {

    countries : Array<{name : string, code : string}> = [
        {'name': 'آذربایجان شرقی', 'code': 'آذربایجان شرقی'},
        {'name': 'آذربایجان غربی', 'code': 'آذربایجان غربی'},
        {'name': 'اردبیل', 'code': 'اردبیل'},
        {'name': 'اصفهان', 'code': 'اصفهان'},
        {'name': 'البرز', 'code': 'البرز'},
        {'name': 'بوشهر', 'code': 'بوشهر'},
        {'name': 'تهران', 'code': 'تهران'},
        {'name': 'چهارمحال و بختیاری', 'code': 'چهارمحال و بختیاری'},
        {'name': 'خراسان جنوبی', 'code': 'خراسان جنوبی'},
        {'name': 'خراسان رضوی', 'code': 'خراسان رضوی'},
        {'name': 'خراسان شمالی', 'code': 'خراسان شمالی'},
        {'name': 'خوزستان', 'code': 'خوزستان'},
        {'name': 'زنجان', 'code': 'زنجان'},
        {'name': 'سمنان', 'code': 'سمنان'},
        {'name': 'سیستان و بلوچستان', 'code': 'سیستان و بلوچستان'},
        {'name': 'فارس', 'code': 'فارس'},
        {'name': 'قزوین', 'code': 'قزوین'},
        {'name': 'قم', 'code': 'قم'},
        {'name': 'كردستان', 'code': 'كردستان'},
        {'name': 'كرمان', 'code': 'كرمان'},
        {'name': 'كرمانشاه', 'code': 'كرمانشاه'},
        {'name': 'کهگیلویه و بویراحمد', 'code': 'کهگیلویه و بویراحمد'},
        {'name': 'گلستان', 'code': 'گلستان'},
        {'name': 'گیلان', 'code': 'گیلان'},
        {'name': 'لرستان', 'code': 'لرستان'},
        {'name': 'مازندران', 'code': 'مازندران'},
        {'name': 'مركزی', 'code': 'مركزی'},
        {'name': 'هرمزگان', 'code': 'هرمزگان'},
        {'name': 'همدان', 'code': 'همدان'},
        {'name': 'یزد', 'code': 'یزد'},
    ];

    filteredCountries: Array<{ name: string, code: string }> = [];

    @Input() country : string = '';
    @Input('allowed') set _allowed(allowed: string[]) {
        if (!allowed) {
            this.filteredCountries = this.countries;
            return;
        }

        this.filteredCountries = this.countries.filter(item => {
            return allowed.indexOf(item.code) > -1;
        });
    }

    @Output() countryChange: EventEmitter<any> = new EventEmitter();
}