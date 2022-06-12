import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { SatisIade } from '../models/satis-iade';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class SatisIadeService {
  apiUrl = GlobalVariable.BASE_API_URL + 'satisiadeler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<SatisIade>> {
    return this.httpClient.get<ListResponseModel<SatisIade>>(
      this.apiUrl + 'getall'
    );
  }

  getSatisIadeBySatisId(
    satisId: number
  ): Observable<ObjectResponseModel<SatisIade>> {
    let newPath = this.apiUrl + 'getsatisiadebysatisid?satisid=' + satisId;
    return this.httpClient.get<ObjectResponseModel<SatisIade>>(newPath);
  }

  getSatisIadeBySatisIadeId(
    satisIadeId: number
  ): Observable<ObjectResponseModel<SatisIade>> {
    let newPath =
      this.apiUrl + 'getsatisiadebysatisiadeid?satisiadeid=' + satisIadeId;
    return this.httpClient.get<ObjectResponseModel<SatisIade>>(newPath);
  }

  addSatisIade(satisIade: SatisIade): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, satisIade);
  }

  updateSatisIade(satisIade: SatisIade): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, satisIade);
  }

  deleteSatisIade(satisIade: SatisIade): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, satisIade);
  }
}
