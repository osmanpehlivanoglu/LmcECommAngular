import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Satis } from '../models/satis';
import { ListResponseModel } from '../models/listResponseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class SatisService {
  apiUrl = GlobalVariable.BASE_API_URL + 'satislar/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Satis>> {
    return this.httpClient.get<ListResponseModel<Satis>>(
      this.apiUrl + 'getall'
    );
  }

  getSatislarByMusteriId(
    musteriId: number
  ): Observable<ListResponseModel<Satis>> {
    let newPath = this.apiUrl + 'getsatislarbymusteriid?musteriid=' + musteriId;
    return this.httpClient.get<ListResponseModel<Satis>>(newPath);
  }

  getSatislarByOnayId(onayId: number): Observable<ListResponseModel<Satis>> {
    let newPath = this.apiUrl + 'getsatislarbyonayid?onayid=' + onayId;
    return this.httpClient.get<ListResponseModel<Satis>>(newPath);
  }

  getSatislarByUrunId(urunId: number): Observable<ListResponseModel<Satis>> {
    let newPath = this.apiUrl + 'getsatislarbyurunid?urunid=' + urunId;
    return this.httpClient.get<ListResponseModel<Satis>>(newPath);
  }

  getSatisBySatisId(satisId: number): Observable<ObjectResponseModel<Satis>> {
    let newPath = this.apiUrl + 'getsatisbysatisid?satisid=' + satisId;
    return this.httpClient.get<ObjectResponseModel<Satis>>(newPath);
  }

  addSatis(satis: Satis): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, satis);
  }

  updateSatis(satis: Satis): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, satis);
  }

  deleteSatis(satis: Satis): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, satis);
  }
}
