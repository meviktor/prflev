import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CategoryDropDownFormatter } from '../_utils/categoryDropdownFormatter';
import { CategoryService } from '../_services/category.service';
import { AuctionService } from '../_services/auction.service';
import { Router } from '@angular/router';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-auction',
  templateUrl: './create-auction.component.html',
  styleUrls: ['./create-auction.component.css']
})
export class CreateAuctionComponent implements OnInit {

  submitted: boolean = false;
  createButtonPressed: boolean = false;
  createAuctionForm: FormGroup;
  auctionEndDate: string;
  categoriesForDropDown: any[] = [];
  error: string;

  faCalendarAlt = faCalendarAlt;

  constructor(private auctionService: AuctionService, private categoryService: CategoryService, private formBuilder: FormBuilder, private categoryFormatter: CategoryDropDownFormatter, private router: Router) { }

  ngOnInit(): void {
    this.createAuctionForm = this.formBuilder.group({
      startingPrice: ['', [Validators.required, Validators.min(0.01)]],
      increment: ['', [Validators.required, Validators.min(0.01)]],
      auctionEndDate: [this.auctionEndDate, [Validators.required, this.auctionEndDateValidator]],
      category: ['', [this.categoryValidator]],
      name: ['', [Validators.required]],
      description: ['']
      // TODO: keywords!
    });
    this.categoryService.getAllProductCategories()
    .subscribe(categories => {
      this.categoriesForDropDown = this.categoryFormatter.format(categories);
    });
  }

  onCreateSubmit(): void {
    this.submitted = true;
    if(!this.createAuctionForm.invalid){
      this.createButtonPressed = true;

      let auction = {
        endDate: new Date(this.auctionEndDate).toISOString(),
        startingPrice: Number(this.createAuctionForm.controls.startingPrice.value),
        incr: Number(this.createAuctionForm.controls.increment.value),
        product: {
          productCategoryId: this.createAuctionForm.controls.category.value,
          name: this.createAuctionForm.controls.name.value,
          description: this.createAuctionForm.controls.description.value
          // TODO: keywords!
        }
      };
      
      this.auctionService.addNewAuction(auction)
      .subscribe(result => {
        if(result.auctionId){
          // If created return to the dashboard/home.
          this.router.navigate(['']);
        }
      },
      error => {
        this.createButtonPressed = false;
        this.error = error;
      });
    }
  }

  private auctionEndDateValidator(auctionEndDate: AbstractControl){
    const now = new Date();
      const endDate = new Date(auctionEndDate.value);
      if(isNaN(endDate.valueOf())){
        return {notValidDate: true};
      }
      if(endDate <= now){
        return {dateInThePast: true};
      }
    return null;
  }

  private categoryValidator(category: AbstractControl){
    return (category.value && category.value != 'false') ? null : {required: true};
  }
}
