import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';
import { faUser, faSignOutAlt} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userDetails: any = {};
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;

  constructor(private userService: UserService, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.userService.getUserDetails()
    .subscribe(userData => {
      this.userDetails = userData;
    });
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
