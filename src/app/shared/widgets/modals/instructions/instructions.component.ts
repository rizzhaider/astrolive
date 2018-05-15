import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {
@ViewChild('AstroInstructionModal') _AstroInstructionModal: any;
  constructor() { }

  ngOnInit() {
  }

  openModal(){
    this._AstroInstructionModal.show();
  }

  closeModal() {
    this._AstroInstructionModal.hide();
  }
}
