import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GlobalVariable } from '../models/global';
import { HttpClient } from '@angular/common/http';
import { ListResponseModel } from '../models/listResponseModel';
import { Resim } from '../models/resim';
import { ResponseModel } from '../models/responseModel';

@Injectable({
  providedIn: 'root',
})
export class ResimService {
  apiUrl = GlobalVariable.BASE_API_URL + 'resimler/';
  constructor(private httpClient: HttpClient) {}

  getResimlerByUrunId(urunId: number): Observable<ListResponseModel<Resim>> {
    let newPath = this.apiUrl + 'getresimlerbyurunid?urunId=' + urunId;
    return this.httpClient.get<ListResponseModel<Resim>>(newPath);
  }

  uploadImage(image: File, urunId: number, tarih: Date): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('Image', image);
    formData.append('UrunId', urunId.toString());

    let newPath = this.apiUrl + 'add';
    return this.httpClient.post<ResponseModel>(newPath, formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }

  deleteImage(resimId: number): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('Id', resimId.toString());

    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, formData, {
      reportProgress: true,
      responseType: 'json',
    });
  }
  /* 
  deleteResim(resimId: number): Observable<ResponseModel> {
    let newPath = this.apiUrl + 'delete';
    return this.httpClient.post<ResponseModel>(newPath, resimId);
  } */
}
