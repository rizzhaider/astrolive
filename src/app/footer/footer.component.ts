import { environment } from './../../environments/environment.qa';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  appVersion: string = "1.1";
  private baseURL = environment.baseRESTURI;
  @Input() sidebarCollapsed: boolean  = false;
  constructor() { }

  ngOnInit() {
  }

}
