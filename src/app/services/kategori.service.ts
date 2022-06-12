import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../models/global';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { Kategori } from '../models/kategori';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class KategoriService {
  apiUrl = GlobalVariable.BASE_API_URL + 'kategoriler/';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Kategori>> {
    return this.httpClient.get<ListResponseModel<Kategori>>(
      this.apiUrl + 'getall'
    );
  }

  addKategori(kategori: Kategori): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, kategori);
  }

  updateKategori(kategori: Kategori): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, kategori);
  }

  deleteKategori(kategori: Kategori): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, kategori);
  }
}
