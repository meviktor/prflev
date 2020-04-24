import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from "./_guards/auth.gurad";
import { HomeComponent } from './home/home.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { UserDetailsComponent } from './userdetails/userdetails.component';
import { AuctionSearchComponent } from './auction-search/auction-search.component';
import { CreateAuctionComponent } from './create-auction/create-auction.component';


const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'auctionDetails/:id', component: AuctionDetailsComponent, canActivate: [AuthGuard] },
  { path: 'userDetails/:id', component: UserDetailsComponent, canActivate: [AuthGuard] },
  { path: 'auctionSearch', component: AuctionSearchComponent, canActivate: [AuthGuard] },
  { path: 'createAuction', component: CreateAuctionComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
