import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../_services/auction.service';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CategoryService } from '../_services/category.service';
import { CategoryDropDownFormatter } from '../_utils/categoryDropdownFormatter';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.css']
})
export class AuctionDetailsComponent implements OnInit {
  auctionData: any;
  id: string = window.location.href.split("/").pop();
  error: string;
  bidForm: FormGroup;
  commentForm: FormGroup;
  path: Array<string> = [];

  bidSubmitted: Boolean = false;
  addBidButtonPressed: Boolean = false;

  commentSubmitted: Boolean = false;
  addCommentButtonPressed: Boolean = false;

  watchingMyOwnAuction: Boolean;
  isAuctionExpired: Boolean;

  constructor(private auctionService: AuctionService, private categoryService: CategoryService, private formBuilder: FormBuilder, private categoryFormatter: CategoryDropDownFormatter) { }

  ngOnInit(): void {
    this.auctionService.getAuctionDetails(this.id)
    .pipe(first())
    .subscribe(auctionDetails => {
      this.refreshAuctionData(auctionDetails);
      this.isAuctionExpired = new Date(this.auctionData.endsAt) < new Date();
      this.watchingMyOwnAuction = this.auctionData.ownerUserId == this.auctionData.requesterUserId;
      this.buildCategoryPath();
    },
    error => {
      this.error = error;
    });

    this.bidForm = this.formBuilder.group({
      amount: ['', [Validators.required, this.bidValidator.bind(this)]]
    });

    this.commentForm = this.formBuilder.group({
      commentText: ['', [Validators.required, this.commentValidator]]
    });
  }

  onBidSubmit(): void {
    this.bidSubmitted = true;
    if(!this.bidForm.invalid){
      this.addBidButtonPressed = true;
      this.auctionService.addNewBid(this.auctionData.id, this.bidForm.controls.amount.value)
      .pipe(first())
      .subscribe(response => {
        this.addBidButtonPressed = false;
        //after bidding we have to refresh the auction details to be able to see the new bid
        this.auctionService.getAuctionDetails(response.auctionId)
        .pipe(first())
        .subscribe(auctionDetails => {
          this.refreshAuctionData(auctionDetails);
        },
        error => {
          this.error = error;
        });
      });
    }
  }

  onCommentSubmit(): void {
    this.commentSubmitted = true;
    if(!this.commentForm.invalid){
      this.addCommentButtonPressed = true;
      this.auctionService.addNewComment(this.auctionData.id, this.commentForm.controls.commentText.value)
      .subscribe(response => {
        this.addCommentButtonPressed = false;
        //after commenting we have to refresh the auction details to be able to see the new bid
        this.auctionService.getAuctionDetails(response.auctionId)
        .pipe(first())
        .subscribe(auctionDetails => {
          this.refreshAuctionData(auctionDetails);
        },
        error => {
          this.error = error;
        });
      });
    }
  }

  private buildCategoryPath(): void {
    this.categoryService.getAllProductCategories()
    .subscribe(categoryList => {
      this.path = this.categoryFormatter.format(categoryList)
        .filter(item => item.id == this.auctionData.product.productCategoryId)[0]
        .path;
    });
  }

  private refreshAuctionData(auctionData: any): void {
    this.auctionData = auctionData;
    this.auctionData.bids.sort(
      // descending order by date
      (bid1, bid2) => this.cmpDates(bid1.createdDate, bid2.createdDate) * (-1));
    this.auctionData.comments.sort(
      // ascending order by date
      (comment1, comment2) => this.cmpDates(comment1.createdDate, comment2.createdDate));
  }

  private cmpDates(date1: any, date2: any){
    const date1Date = new Date(date1);
    const date2Date = new Date(date2);
    if(date1Date < date2Date){
      return -1;
    }
    if(date2Date < date1Date){
      return 1;
    }
    return 0;
  }


  private bidValidator(amountControl: AbstractControl) {
      if(this.auctionData){
        if(this.auctionData.bids.length == 0 && amountControl.value < this.auctionData.startingPrice){
          return {lowOpeningBid: true};
        }
        if(this.auctionData.bids.length != 0 && amountControl.value < (this.auctionData.actualPrice + this.auctionData.incr)){
          return {lowBid: true}
        }
      }
      return null;
  }

  private commentValidator(commentTextControl: AbstractControl) {
    if (!commentTextControl.value || !(/\S/.test(commentTextControl.value)))
    {
      return {isNullOrWhiteSpace: true};
    }
    return null;
  }
}
