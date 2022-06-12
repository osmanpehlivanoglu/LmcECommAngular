import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Begeni } from '../models/begeni';
import { GlobalVariable } from '../models/global';
import { ListResponseModel } from '../models/listResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class BegeniService {
  apiUrl = GlobalVariable.BASE_API_URL + 'begeniler/';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Begeni>> {
    return this.httpClient.get<ListResponseModel<Begeni>>(
      this.apiUrl + 'getalldto'
    );
  }

  getBegenilerByKullaniciId(
    kullaniciId: number
  ): Observable<ListResponseModel<Begeni>> {
    let newPath =
      this.apiUrl + 'getalldtobykullaniciid?kullaniciid=' + kullaniciId;
    return this.httpClient.get<ListResponseModel<Begeni>>(newPath);
  }

  addBegeni(begeni: Begeni): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, begeni);
  }

  updateBegeni(begeni: Begeni): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, begeni);
  }

  deleteBegeni(begeni: Begeni): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, begeni);
  }
}
