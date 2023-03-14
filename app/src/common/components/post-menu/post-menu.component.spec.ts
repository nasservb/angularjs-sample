///<reference path="../../../../../node_modules/@types/jasmine/index.d.ts"/>
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, Directive, ChangeDetectionStrategy, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';

import { Session, SessionFactory } from '../../../services/session';
import { OverlayModalService } from '../../../services/ux/overlay-modal';
import { Client } from '../../../services/api/client';
import { ReportCreatorComponent } from '../../../modules/report/creator/creator.component';
import { MindsUser } from '../../../interfaces/entities';
import { SignupModalService } from '../../../modules/modals/signup/service';
import { By } from '@angular/platform-browser';
import { PostMenuComponent } from './post-menu.component';
import { CommonModule as NgCommonModule } from '@angular/common';
import { overlayModalServiceMock } from '../../../../tests/overlay-modal-service-mock.spec';
import { clientMock } from '../../../../tests/client-mock.spec';
/*
import { sessionMock } from '../../../../tests/session-mock.spec';
*/
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
/* tslint:disable */

/* Mock section */


@Component({
  selector: 'm-modal-share',
  template: ''
})
class ModalShareMock {
  @Input() open;
  @Input() url;
  @Input() embed;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal',
  template: '<ng-content></ng-content>'
})
class MindsModalMock {
  @Input() open: any;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal-report',
  template: ''
})

class ModalReportMock {
  @Input() open;
  @Input() object;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
}

@Component({
  selector: 'm-modal-confirm',
  template: ''
})
class ModalConfirmMock {
  @Input() open;
  @Input() closeAfterAction;
  @Input() yesButton;
  @Output() closed: EventEmitter<any> = new EventEmitter<any>();
  @Output() actioned: EventEmitter<any> = new EventEmitter<any>();
}

let scrollServiceMock = new function () {
  this.initOnScroll = jasmine.createSpy('initOnScroll').and.stub();
  this.open = jasmine.createSpy('open').and.stub();
  this.close = jasmine.createSpy('close').and.stub();
};

/* ENd of mock section */
describe('PostMenuComponent', () => {

  let comp: PostMenuComponent;
  let fixture: ComponentFixture<PostMenuComponent>;
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MindsModalMock,
        ModalShareMock,
        ModalConfirmMock,
        ModalReportMock,
        PostMenuComponent
      ], // declare the test component
      imports: [
        RouterTestingModule,
        NgCommonModule,
        FormsModule
      ],
      providers: [
        { provide: SignupModalService, useValue: scrollServiceMock},
        { provide: Client, useValue: clientMock },
/*
        { provide: Session, useValue: sessionMock },
*/
        { provide: OverlayModalService, useValue: overlayModalServiceMock }
      ]
    })
      .compileComponents();  // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(PostMenuComponent);

    comp = fixture.componentInstance;
    comp.options = ["edit", "translate", "share", "mute", "unmute", "feature", "unfeature", "delete", "report", "block" ];
    comp.entity = {};
    comp.opened = true;
    comp.entity.ownerObj = { guid : '1'}
    fixture.detectChanges();
  });

  it('should have dropdown', () => {
    expect(fixture.debugElement.query(By.css('.afs-dropdown-menu'))).not.toBeNull();
  });

  it('should check if owner is blocked when opening dropdown', () => {
    comp.cardMenuHandler();
    fixture.detectChanges();
    expect(clientMock.get.calls.mostRecent().args[0]).toEqual('api/v1/block/1');
  });

  it('should put to owner when blocking', () => {
    comp.cardMenuHandler();
    fixture.detectChanges();
    comp.block();
    fixture.detectChanges();
    expect(clientMock.put.calls.mostRecent().args[0]).toEqual('api/v1/block/1');
  });

  it('should delete to owner when unblocking', () => {
    comp.cardMenuHandler();
    fixture.detectChanges();
    comp.unBlock();
    fixture.detectChanges();
    expect(clientMock.delete.calls.mostRecent().args[0]).toEqual('api/v1/block/1');
  });
});
