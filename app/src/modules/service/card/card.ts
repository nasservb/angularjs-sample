import { Component } from '@angular/core';
import { SessionFactory } from '../../../services/session';
import { AttachmentService } from '../../../services/attachment';
import { ACCESS } from '../../../services/list-options';


@Component({
  moduleId: module.id,
  selector: 'afs-card-service',

  inputs: ['_service : object'],
  templateUrl: 'card.html'
})

export class ServiceCard {
  minds;
  service;
  session = SessionFactory.build();
  access = ACCESS;

  constructor(public attachment: AttachmentService) {
    this.minds = window.Afs;
  }

  set _service(value: any) {
    if (!value.thumbnail_src || !value.header_bg)
      value.thumbnail_src = 'assets/logos/service.jpg';
    this.service = value;
  }

}
