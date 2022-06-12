import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../models/global';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { Marka } from '../models/marka';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class MarkaService {
  apiUrl = GlobalVariable.BASE_API_URL + 'markalar/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Marka>> {
    return this.httpClient.get<ListResponseModel<Marka>>(
      this.apiUrl + 'getall'
    );
  }

  getMarkalarByKategoriId(
    kategoriId: number
  ): Observable<ListResponseModel<Marka>> {
    let newPath =
      this.apiUrl + 'getmarkalarbykategoriid?kategoriid=' + kategoriId;

    return this.httpClient.get<ListResponseModel<Marka>>(newPath);
  }

  addMarka(marka: Marka): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, marka);
  }

  updateMarka(marka: Marka): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, marka);
  }

  deleteMarka(marka: Marka): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, marka);
  }
}
