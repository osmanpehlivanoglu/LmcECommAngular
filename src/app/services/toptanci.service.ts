import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { ListResponseModel } from '../models/listResponseModel';
import { Toptanci } from '../models/toptanci';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class ToptanciService {
  apiUrl = GlobalVariable.BASE_API_URL + 'toptancilar/';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Toptanci>> {
    return this.httpClient.get<ListResponseModel<Toptanci>>(
      this.apiUrl + 'getall'
    );
  }

  getToptanciByToptanciId(
    toptanciId: number
  ): Observable<ObjectResponseModel<Toptanci>> {
    let newPath =
      this.apiUrl + 'gettoptancibytoptanciid?toptanciid=' + toptanciId;
    return this.httpClient.get<ObjectResponseModel<Toptanci>>(newPath);
  }

  addToptanci(toptanci: Toptanci): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, toptanci);
  }

  updateToptanci(toptanci: Toptanci): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, toptanci);
  }

  deleteToptanci(toptanci: Toptanci): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, toptanci);
  }
}
