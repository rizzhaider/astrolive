import { DisableChildInputsDirective } from './shared/directives/disable-child-inputs.directive';
import { FilterPipe } from './shared/pipes/filter.pipe';
import { DatePipe } from '@angular/common';
import { CallHistoryService } from './shared/services/callhistory.service';
import { UserWebDeviceService } from './shared/services/user-web-device.service';
import { AppLogListener } from './shared/services/logging/app-log.listener';
import { DetectEnterDirective } from './shared/directives/detect-enter.directive';
import { SidebarCollapseDirective } from './shared/directives/sidebar-collapse.directive';
import { LargeModalComponent } from './shared/widgets/modals/large-modal/large-modal.component';
import { UserDeviceInfoService } from './shared/services/user-device-info.service';
import { UserService } from './shared/services/user.service';
import { UserPresenceService } from './shared/services/user-presence.service';
import { WebSocketService } from './shared/services/websocket.service';
import { DropDownDirective } from './shared/directives/dropdown.directive';
import { AlertComponent } from './alert/alert.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { AuthenticationService } from './shared/services/authentication.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { AppComponent } from './app.component';
import { routing }        from './app.routing';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { FollowersComponent } from './followers/followers.component';
import { ProfileComponent } from './profile/profile.component';
import { TipsComponent } from './tips/tips.component';
import { QnaComponent } from './qna/qna.component';
import { UserProfileService } from './shared/services/user-profile.service';
import { UserFollowersService } from './shared/services/user-followers.service';
import { UserTipsService } from './shared/services/user-tips.service';
import { UserQAService } from './shared/services/user-qa.service';
import { ModalModule } from 'ngx-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { QnaItemComponent } from './qna/qna-item/qna-item.component';
import { QnaListComponent } from './qna/qna-list/qna-list.component';
import { QnaDetailComponent } from './qna/qna-detail/qna-detail.component';
import { AnswerListComponent } from './qna/qna-detail/answer-list/answer-list.component';
import { AnswerItemComponent } from './qna/qna-detail/answer-item/answer-item.component';
import { FollowersListComponent } from './followers/followers-list/followers-list.component';
import { FollowerDetailComponent } from './followers/follower-detail/follower-detail.component';
import { FollowerItemComponent } from './followers/follower-item/follower-item.component';
import { EditTipComponent } from './shared/widgets/modals/edit-tip/edit-tip.component';
import { EditProfileComponent } from './shared/widgets/modals/edit-profile/edit-profile.component';
import { SelectModule } from 'ng2-select';
import { UiSwitchModule } from 'ngx-ui-switch/src';
import { TimerComponent } from './call/timer/timer.component';
import { LogModule, ConsoleListener, ExtensionListener, LOG_LISTENER, ConsoleListenerConfig, LogService } from 'ng2-log-service';
import { ChangePasswordComponent } from './shared/widgets/modals/change-password/change-password.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DatepickerModule } from 'ngx-bootstrap';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { InstructionsComponent } from './shared/widgets/modals/instructions/instructions.component';
import { CallHistoryComponent } from './callhistory/callhistory.component';
import { ScheduleComponent } from './shared/widgets/modals/schedule/schedule.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    AlertComponent,
    HeaderComponent,
    SidebarComponent,
    DropDownDirective,
    SidebarCollapseDirective,
    DetectEnterDirective,
    DisableChildInputsDirective,
    FooterComponent,
    FollowersComponent,
    ProfileComponent,
    TipsComponent,
    QnaComponent,
    LargeModalComponent,
    QnaItemComponent,
    QnaListComponent,
    QnaDetailComponent,
    AnswerListComponent,
    AnswerItemComponent,
    FollowersListComponent,
    FollowerDetailComponent,
    FollowerItemComponent,
    EditTipComponent,
    EditProfileComponent,
    TimerComponent,
    ChangePasswordComponent,
    InstructionsComponent,
    CallHistoryComponent,
    ScheduleComponent,
    FilterPipe   
  ],
  imports: [
    BrowserModule,
    FormsModule,
  SelectModule,
  HttpModule,
    routing,
    ModalModule.forRoot(),
    TooltipModule.forRoot(),
    DatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    UiSwitchModule,
    LogModule,
    InfiniteScrollModule

  ],
  providers: [
    AuthGuard,
    AuthenticationService,
    WebSocketService,
    DatePipe,
    UserPresenceService,
    UserService,
    UserDeviceInfoService,
    UserProfileService,
    UserFollowersService,
    UserTipsService,
    UserQAService,
    UserWebDeviceService,
    CallHistoryService,
    LogService,
    ConsoleListenerConfig,
   // { provide: LOG_LISTENER, useClass: ConsoleListener, multi: true, deps: [ConsoleListenerConfig] },
  	{ provide: LOG_LISTENER, useClass: ExtensionListener, multi: true },
    { provide: LOG_LISTENER, useClass: AppLogListener, multi: true }
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
