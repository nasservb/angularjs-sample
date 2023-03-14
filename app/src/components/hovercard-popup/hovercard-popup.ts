import { Component } from '@angular/core';

import { HovercardService } from '../../services/hovercard';

@Component({
  selector: 'm-hovercard-popup',
  template: `
    <div class="afs-avatar-hovercard mdl-shadow--8dp"
    *ngIf="hovercardService.shown && hovercardService.data"
    [style.top]="hovercardService.anchor.top"
    [style.right]="hovercardService.anchor.right"
    [style.bottom]="hovercardService.anchor.bottom"
    [style.left]="hovercardService.anchor.left"
    (mouseenter)="hovercardService.stick(hovercardService.data.guid)"
    (mouseleave)="hide(hovercardService.data.guid)"
    >
      <afs-card-user [object]="hovercardService.data"></afs-card-user>
    </div>
  `
})
export class HovercardPopup {
  constructor(public hovercardService: HovercardService) {}

  hide(guid: any) {
    this.hovercardService.unstick();

    setTimeout(() => {
      this.hovercardService.hide(guid);
    }, 250);
  }
}
