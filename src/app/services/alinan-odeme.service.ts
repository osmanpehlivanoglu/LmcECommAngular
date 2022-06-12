import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { AlinanOdeme } from '../models/alinanodeme';
import { ResponseModel } from '../models/responseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';

@Injectable({
  providedIn: 'root',
})
export class AlinanOdemeService {
  apiUrl = GlobalVariable.BASE_API_URL + 'alinanodemeler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<AlinanOdeme>> {
    return this.httpClient.get<ListResponseModel<AlinanOdeme>>(
      this.apiUrl + 'getall'
    );
  }

  getAlinanOdemeByAlinanOdemeId(
    alinanOdemeId: number
  ): Observable<ObjectResponseModel<AlinanOdeme>> {
    let newPath =
      this.apiUrl +
      'getalinanodemebyalinanodemeid?alinanodemeid=' +
      alinanOdemeId;
    return this.httpClient.get<ObjectResponseModel<AlinanOdeme>>(newPath);
  }

  addAlinanOdeme(alinanOdeme: AlinanOdeme): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, alinanOdeme);
  }

  updateAlinanOdeme(alinanOdeme: AlinanOdeme): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, alinanOdeme);
  }

  deleteAlinanOdeme(alinanOdeme: AlinanOdeme): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, alinanOdeme);
  }
}
