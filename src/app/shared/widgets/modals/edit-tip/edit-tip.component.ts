import { LogService } from 'ng2-log-service';
import { AlertService } from './../../../services/alert.service';
import { UserTipsService } from './../../../services/user-tips.service';
import { Tip } from './../../../models/user-tip';
import { Component, OnInit, ViewChild, Input, Output, SimpleChange, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-edit-tip',
  templateUrl: './edit-tip.component.html',
  styleUrls: ['./edit-tip.component.css'],
  providers: [AlertService, LogService]
})
export class EditTipComponent implements OnInit {
  @ViewChild('editTipModal') _editTipModal: any;
  @Output() tipUpdated: EventEmitter<void> = new EventEmitter<void>();
  public tip: Tip = new Tip();
  public tipText: string = '';
  constructor(private tipsService: UserTipsService,
    private alertService: AlertService,
    private logService: LogService) {
    this.logService.namespace = 'EditTipComponent';
  }

  ngOnInit() {
  }

  openModal(tip: Tip) {
    this.tip = tip;
    this.tipText = tip.tip;
    this._editTipModal.show();
  }

  updateTip(form: NgForm) {
    this.tipsService.editAstroTip(this.tipText, this.tip.id)
      .subscribe(
      data => {
        this.logService.debug('Received updatedTip response', data);
        this._editTipModal.hide();
        this.tipUpdated.emit();

      },
      error => {
        this.logService.error(error);
      });
  }

}
