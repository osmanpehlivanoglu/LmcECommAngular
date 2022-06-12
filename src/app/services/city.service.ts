import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/city';
import { GlobalVariable } from '../models/global';
import { ListResponseModel } from '../models/listResponseModel';
import { ObjectResponseModel } from '../models/objectResponseModel';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  apiUrl = GlobalVariable.BASE_API_URL + 'cities/';

  constructor(private httpClient: HttpClient) {}

  getAll(): Observable<ListResponseModel<City>> {
    return this.httpClient.get<ListResponseModel<City>>(this.apiUrl + 'getall');
  }

  getById(id: number): Observable<ObjectResponseModel<City>> {
    let newPath = this.apiUrl + 'getbyid?cityid=' + id;
    return this.httpClient.get<ObjectResponseModel<City>>(newPath);
  }
}
