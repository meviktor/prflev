import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ErrorInterceptor } from './_helpers/error.interceptor';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AuctionDetailsComponent } from './auction-details/auction-details.component';
import { UserDetailsComponent } from './userdetails/userdetails.component';
import { AuctionSearchComponent } from './auction-search/auction-search.component';
import { CategoryDropDownFormatter } from './_utils/categoryDropdownFormatter';
import { JsonDateParserExtension } from './_utils/jsonDateParserExtension';
import { CreateAuctionComponent } from './create-auction/create-auction.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AuctionDetailsComponent,
    UserDetailsComponent,
    AuctionSearchComponent,
    CreateAuctionComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: CategoryDropDownFormatter },
    { provide: JsonDateParserExtension }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
