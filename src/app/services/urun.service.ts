import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../models/global';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { Urun } from '../models/urun';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class UrunService {
  apiUrl = GlobalVariable.BASE_API_URL + 'urunler/';
  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Urun>> {
    let newPath = this.apiUrl + 'getalldto';
    return this.httpClient.get<ListResponseModel<Urun>>(newPath);
  }

  getUrunByUrunId(urunId: number): Observable<ObjectResponseModel<Urun>> {
    let newPath = this.apiUrl + 'geturundtobyurunid?urunid=' + urunId;
    return this.httpClient.get<ObjectResponseModel<Urun>>(newPath);
  }

  getUrunlerByKategori(
    kategoriId: number
  ): Observable<ListResponseModel<Urun>> {
    let newPath =
      this.apiUrl + 'geturunlerdtobykategoriid?kategoriid=' + kategoriId;
    return this.httpClient.get<ListResponseModel<Urun>>(newPath);
  }

  getUrunlerByMarka(markaId: number): Observable<ListResponseModel<Urun>> {
    let newPath = this.apiUrl + 'geturunlerdtobymarkaid?markaid=' + markaId;
    return this.httpClient.get<ListResponseModel<Urun>>(newPath);
  }

  getUrunlerByKategoriAndMarka(
    kategoriId: number,
    markaId: number
  ): Observable<ListResponseModel<Urun>> {
    let newPath =
      this.apiUrl +
      'geturunlerdtobykategoriidvemarkaid?kategoriid=' +
      kategoriId +
      '&markaid=' +
      markaId;
    return this.httpClient.get<ListResponseModel<Urun>>(newPath);
  }

  addUrun(urun: Urun): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, urun);
  }

  updateUrun(urun: Urun): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, urun);
  }

  deleteUrun(urun: Urun): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, urun);
  }
}
