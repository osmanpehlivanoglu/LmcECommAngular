import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalVariable } from '../models/global';
import { LoginModel } from '../models/login-model';
import { ObjectResponseModel } from '../models/objectResponseModel';
import { RegisterModel } from '../models/register-model';
import { TokenModel } from '../models/token-model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiUrl = GlobalVariable.BASE_API_URL + 'auth/';

  public kullaniciGirisYapmisMi = new BehaviorSubject<boolean>(false);
  public kullaniciAdminMi = new BehaviorSubject<boolean>(false);

  constructor(private httpClient: HttpClient) {}

  setKullaniciGirisYapmisMi(val: boolean) {
    this.kullaniciGirisYapmisMi.next(val);
  }

  getKullaniciGirisYapmisMi(): Observable<boolean> {
    return this.kullaniciGirisYapmisMi.asObservable();
  }

  setKullaniciAdminMi(val: boolean) {
    this.kullaniciAdminMi.next(val);
  }

  getKullaniciAdminMi(): Observable<boolean> {
    return this.kullaniciAdminMi.asObservable();
  }

  login(loginModel: LoginModel) {
    return this.httpClient.post<ObjectResponseModel<TokenModel>>(
      this.apiUrl + 'login',
      loginModel
    );
  }

  register(registerModel: RegisterModel) {
    return this.httpClient.post<ObjectResponseModel<TokenModel>>(
      this.apiUrl + 'register',
      registerModel
    );
  }

  logout() {
    localStorage.clear();
  }

  isAuthenticated() {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }
}
