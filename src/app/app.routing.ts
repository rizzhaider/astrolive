import { CallHistoryComponent } from './callhistory/callhistory.component';
import { FollowersComponent } from './followers/followers.component';
import { TipsComponent } from './tips/tips.component';
import { ProfileComponent } from './profile/profile.component';
import { QnaComponent } from './qna/qna.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { Routes, RouterModule } from '@angular/router';


const appRoutes: Routes = [
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'qna', component: QnaComponent, canActivate: [AuthGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'tips', component: TipsComponent, canActivate: [AuthGuard] },
    { path: 'callhistory', component: CallHistoryComponent, canActivate: [AuthGuard] },
    { path: 'followers', component: FollowersComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
   
    // otherwise redirect to home
    { path: '**', redirectTo: 'profile' }
];

export const routing = RouterModule.forRoot(appRoutes);