import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../models/global';
import { HttpClient } from '@angular/common/http';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { UyumMarka } from '../models/uyumMarka';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class UyumMarkaService {
  apiUrl = GlobalVariable.BASE_API_URL + 'uyummarkalar/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<UyumMarka>> {
    let newPath = this.apiUrl + 'getall';
    return this.httpClient.get<ListResponseModel<UyumMarka>>(newPath);
  }

  getUyumMarkaByUyumMarkaId(
    uyumMarkaId: number
  ): Observable<ObjectResponseModel<UyumMarka>> {
    let newPath =
      this.apiUrl + 'getuyummarkabyuyummarkaid?uyummarkaid=' + uyumMarkaId;
    return this.httpClient.get<ObjectResponseModel<UyumMarka>>(newPath);
  }

  addUyumMarka(uyumMarka: UyumMarka): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, uyumMarka);
  }

  updateUyumMarka(uyumMarka: UyumMarka): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, uyumMarka);
  }

  deleteUyumMarka(uyumMarka: UyumMarka): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, uyumMarka);
  }
}
