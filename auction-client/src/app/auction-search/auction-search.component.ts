import { Component, OnInit } from '@angular/core';
import { AuctionService } from '../_services/auction.service';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { CategoryDropDownFormatter } from '../_utils/categoryDropdownFormatter';
import { CategoryService } from '../_services/category.service';
import { faComments, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-auction-search',
  templateUrl: './auction-search.component.html',
  styleUrls: ['./auction-search.component.css']
})
export class AuctionSearchComponent implements OnInit {
  searchSubmitted: boolean = false;
  searchButtonPressed: boolean = false;
  auctionSearchForm: FormGroup;
  endsFrom: string;
  endsTo: string;
  categoriesForDropDown: any[] = [];
  foundAuctions: any[] = [];
  faComments = faComments;
  faCalendarAlt = faCalendarAlt;
  error: string;

  constructor(private auctionService: AuctionService, private categoryService: CategoryService, private formBuilder: FormBuilder, private categoryFormatter: CategoryDropDownFormatter) { }

  ngOnInit(): void {
    this.auctionSearchForm = this.formBuilder.group({
      contains: [''],
      endsFrom: [this.endsFrom, [this.endsFromValidator.bind(this)]],
      endsTo: [this.endsTo, [this.endsToValidator.bind(this)]],
      priceFrom: [''],
      priceTo: [''],
      category: ['']
      // TODO: keywords!
    }, {validators: this.priceValidator});
    this.categoryService.getAllProductCategories()
    .subscribe(categories => {
      this.categoriesForDropDown = this.categoryFormatter.format(categories);
    });
  }

  onSearchSubmit(): void {
    this.searchSubmitted = true;
    if(!this.auctionSearchForm.invalid){
      this.searchButtonPressed = true;

      let query = {
        contains: undefined,
        endDateMin: undefined,
        endDateMax: undefined,
        actualPriceMin: undefined,
        actualPriceMax: undefined,
        productCategoryId: undefined,
        onlyActive: true
      };
      
      let containsValue = this.auctionSearchForm.controls.contains.value;
      if (containsValue || !(/\S/.test(containsValue))){
        query.contains = containsValue;
      }
      if(this.endsFrom){
        query.endDateMin = new Date(this.endsFrom).toISOString();
      }
      if(this.endsTo){
        query.endDateMax = new Date(this.endsTo).toISOString();
      }
      let priceFromValue = this.auctionSearchForm.controls.priceFrom.value;
      if(priceFromValue != ""){
        query.actualPriceMin = Number(priceFromValue);
      }
      let priceToValue = this.auctionSearchForm.controls.priceTo.value;
      if(priceToValue != ""){
        query.actualPriceMax = Number(priceToValue);
      }
      let categoryId = this.auctionSearchForm.controls.category.value;
      if(categoryId){
        query.productCategoryId = categoryId;
      }

      this.auctionService.queryAuctions(query)
      .subscribe(auctions => {
        this.searchButtonPressed = false;
        this.foundAuctions = auctions;
        this.error = undefined;
      },
      error => {
        this.searchButtonPressed = false;
        this.error = error;
      });
    }
  }

  private endsFromValidator(endsFrom: AbstractControl){
    if(this.auctionSearchForm){
      const now = new Date();
      const eFrom = new Date(endsFrom.value);
      const eTo = new Date(this.auctionSearchForm.controls.endsTo.value);
      if(!isNaN(eFrom.valueOf()) && eFrom < now){
        return {inThePast: true};
      }
      if(!isNaN(eTo.valueOf()) && (eFrom > eTo)){
        return {fromDateLaterThanToDate: true};
      }
    }
    return null;
  }

  private endsToValidator(endsTo: AbstractControl){
    if(this.auctionSearchForm){
      const now = new Date();
      const eFrom = new Date(endsTo.value);  
      if(!isNaN(eFrom.valueOf()) && eFrom < now){
        return {inThePast: true};
      }
    }
    return null;
  }

  private priceValidator(formGroup: FormGroup){
    let minPrice = formGroup.controls.priceFrom.value;
    let maxPrice = formGroup.controls.priceTo.value;
    minPrice = (minPrice != null && minPrice != undefined && minPrice !== "") ? Number(minPrice) : NaN;
    maxPrice = (maxPrice != null && maxPrice != undefined && maxPrice !== "") ? Number(maxPrice) : NaN;

    if(!isNaN(minPrice)){
      if(minPrice <= 0){
        return {minPriceLteZero: true};
      }
    }
    if(!isNaN(maxPrice)){
      if(maxPrice <= 0){
        return {maxPriceLteZero: true};
      }
    }
    if(!isNaN(minPrice) && !isNaN(maxPrice)){
      if(minPrice > maxPrice){
        return {minPriceGtmaxPrice: true};
      }
    }
  }
}
