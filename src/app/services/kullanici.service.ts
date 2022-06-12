import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { User } from '../models/user';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class KullaniciService {
  apiUrl = GlobalVariable.BASE_API_URL + 'kullanicilar/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<User>> {
    return this.httpClient.get<ListResponseModel<User>>(this.apiUrl + 'getall');
  }

  getKullaniciByMail(email: string): Observable<ObjectResponseModel<User>> {
    let newPath = this.apiUrl + 'getkullanicibyemail?email=' + email;
    return this.httpClient.get<ObjectResponseModel<User>>(newPath);
  }

  getKullaniciByKullaniciId(
    kullaniciId: number
  ): Observable<ObjectResponseModel<User>> {
    let newPath =
      this.apiUrl + 'getkullanicibykullaniciid?kullaniciid=' + kullaniciId;
    return this.httpClient.get<ObjectResponseModel<User>>(newPath);
  }

  updateKullanici(kullanici: User): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, kullanici);
  }

  deleteKullanici(kullanici: User): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, kullanici);
  }
}
