import { Component, EventEmitter } from '@angular/core';

import { Client, Upload } from '../../../services/api';
import { SessionFactory } from '../../../services/session';

@Component({
  moduleId: module.id,
  selector: 'afs-form-city-finder',
  outputs: ['done'],
  templateUrl: 'city-finder.html'
})

export class CityFinderForm {

  session = SessionFactory.build();
  error: string = '';
  inProgress: boolean = false;

  city: string = '';
  cities: Array<any> = [];

  done: EventEmitter<any> = new EventEmitter();

  searching;

  constructor(public client: Client, public upload: Upload) {

  }

  findCity(q: string) {
    if (this.searching) {
      clearTimeout(this.searching);
    }
    this.searching = setTimeout(() => {
      this.client.get('api/v1/geolocation/list', { q: q })
        .then((response: any) => {
          this.cities = response.results;
        });
    }, 100);
  }

  setCity(row: any) {
    this.cities = [];
    if (row.address.city)
      window.Afs.user.city = row.address.city;
    if (row.address.town)
      window.Afs.user.city = row.address.town;
    this.city = window.Afs.user.city;
    this.inProgress = true;
    this.client.post('api/v1/channel/info', {
      coordinates: row.lat + ',' + row.lon,
      city: window.Afs.user.city
    })
      .then((response: any) => {
        this.inProgress = false;
        this.done.next(true);
      });
  }


}
