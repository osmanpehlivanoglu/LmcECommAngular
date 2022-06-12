import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { Observable } from 'rxjs';
import { ListResponseModel } from '../models/listResponseModel';
import { Kampanya } from '../models/kampanya';
import { ResponseModel } from '../models/responseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';

@Injectable({
  providedIn: 'root',
})
export class KampanyaService {
  apiUrl = GlobalVariable.BASE_API_URL + 'kampanyalar/';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<Kampanya>> {
    return this.httpClient.get<ListResponseModel<Kampanya>>(
      this.apiUrl + 'getalldto'
    );
  }

  getKampanyaByUrunId(
    urunId: number
  ): Observable<ObjectResponseModel<Kampanya>> {
    let newPath = this.apiUrl + 'getkampanyadtobyurunid?urunid=' + urunId;
    return this.httpClient.get<ObjectResponseModel<Kampanya>>(newPath);
  }

  addKampanya(kampanya: Kampanya): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, kampanya);
  }

  updateKampanya(kampanya: Kampanya): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'update';
    return this.httpClient.post<ResponseModel>(newPath, kampanya);
  }

  deleteKampanya(kampanya: Kampanya): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, kampanya);
  }
}
