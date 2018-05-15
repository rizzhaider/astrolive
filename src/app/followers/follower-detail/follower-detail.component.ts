import { FollowerProfile } from './../../shared/models/follower-profile.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-follower-detail',
  templateUrl: './follower-detail.component.html',
  styleUrls: ['./follower-detail.component.css']
})
export class FollowerDetailComponent implements OnInit {
  @Input() selectedProfile: FollowerProfile;

  constructor() { }

  ngOnInit() {
  }

}
