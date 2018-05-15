import { Follower } from './../../shared/models/follower.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-followers-list',
  templateUrl: './followers-list.component.html',
  styleUrls: ['./followers-list.component.css']
})
export class FollowersListComponent implements OnInit {
  @Input() public followersList: Follower[] = [];
  @Output() followerSelected: EventEmitter<Follower> = new EventEmitter();
  @Output() scrolledDown: EventEmitter<void> = new EventEmitter<void>();
  constructor() { }

  ngOnInit() {
  }

  onFollowerSelected(follower: Follower) {
    this.followerSelected.emit(follower);
  }

  onScroll() {
   this.scrolledDown.emit();
  }

}
