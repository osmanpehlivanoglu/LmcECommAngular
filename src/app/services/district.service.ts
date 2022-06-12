import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { District } from '../models/district';
import { GlobalVariable } from '../models/global';
import { ListResponseModel } from '../models/listResponseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';

@Injectable({
  providedIn: 'root',
})
export class DistrictService {
  apiUrl = GlobalVariable.BASE_API_URL + 'districts/';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<District>> {
    return this.httpClient.get<ListResponseModel<District>>(
      this.apiUrl + 'getall'
    );
  }

  getById(id: number): Observable<ObjectResponseModel<District>> {
    let newPath = this.apiUrl + 'getbyid?districtid=' + id;
    return this.httpClient.get<ObjectResponseModel<District>>(newPath);
  }

  getAllByCityId(cityId: number): Observable<ListResponseModel<District>> {
    let newPath = this.apiUrl + 'getallbycityid?cityid=' + cityId;
    return this.httpClient.get<ListResponseModel<District>>(newPath);
  }
}
