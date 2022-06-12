import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/models/global';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Kampanya } from 'src/app/models/kampanya';
import { User } from 'src/app/models/user';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KampanyaService } from 'src/app/services/kampanya.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Sepet } from 'src/app/models/sepet';
import { SepetService } from 'src/app/services/sepet.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BegeniService } from 'src/app/services/begeni.service';

@Component({
  selector: 'app-kampanya',
  templateUrl: './kampanya.component.html',
  styleUrls: ['./kampanya.component.css'],
})
export class KampanyaComponent implements OnInit {
  owlOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 700,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1,
      },
      480: {
        items: 2,
      },
      767: {
        items: 2,
      },
      1024: {
        items: 4,
      },
    },
    nav: true,
  };

  resimUrl = GlobalVariable.BASE_URL;
  kampanyalar: Kampanya[] = [];

  kullanici: User;
  kullaniciYetki: KullanıcıOperasyonYetki[] = [];
  kullaniciYetkiId: number = 0;

  sepetForm: FormGroup;
  sepet: Sepet[] = [];
  adet: number = 1;
  sepetId: number;
  sepetteAyniUrundenVarMi: boolean = false;

  kampanyaForm: FormGroup;

  kullaniciAdminMi: boolean;

  kullaniciId: number;

  kullaniciGirisYapmisMi: boolean;
  begeniForm: FormGroup;

  kullaniciBegenileri: number[] = [];
  begeniIdleri: number[] = [];

  constructor(
    private kampanyaService: KampanyaService,
    private kullaniciService: KullaniciService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private sepetService: SepetService,
    private toastrService: ToastrService,
    private router: Router,
    private authService: AuthService,
    private begeniService: BegeniService
  ) {}

  ngOnInit(): void {
    this.authService.getKullaniciAdminMi().subscribe((response) => {
      this.kullaniciAdminMi = response;
    });

    this.getKampanyalar();

    this.getUserIdByEmail(localStorage.getItem('email'));
    this.begeniForm = new FormGroup({
      kullaniciId: new FormControl(null),
      urunId: new FormControl(null),
    });
  }

  begeniEkle(urunId: number) {
    if (this.kullanici) {
      this.begeniForm = new FormGroup({
        kullaniciId: new FormControl(this.kullanici.userId),
        urunId: new FormControl(urunId),
      });

      let begeniModel = Object.assign({}, this.begeniForm.value);

      this.begeniService.addBegeni(begeniModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          this.ngOnInit();
        },
        (responseError) => {
          this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.toastrService.info(
        'Giriş sayfasına yönlendiriliyorsunuz...',
        'Kullanıcı Girişi Gerekli!'
      );
      this.router.navigateByUrl('/giris-yap');
    }
  }

  begeniCikar(begeniId: number) {
    if (this.kullanici) {
      this.begeniForm = new FormGroup({
        begeniId: new FormControl(begeniId),
      });

      let begeniModel = Object.assign({}, this.begeniForm.value);

      this.begeniService.deleteBegeni(begeniModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          this.ngOnInit();
        },
        (responseError) => {
          this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.toastrService.info(
        'Giriş sayfasına yönlendiriliyorsunuz...',
        'Kullanıcı Girişi Gerekli!'
      );
      this.router.navigateByUrl('/giris-yap');
    }
  }

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;
      if (this.kullanici) {
        this.getYetkilerByKullanici(this.kullanici.userId);
        this.getBegenilerByKullaniciId(this.kullanici.userId);
      }
    });
  }

  getBegenilerByKullaniciId(kullaniciId: number) {
    this.kullaniciBegenileri = [];
    this.begeniIdleri = [];
    this.begeniService.getAll().subscribe((response) => {
      response.data.forEach((element) => {
        this.kullaniciBegenileri.push(element.urunId);
        this.begeniIdleri.push(element.begeniId);
      });
    });
  }

  getYetkilerByKullanici(kullaniciId: number) {
    this.kullaniciYetkiService
      .getOperasyonYetkilerByKullaniciId(kullaniciId)
      .subscribe((response) => {
        this.kullaniciYetki = response.data;
        if (this.kullaniciYetki.length > 0) {
          this.kullaniciYetkiId = this.kullaniciYetki[0].operationClaimId;
        }
      });
  }

  getKampanyalar() {
    this.kampanyaService.getAll().subscribe((response) => {
      this.kampanyalar = response.data;
    });
  }

  sepete_ekle(urunId: number, fiyat: number) {
    if (this.kullanici) {
      this.kullaniciId = this.kullanici.userId;
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(this.kullaniciId, false)
        .subscribe((response) => {
          this.sepet = response.data;
          if (this.sepet.length > 0) {
            this.sepet.forEach((element) => {
              if (element.urunId == urunId) {
                this.sepetId = element.sepetId;
                this.adet += element.adet;
                this.sepetteAyniUrundenVarMi = true;
              }
            });
            this.sepet_guncelle(urunId, fiyat);
          } else {
            this.sepet_guncelle(urunId, fiyat);
          }
        });

      //kullanıcı giriş yapmadıysa
    } else {
      //localstorage da tanımlı musteriId var mı?
      if (localStorage.getItem('musteriId')) {
        this.kullaniciId = Number(localStorage.getItem('musteriId'));

        this.sepetService
          .getSepetlerByMusteriIdAndDurum(this.kullaniciId, false)
          .subscribe((response) => {
            this.sepet = response.data;
            if (this.sepet.length > 0) {
              this.sepet.forEach((element) => {
                if (element.urunId == urunId) {
                  this.sepetId = element.sepetId;
                  this.adet += element.adet;
                  this.sepetteAyniUrundenVarMi = true;
                }
              });
              this.sepet_guncelle(urunId, fiyat);
            } else {
              this.sepet_guncelle(urunId, fiyat);
            }
          });
      }

      //yoksa localstorage da musteriid oluştur
      else {
        localStorage.setItem(
          'musteriId',
          (Math.floor(Math.random() * 1000000) + 5000000).toString()
        );

        this.kullaniciId = Number(localStorage.getItem('musteriId'));

        this.sepetService
          .getSepetlerByMusteriIdAndDurum(this.kullaniciId, false)
          .subscribe((response) => {
            this.sepet = response.data;
            if (this.sepet.length > 0) {
              this.sepet.forEach((element) => {
                if (element.urunId == urunId) {
                  this.sepetId = element.sepetId;
                  this.adet += element.adet;
                  this.sepetteAyniUrundenVarMi = true;
                }
              });
              this.sepet_guncelle(urunId, fiyat);
            } else {
              this.sepet_guncelle(urunId, fiyat);
            }
          });
      }
    }
    /* this.sepetService
      .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
      .subscribe((response) => {
        this.sepet = response.data;
        if (this.sepet.length > 0) {
          this.sepet.forEach((element) => {
            if (element.urunId == urunId) {
              this.sepetId = element.sepetId;
              this.adet += element.adet;
              this.sepetteAyniUrundenVarMi = true;
            }
          });
          this.sepet_guncelle(urunId, fiyat);
        } else {
          this.sepet_guncelle(urunId, fiyat);
        }
      }); */
  }

  sepet_guncelle(urunId: number, fiyat: number) {
    if (this.sepetteAyniUrundenVarMi) {
      this.sepetForm = new FormGroup({
        sepetId: new FormControl(this.sepetId),
        onayId: new FormControl(1),
        musteriId: new FormControl(this.kullaniciId),
        urunId: new FormControl(urunId),
        adet: new FormControl(this.adet),
        fiyat: new FormControl(fiyat),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.updateSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');

          /* let currentUrl = this.router.url;

          if (currentUrl) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                console.log(currentUrl);
                this.router.navigate([currentUrl]);
              });
          } */
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.sepetForm = new FormGroup({
        onayId: new FormControl(1),
        musteriId: new FormControl(this.kullaniciId),
        urunId: new FormControl(urunId),
        adet: new FormControl(this.adet),
        fiyat: new FormControl(fiyat),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.addSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length + 1);
          /* let currentUrl = this.router.url;

          if (currentUrl) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate([currentUrl]);
              });
          } */
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    }

    this.adet = 1;
    this.sepetteAyniUrundenVarMi = false;
    /* if (this.sepetteAyniUrundenVarMi) {
      this.sepetForm = new FormGroup({
        sepetId: new FormControl(this.sepetId),
        onayId: new FormControl(1),
        musteriId: new FormControl(this.kullanici.userId),
        urunId: new FormControl(urunId),
        adet: new FormControl(this.adet),
        fiyat: new FormControl(fiyat),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.updateSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          let currentUrl = this.router.url;

          if (currentUrl) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                console.log(currentUrl);
                this.router.navigate([currentUrl]);
              });
          }
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.sepetForm = new FormGroup({
        onayId: new FormControl(1),
        musteriId: new FormControl(this.kullanici.userId),
        urunId: new FormControl(urunId),
        adet: new FormControl(this.adet),
        fiyat: new FormControl(fiyat),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.addSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length + 1);

          let currentUrl = this.router.url;

          if (currentUrl) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                console.log(currentUrl);
                this.router.navigate([currentUrl]);
              });
          }
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    }

    this.adet = 1;
    this.sepetteAyniUrundenVarMi = false; */
  }

  kampanya_sil(kampanyaId: number) {
    this.kampanyaForm = new FormGroup({
      kampanyaId: new FormControl(kampanyaId),
    });

    let kampanyaModel = Object.assign({}, this.kampanyaForm.value);

    this.kampanyaService.deleteKampanya(kampanyaModel).subscribe(
      (response) => {
        this.toastrService.success(response.message, 'Başarılı!');
      },
      (responseError) => {
        this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
      }
    );
  }
}
