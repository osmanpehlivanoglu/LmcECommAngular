import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { SatinAlim } from '../models/satin-alim';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class SatinAlimService {
  apiUrl = GlobalVariable.BASE_API_URL + 'satinalimlar/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<SatinAlim>> {
    return this.httpClient.get<ListResponseModel<SatinAlim>>(
      this.apiUrl + 'getall'
    );
  }

  getSatinAlimlarBySaticiId(
    saticiId: number
  ): Observable<ListResponseModel<SatinAlim>> {
    let newPath =
      this.apiUrl + 'getsatinalimlarbysaticiid?saticiid=' + saticiId;
    return this.httpClient.get<ListResponseModel<SatinAlim>>(newPath);
  }

  getSatinAlimBySatinAlimId(
    satinAlimId: number
  ): Observable<ObjectResponseModel<SatinAlim>> {
    let newPath =
      this.apiUrl + 'getsatinalimbysatinalimid?satinalimid=' + satinAlimId;
    return this.httpClient.get<ObjectResponseModel<SatinAlim>>(newPath);
  }

  addSatinAlim(satinAlim: SatinAlim): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, satinAlim);
  }

  updateSatinAlim(satinAlim: SatinAlim): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, satinAlim);
  }

  deleteSatinAlim(satinAlim: SatinAlim): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, satinAlim);
  }
}
