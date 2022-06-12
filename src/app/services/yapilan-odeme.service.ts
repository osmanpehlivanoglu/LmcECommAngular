import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { YapilanOdeme } from '../models/yapilanodeme';
import { ResponseModel } from '../models/responseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';

@Injectable({
  providedIn: 'root',
})
export class YapilanOdemeService {
  apiUrl = GlobalVariable.BASE_API_URL + 'yapilanodemeler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<YapilanOdeme>> {
    return this.httpClient.get<ListResponseModel<YapilanOdeme>>(
      this.apiUrl + 'getall'
    );
  }

  getYapilanOdemeByYapilanOdemeId(
    yapilanOdemeId: number
  ): Observable<ObjectResponseModel<YapilanOdeme>> {
    let newPath =
      this.apiUrl +
      'getyapilanodemebyyapilanodemeid?yapilanodemeid=' +
      yapilanOdemeId;
    return this.httpClient.get<ObjectResponseModel<YapilanOdeme>>(newPath);
  }

  addYapilanOdeme(yapilanOdeme: YapilanOdeme): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, yapilanOdeme);
  }

  updateYapilanOdeme(yapilanOdeme: YapilanOdeme): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, yapilanOdeme);
  }

  deleteYapilanOdeme(yapilanOdeme: YapilanOdeme): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, yapilanOdeme);
  }
}
