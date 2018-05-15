import { Follower } from './../../shared/models/follower.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-follower-item',
  templateUrl: './follower-item.component.html',
  styleUrls: ['./follower-item.component.css']
})
export class FollowerItemComponent implements OnInit {
  @Input() public follower: Follower;
  @Output() public followerSelected: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  onSelectFollower() {
      this.followerSelected.emit();
      this.follower.isActive = true;
  }

}
