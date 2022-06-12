import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { City } from 'src/app/models/city';
import { District } from 'src/app/models/district';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { Sepet } from 'src/app/models/sepet';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { CityService } from 'src/app/services/city.service';
import { DistrictService } from 'src/app/services/district.service';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SepetService } from 'src/app/services/sepet.service';

@Component({
  selector: 'app-kayit-ol',
  templateUrl: './kayit-ol.component.html',
  styleUrls: ['./kayit-ol.component.css'],
})
export class KayitOlComponent implements OnInit {
  formHataliMi: boolean = false;
  mesaj: string;
  kayitForm: FormGroup;

  kullanici: User;

  sepet: Sepet[] = [];

  cities: City[] = [];
  districts: District[] = [];

  cityId: number;

  constructor(
    private authService: AuthService,
    private toastrService: ToastrService,
    private kullaniciService: KullaniciService,
    private cityService: CityService,
    private districtService: DistrictService,

    private sepetService: SepetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getCities();

    this.kayitForm = new FormGroup({
      userType: new FormControl(null),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      kimlikNo: new FormControl(null),
      firma: new FormControl(null),
      vergiDairesi: new FormControl(null),
      vergiNumarasi: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      telefon: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      city: new FormControl(null),
      district: new FormControl(null),
      adres: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      mailGrubu: new FormControl(false),
    });
  }

  getCities() {
    this.cityService.getAll().subscribe((response) => {
      this.cities = response.data;
    });
  }

  getDistrictsByCity(e: any) {
    this.cities.forEach((element) => {
      if (element.cityName == e.target.value) {
        this.cityId = element.cityId;
        this.districtService
          .getAllByCityId(this.cityId)
          .subscribe((response) => {
            this.districts = response.data;
          });
      }
    });
  }

  register() {
    if (this.kayitForm.valid) {
      let kayitModel = Object.assign({}, this.kayitForm.value);
      console.log(kayitModel);
      this.authService.register(kayitModel).subscribe(
        (response) => {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', this.kayitForm.value.email);
          this.getUserIdByEmail(localStorage.getItem('email'));

          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
        .subscribe((response) => {
          this.sepet = response.data;
          this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length);
          this.authService.setKullaniciGirisYapmisMi(true);
          this.router.navigateByUrl('/urunler/k/tk/m/tm');
        });
    });
  }
}
