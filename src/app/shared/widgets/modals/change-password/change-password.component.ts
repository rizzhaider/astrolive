import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {


  @ViewChild('ChangePasswordModal') _ChangePasswordModal: any;

  constructor() { }

  ngOnInit() {
  }
 openModal() {
   
    this._ChangePasswordModal.show();
  }
}
