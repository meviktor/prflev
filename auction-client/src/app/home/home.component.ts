import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../_services/auction.service';
import { UserService } from '../_services/user.service';
import { first } from 'rxjs/operators';
import { faComments } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  now: Date = new Date();
  userData: any;
  auctionButtonText: string;
  showInactiveAuctions: boolean = false;
  allAuctionsOfUser: any[] = [];
  auctionsToShow: any[] = [];
  auctionsWon: any[] = [];
  userDetailsError: string;
  auctionsToShowError: string;
  auctionsWonError: string;

  faComments = faComments;

  constructor(private userService: UserService, private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.userService.getUserDetails()
    .pipe(first())
    .subscribe(userData => {
      this.userData = userData;
      this.auctionService.queryAuctions({
        ownerUserId: userData.id
      }).subscribe(auctions => {
        this.allAuctionsOfUser = auctions;
        this.auctionsToShow = this.allAuctionsOfUser.filter(auction => !this.isExpired(auction.endsAt));
        this.auctionButtonText = "Show all auctions";
      },
      error =>{
        this.auctionsToShowError = error;
      });
      this.auctionService.getAuctionsWonByUser()
      .subscribe(auctions => {
        this.auctionsWon = auctions;
      },
      error =>{
        this.auctionsWonError = error;
      });
    },
    error => {
      this.userDetailsError = error;
    });
  }

  setAuctionsToShow(){
    this.showInactiveAuctions = !this.showInactiveAuctions;
    if(this.showInactiveAuctions){
      this.auctionButtonText = "Show only active auctions";
      this.auctionsToShow = this.allAuctionsOfUser;
    }
    else{
      this.auctionButtonText = "Show all auctions";
      this.auctionsToShow = this.allAuctionsOfUser.filter(auction => !this.isExpired(auction.endsAt));
    }
  }

  isExpired(endDate: Date | string){
    return new Date(endDate) <= this.now;
  }

}
