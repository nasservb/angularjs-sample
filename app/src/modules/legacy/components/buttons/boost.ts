import { Component } from '@angular/core';

import { SessionFactory } from '../../../../services/session';
import { Client } from '../../../../services/api';
import { WalletService } from '../../../../services/wallet';
import { OverlayModalService } from '../../../../services/ux/overlay-modal';

import { BoostCreatorComponent } from '../../../boost/creator/creator.component';

@Component({
  selector: 'afs-button-boost',
  inputs: ['object'],
  template: `      
  `
})

export class BoostButton {

  object = {
    'guid': null
  };
  session = SessionFactory.build();
  showModal: boolean = false;

  constructor(private overlayModal: OverlayModalService) {
  }

  boost() {
    const creator = this.overlayModal.create(BoostCreatorComponent, this.object);
    creator.present();
  }

}
