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

  getAuctionsWonByUser(){
    return this.http.get<any>(`${environment.apiUrl}/getWonAuctions`);
  }

  getAuctionDetails(auctionId: string){
    return this.http.get<any>(`${environment.apiUrl}/auctionDetails`, {params: {auctionId: auctionId}});
  }

  addNewAuction(auction: any){
    return this.http.post<any>(`${environment.apiUrl}/createAuction`, auction);
  }

  addNewBid(auctionId: string, amount: Number){
    return this.http.post<any>(`${environment.apiUrl}/addBid`, {auctionId, amount});
  }

  addNewComment(auctionId: string, commentText: string){
    return this.http.post<any>(`${environment.apiUrl}/addComment`, {auctionId, commentText});
  }
}
