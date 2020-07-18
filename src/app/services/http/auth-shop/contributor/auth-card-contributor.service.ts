import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthCardContributorUrl } from '@enum/url.enum';
import { PaymentCard } from '@objects/payment-card';
import { AccessTokenService } from '../access-token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthCardContributorService {

  constructor(private http: HttpClient, private accessTokenService: AccessTokenService) { }

  getCardsByShopId() {
    return this.http.get<{ result: PaymentCard[] }>(AuthCardContributorUrl.getCardsByShopIdUrl, this.accessTokenService.getAccessToken());
  }
  getCardById(id) {
    return this.http.get<PaymentCard>(AuthCardContributorUrl.getCardByIdUrl + '/' + id, this.accessTokenService.getAccessToken());
  }
  addCard(card) {
    return this.http.post(AuthCardContributorUrl.addCardUrl, card, this.accessTokenService.getAccessToken());
  }
  editCard(card) {
    return this.http.put(AuthCardContributorUrl.editCardUrl + '/' + card._id, card, this.accessTokenService.getAccessToken());
  }
  setDefault(id) {
    return this.http.put(AuthCardContributorUrl.setDefaultUrl + '/' + id, {}, this.accessTokenService.getAccessToken());
  }
  deleteCard(id) {
    return this.http.delete(AuthCardContributorUrl.deleteCardUrl + '/' + id, this.accessTokenService.getAccessToken());
  }
}
