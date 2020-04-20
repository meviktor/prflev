import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AuctionService } from '../_services/auction.service';
import { first } from 'rxjs/operators';
import { faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-userdetails',
  templateUrl: './userdetails.component.html',
  styleUrls: ['./userdetails.component.css']
})
export class UserDetailsComponent implements OnInit {
  userId: string = window.location.href.split("/").pop();
  userInfo: any;
  usersActiveAuctions: any[] = [];
  userInfoError: string;
  userAuctionError: string;

  faComments = faComments;

  constructor(private userService: UserService, private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.userService.getUserDetails(this.userId)
    .pipe(first())
    .subscribe( userDetails => {
      this.userInfo = userDetails;
    },
    error => {
      this.userInfoError = error;
    });

    this.auctionService.queryAuctions({ownerUserId: this.userId, onlyActive: true})
    .subscribe( usersAuctions => {
      this.usersActiveAuctions = usersAuctions;
    },
    error => {
      this.userAuctionError = error;
    });
  }

}