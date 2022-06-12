import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { ListResponseModel } from '../models/listResponseModel';
import { Sepet } from '../models/sepet';
import { ResponseModel } from '../models/responseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';

@Injectable({
  providedIn: 'root',
})
export class SepetService {
  public sepetteKacCesitUrunVar = new BehaviorSubject<number>(0);

  apiUrl = GlobalVariable.BASE_API_URL + 'sepetler/';
  constructor(private httpClient: HttpClient) {}

  getAllDto(): Observable<ListResponseModel<Sepet>> {
    return this.httpClient.get<ListResponseModel<Sepet>>(
      this.apiUrl + 'getalldto'
    );
  }

  setSepetteKacCesitUrunVar(val: number) {
    this.sepetteKacCesitUrunVar.next(val);
  }

  getSepetteKacCesitUrunVar(): Observable<number> {
    return this.sepetteKacCesitUrunVar.asObservable();
  }

  getSepetlerDtoByMusteriIdAndDurum(
    musteriId: number,
    durum: boolean
  ): Observable<ListResponseModel<Sepet>> {
    let newPath =
      this.apiUrl +
      'getsepetlerdtobymusteriidanddurum?musteriid=' +
      musteriId +
      '&durum=' +
      durum;
    return this.httpClient.get<ListResponseModel<Sepet>>(newPath);
  }

  getSepetlerDtoByOnayIdAndDurum(
    onayId: number,
    durum: boolean
  ): Observable<ListResponseModel<Sepet>> {
    let newPath =
      this.apiUrl +
      'getsepetlerdtobyonayidanddurum?onayid=' +
      onayId +
      '&durum=' +
      durum;
    return this.httpClient.get<ListResponseModel<Sepet>>(newPath);
  }

  getSepetlerDtoByMusteriIdAndDurumAndOnayId(
    musteriId: number,
    durum: boolean,
    onayId: number
  ): Observable<ListResponseModel<Sepet>> {
    let newPath =
      this.apiUrl +
      'getsepetlerdtobymusteriidanddurumandonayid?musteriid=' +
      musteriId +
      '&durum=' +
      durum +
      '&onayid=' +
      onayId;
    return this.httpClient.get<ListResponseModel<Sepet>>(newPath);
  }

  getSepetDtoBySepetId(
    sepetId: number
  ): Observable<ObjectResponseModel<Sepet>> {
    let newPath = this.apiUrl + 'getsepetdtobysepetid?sepetid=' + sepetId;
    return this.httpClient.get<ObjectResponseModel<Sepet>>(newPath);
  }

  getAll(): Observable<ListResponseModel<Sepet>> {
    return this.httpClient.get<ListResponseModel<Sepet>>(
      this.apiUrl + 'getall'
    );
  }

  getSepetlerByMusteriIdAndDurum(
    musteriId: number,
    durum: boolean
  ): Observable<ListResponseModel<Sepet>> {
    let newPath =
      this.apiUrl +
      'getsepetbymusteriidanddurum?musteriid=' +
      musteriId +
      '&durum=' +
      durum;
    return this.httpClient.get<ListResponseModel<Sepet>>(newPath);
  }

  getSepetBySepetId(sepetId: number): Observable<ObjectResponseModel<Sepet>> {
    let newPath = this.apiUrl + 'getsepetbysepetid?sepetid=' + sepetId;
    return this.httpClient.get<ObjectResponseModel<Sepet>>(newPath);
  }

  getSepetByOnayIdAndTarih(
    onayId: number,
    tarih: string
  ): Observable<ObjectResponseModel<Sepet>> {
    let newPath =
      this.apiUrl +
      'getsepetbyonayidandtarih?onayid=' +
      onayId +
      '&tarih=' +
      tarih;
    return this.httpClient.get<ObjectResponseModel<Sepet>>(newPath);
  }

  addSepet(sepet: Sepet): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, sepet);
  }

  updateSepet(sepet: Sepet): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, sepet);
  }

  deleteSepet(sepet: Sepet): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, sepet);
  }
}
