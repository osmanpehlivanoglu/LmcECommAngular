import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';
import { KullanıcıOperasyonYetki } from '../models/kullanici-operasyon-yetki';
import { User } from '../models/user';
import { OperasyonYetki } from '../models/operasyon-yetki';

@Injectable({
  providedIn: 'root',
})
export class KullaniciOperasyonYetkiService {
  apiUrl = GlobalVariable.BASE_API_URL + 'kullanicioperasyonyetkiler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<KullanıcıOperasyonYetki>> {
    let newPath = this.apiUrl + 'getall';
    return this.httpClient.get<ListResponseModel<KullanıcıOperasyonYetki>>(
      newPath
    );
  }

  /* 
  getYetkilerByKullaniciId(
    kullanici: User
  ): Observable<ListResponseModel<KullanıcıOperasyonYetki>> {
    let newPath = this.apiUrl + 'getyetkilerbykullanici?kullanici=' + User;
    return this.httpClient.get<ListResponseModel<KullanıcıOperasyonYetki>>(
      newPath
    );
  } */

  getKullaniciOperasyonYetkiByKullaniciOperasyonYetkiId(
    kullaniciOperasyonYetkiId: number
  ): Observable<ObjectResponseModel<KullanıcıOperasyonYetki>> {
    let newPath =
      this.apiUrl +
      'getoperasyonyetkibyoperasyonyetkiid?operasyonyetkiid=' +
      kullaniciOperasyonYetkiId;
    return this.httpClient.get<ObjectResponseModel<KullanıcıOperasyonYetki>>(
      newPath
    );
  }

  getOperasyonYetkilerByKullaniciId(
    kullaniciId: number
  ): Observable<ListResponseModel<KullanıcıOperasyonYetki>> {
    let newPath =
      this.apiUrl +
      'getoperasyonyetkilerbykullaniciid?kullaniciid=' +
      kullaniciId;
    return this.httpClient.get<ListResponseModel<KullanıcıOperasyonYetki>>(
      newPath
    );
  }

  addOperasyonYetki(
    kullaniciOperasyonYetki: KullanıcıOperasyonYetki
  ): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(
      newPath,
      kullaniciOperasyonYetki
    );
  }

  updateOperasyonYetki(
    kullaniciOperasyonYetki: KullanıcıOperasyonYetki
  ): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(
      newPath,
      kullaniciOperasyonYetki
    );
  }

  deleteOperasyonYetki(
    kullaniciOperasyonYetki: KullanıcıOperasyonYetki
  ): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(
      newPath,
      kullaniciOperasyonYetki
    );
  }
}
