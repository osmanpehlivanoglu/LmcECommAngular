import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalVariable } from 'src/app/models/global';
import { Kampanya } from 'src/app/models/kampanya';
import { Kategori } from 'src/app/models/kategori';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { Marka } from 'src/app/models/marka';
import { Sepet } from 'src/app/models/sepet';
import { Urun } from 'src/app/models/urun';
import { User } from 'src/app/models/user';
import { KampanyaService } from 'src/app/services/kampanya.service';
import { KategoriService } from 'src/app/services/kategori.service';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { MarkaService } from 'src/app/services/marka.service';
import { SepetService } from 'src/app/services/sepet.service';
import { UrunService } from 'src/app/services/urun.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { BegeniService } from 'src/app/services/begeni.service';

@Component({
  selector: 'app-yeni-urunler',
  templateUrl: './yeni-urunler.component.html',
  styleUrls: ['./yeni-urunler.component.css'],
})
export class YeniUrunlerComponent implements OnInit {
  resimUrl = GlobalVariable.BASE_URL;
  urunler: Urun[] = [];
  kategoriler: Kategori[] = [];
  markalar: Marka[] = [];

  filterText = '';
  deneme = '';

  kullanici: User;
  kullaniciYetki: KullanıcıOperasyonYetki[] = [];
  kullaniciYetkiId: number = 0;

  sepetForm: FormGroup;

  sepet: Sepet[] = [];

  sepetId: number;
  adet: number = 1;
  sepetteAyniUrundenVarMi: boolean = false;

  kampanyaForm: FormGroup;

  yuzde: number;

  urunKampanya: Kampanya;

  kampanyaliUrunIdleri: number[] = [];
  yuzdeler: number[] = [];

  kullaniciAdminMi: boolean;

  kullaniciId: number;

  kullaniciGirisYapmisMi: boolean;

  begeniForm: FormGroup;

  kullaniciBegenileri: number[] = [];
  begeniIdleri: number[] = [];

  constructor(
    private urunService: UrunService,
    private kategoriService: KategoriService,
    private markaService: MarkaService,
    private kullaniciService: KullaniciService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private sepetService: SepetService,
    private activatedRoute: ActivatedRoute,
    private kampanyaService: KampanyaService,
    private toastrService: ToastrService,
    private authService: AuthService,
    private router: Router,
    private begeniService: BegeniService
  ) {}

  ngOnInit(): void {
    this.authService.getKullaniciAdminMi().subscribe((response) => {
      this.kullaniciAdminMi = response;
    });

    this.getKategoriler();
    this.getKampanyalar();

    this.begeniForm = new FormGroup({
      kullaniciId: new FormControl(null),
      urunId: new FormControl(null),
    });

    if (localStorage.getItem('email')) {
      this.getUserIdByEmail(localStorage.getItem('email'));
    }

    this.activatedRoute.params.subscribe((params) => {
      if (params['kategoriId']) {
        if (params['markaId']) {
          this.getUrunlerByKategoriAndMarka(
            params['kategoriId'],
            params['markaId']
          );
        } else {
          this.getUrunlerByKategori(params['kategoriId']);
        }
      } else if (params['markaId']) {
        this.getUrunlerByMarka(params['markaId']);
      } else {
        this.getUrunler();
      }
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
      this.getYetkilerByKullanici(this.kullanici.userId);
      this.getBegenilerByKullaniciId(this.kullanici.userId);
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
      response.data.forEach((element) => {
        this.kampanyaliUrunIdleri.push(element.urunId);
        this.yuzdeler.push(element.yuzde);
      });
    });
  }

  getUrunler() {
    this.urunService.getAll().subscribe((response) => {
      this.urunler = response.data.reverse();
    });
  }

  getUrunlerByKategori(kategoriId: number) {
    this.urunService.getUrunlerByKategori(kategoriId).subscribe((response) => {
      this.urunler = response.data.reverse();
    });
  }

  getUrunlerByMarka(markaId: number) {
    this.urunService.getUrunlerByMarka(markaId).subscribe((response) => {
      this.urunler = response.data.reverse();
    });
  }

  getUrunlerByKategoriAndMarka(kategoriId: number, markaId: number) {
    this.urunService
      .getUrunlerByKategoriAndMarka(kategoriId, markaId)
      .subscribe((response) => {
        this.urunler = response.data.reverse();
      });
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  getMarkalar() {
    this.markaService.getAll().subscribe((response) => {
      this.markalar = response.data;
    });
  }

  getTarihArtan() {
    this.urunler.sort(
      (a, b) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime()
    );
  }

  getTarihAzalan() {
    this.urunler.sort(
      (a, b) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime()
    );
  }

  getFiyatArtan() {
    this.urunler.sort((a, b) => a.bayiFiyati - b.bayiFiyati);
  }

  getFiyatAzalan() {
    this.urunler.sort((a, b) => b.bayiFiyati - a.bayiFiyati);
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

        //seçili kullanıcıya ait sipariş geçilmemiş sepet var mı?
        if (this.sepet.length > 0) {
          //sepette dolaş
          //ilk olarak sepetin id yi al
          //sonra da sepette eşleşen ürün var mı, varsa adet güncelle yoksa bişey yapma
          this.sepet.forEach((element) => {
            if (element.urunId == urunId) {
              this.sepetId = element.sepetId;
              this.adet += element.adet;
              this.sepetteAyniUrundenVarMi = true;
            }
          });
          this.sepet_guncelle(urunId, fiyat);
        }

        //seçili kullanıcıya ait sipariş geçilmemiş sepet yoksa yani kullanıcının sepeti boşsa
        else {
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
        sepetId: new FormControl(this.sepetId, Validators.required),
        onayId: new FormControl(1, Validators.required),
        musteriId: new FormControl(this.kullanici.userId, Validators.required),
        urunId: new FormControl(urunId, Validators.required),
        adet: new FormControl(this.adet, Validators.required),
        fiyat: new FormControl(fiyat, Validators.required),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false, Validators.required),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.updateSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.sepetForm = new FormGroup({
        onayId: new FormControl(1, Validators.required),
        musteriId: new FormControl(this.kullanici.userId, Validators.required),
        urunId: new FormControl(urunId, Validators.required),
        adet: new FormControl(this.adet, Validators.required),
        fiyat: new FormControl(fiyat, Validators.required),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false, Validators.required),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.addSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length + 1);
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    }

    this.adet = 1;
    this.sepetteAyniUrundenVarMi = false; */
  }

  yuzde_guncelle(e: any) {
    this.yuzde = Number(e.target.value);
  }

  kampanya_ekle(urunId: number) {
    this.kampanyaService.getKampanyaByUrunId(urunId).subscribe((response) => {
      this.urunKampanya = response.data;

      if (this.urunKampanya) {
        this.kampanyaForm = new FormGroup({
          kampanyaId: new FormControl(this.urunKampanya.kampanyaId),
          urunId: new FormControl(urunId),
          yuzde: new FormControl(this.yuzde),
        });

        let kampanyaModel = Object.assign({}, this.kampanyaForm.value);

        this.kampanyaService.updateKampanya(kampanyaModel).subscribe(
          (response) => {
            this.toastrService.success(response.message, 'Başarılı!');
          },
          (responseError) => {
            this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
          }
        );
      } else {
        this.kampanyaForm = new FormGroup({
          urunId: new FormControl(urunId),
          yuzde: new FormControl(this.yuzde),
        });
        let kampanyaModel = Object.assign({}, this.kampanyaForm.value);

        this.kampanyaService.addKampanya(kampanyaModel).subscribe(
          (response) => {
            this.toastrService.success(response.message, 'Başarılı!');
          },
          (responseError) => {
            this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
          }
        );
      }
    });
  }
}
