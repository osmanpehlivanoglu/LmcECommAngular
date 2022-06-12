import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../models/global';
import { HttpClient } from '@angular/common/http';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { UyumModel } from '../models/uyumModel';
import { ListResponseModel } from '../models/listResponseModel';
import { UyumMarka } from '../models/uyumMarka';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class UyumModelService {
  apiUrl = GlobalVariable.BASE_API_URL + 'uyummodeller/';
  constructor(private httpClient: HttpClient) {}

  getUyumModelByUyumModelId(
    uyumModelId: number
  ): Observable<ObjectResponseModel<UyumModel>> {
    let newPath =
      this.apiUrl + 'getuyummodelbyuyummodelid?uyummodelid=' + uyumModelId;
    return this.httpClient.get<ObjectResponseModel<UyumModel>>(newPath);
  }

  getUyumModellerByUyumMarkaId(
    uyumMarkaId: number
  ): Observable<ListResponseModel<UyumModel>> {
    let newPath =
      this.apiUrl + 'getuyummodellerbyuyummarkaid?uyummarkaid=' + uyumMarkaId;
    return this.httpClient.get<ListResponseModel<UyumModel>>(newPath);
  }

  addUyumModel(uyumModel: UyumModel): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, uyumModel);
  }

  updateUyumModel(uyumModel: UyumModel): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, uyumModel);
  }

  deleteUyumModel(uyumModel: UyumModel): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, uyumModel);
  }
}
