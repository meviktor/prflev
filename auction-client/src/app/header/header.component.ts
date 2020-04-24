import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Router } from '@angular/router';
import { faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails: any;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;

  constructor(private userService: UserService, private authenticationService: AuthenticationService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUserDetails()
    .subscribe(userData => {
      this.userDetails = userData;
    });
  }

  navigateDashboard() {
    this.router.navigate(["/"]);
  }

  logout() {
    this.authenticationService.logout();
  }
}
