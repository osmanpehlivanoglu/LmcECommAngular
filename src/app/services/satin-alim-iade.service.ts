import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { SatinAlimIade } from '../models/satin-alim-iade';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';
@Injectable({
  providedIn: 'root',
})
export class SatinAlimIadeService {
  apiUrl = GlobalVariable.BASE_API_URL + 'satinalimiadeler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<SatinAlimIade>> {
    return this.httpClient.get<ListResponseModel<SatinAlimIade>>(
      this.apiUrl + 'getall'
    );
  }

  getSatinAlimIadeBySatinAlimId(
    satinAlimId: number
  ): Observable<ObjectResponseModel<SatinAlimIade>> {
    let newPath =
      this.apiUrl + 'getsatinalimiadebysatinalimid?satisnalimid=' + satinAlimId;
    return this.httpClient.get<ObjectResponseModel<SatinAlimIade>>(newPath);
  }

  getSatinAlimIadeBySatinAlimIadeId(
    satinAlimIadeId: number
  ): Observable<ObjectResponseModel<SatinAlimIade>> {
    let newPath =
      this.apiUrl +
      'getsatinalimiadebysatinalimiadeid?satinalimiadeid=' +
      satinAlimIadeId;
    return this.httpClient.get<ObjectResponseModel<SatinAlimIade>>(newPath);
  }

  addSatinAlimIade(satinAlimIade: SatinAlimIade): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, satinAlimIade);
  }

  updateSatinAlimIade(satinAlimIade: SatinAlimIade): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, satinAlimIade);
  }

  deleteSatinAlimIade(satinAlimIade: SatinAlimIade): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, satinAlimIade);
  }
}
