import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private http: HttpClient) { }

  queryAuctions(auctionQuery: any){
    return this.http.post<any>(`${environment.apiUrl}/queryAuctions`, auctionQuery);
  }

  getAuctionDetails(auctionId: string){
    return this.http.get<any>(`${environment.apiUrl}/auctionDetails`, {params: {auctionId: auctionId}});
  }

  addNewBid(auctionId: string, amount: Number){
    return this.http.post<any>(`${environment.apiUrl}/addBid`, {auctionId, amount});
  }

  addNewComment(auctionId: string, commentText: string){
    return this.http.post<any>(`${environment.apiUrl}/addComment`, {auctionId, commentText});
  }
}
