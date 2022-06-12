import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { ListResponseModel } from '../models/listResponseModel';
import { OperasyonYetki } from '../models/operasyon-yetki';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class OperasyonYetkiService {
  apiUrl = GlobalVariable.BASE_API_URL + 'operasyonyetkiler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<OperasyonYetki>> {
    let newPath = this.apiUrl + 'getall';
    return this.httpClient.get<ListResponseModel<OperasyonYetki>>(newPath);
  }

  getOperasyonYetkiByOperasyonYetkiId(
    operasyonYetkiId: number
  ): Observable<ObjectResponseModel<OperasyonYetki>> {
    let newPath =
      this.apiUrl +
      'getoperasyonyetkibyoperasyonyetkiid?operasyonyetkiid=' +
      operasyonYetkiId;
    return this.httpClient.get<ObjectResponseModel<OperasyonYetki>>(newPath);
  }

  addOperasyonYetki(operasyonYetki: OperasyonYetki): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, operasyonYetki);
  }

  updateOperasyonYetki(
    operasyonYetki: OperasyonYetki
  ): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, operasyonYetki);
  }

  deleteOperasyonYetki(
    operasyonYetki: OperasyonYetki
  ): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, operasyonYetki);
  }
}
