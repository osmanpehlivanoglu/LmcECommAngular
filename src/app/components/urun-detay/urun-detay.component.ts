import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Urun } from 'src/app/models/urun';
import { UrunService } from 'src/app/services/urun.service';
import { ResimService } from 'src/app/services/resim.service';
import { Resim } from 'src/app/models/resim';
import { GlobalVariable } from 'src/app/models/global';
import { UyumMarkaService } from 'src/app/services/uyum-marka.service';
import { UyumMarka } from 'src/app/models/uyumMarka';
import { UyumModelService } from 'src/app/services/uyum-model.service';
import { SepetService } from 'src/app/services/sepet.service';
import { User } from 'src/app/models/user';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Sepet } from 'src/app/models/sepet';
import { SatisService } from 'src/app/services/satis.service';
import { SatinAlimService } from 'src/app/services/satin-alim.service';
import { ToptanciService } from 'src/app/services/toptanci.service';
import { Toptanci } from 'src/app/models/toptanci';
import { getLocaleDateFormat } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { KampanyaService } from 'src/app/services/kampanya.service';

@Component({
  selector: 'app-urun-detay',
  templateUrl: './urun-detay.component.html',
  styleUrls: ['./urun-detay.component.css'],
})
export class UrunDetayComponent implements OnInit {
  urunDetay: Urun;
  urunResimleri: Resim[];

  seciliResim: Resim;

  uyumMarkaIdler: string;
  uyumModelIdler: string;

  uyumMarkaAdlar: string[] = [];
  uyumModelAdlar: string[] = [];

  resimUrl = GlobalVariable.BASE_URL;

  adet: number = 1;
  fiyat: number;

  kullanici: User;
  kullaniciYetki: KullanıcıOperasyonYetki[] = [];
  kullaniciYetkiId: number = 0;

  sepetForm: FormGroup;

  sepet: Sepet[] = [];

  sepetId: number;

  sepetteAyniUrundenVarMi: boolean = false;

  kampanyaliUrunIdleri: number[] = [];
  yuzdeler: number[] = [];

  //admin sipariş eklerken kullanıcı ve satıcı seçsin diye
  toptancilar: Toptanci[] = [];
  kullanicilar: User[] = [];
  seciliToptanciId: number;
  seciliKullaniciId: number;
  seciliKullaniciYetki: KullanıcıOperasyonYetki[] = [];
  seciliKullaniciYetkiId: number = 0;
  seciliKullaniciFiyati: number = 0;
  satisForm: FormGroup;
  satinAlimForm: FormGroup;
  eklendiktenSonrakiSepetId: number;

  kullaniciId: number;

  kullaniciGirisYapmisMi: boolean;

  constructor(
    private urunService: UrunService,
    private resimService: ResimService,
    private uyumMarkaService: UyumMarkaService,
    private uyumModelService: UyumModelService,
    private activatedRoute: ActivatedRoute,
    private sepetService: SepetService,
    private kullaniciService: KullaniciService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private toptanciService: ToptanciService,
    private satisService: SatisService,
    private satinAlimService: SatinAlimService,
    private toastrService: ToastrService,
    private kampanyaService: KampanyaService
  ) {}

  ngOnInit(): void {
    this.getKampanyalar();

    if (localStorage.getItem('email')) {
      this.getUserIdByEmail(localStorage.getItem('email'));
    }

    this.activatedRoute.params.subscribe((params) => {
      this.getUrunByUrunId(params['urunId']);
      this.getUrunResimleriByUrunId(params['urunId']);
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

  getToptancilar() {
    this.toptanciService.getAll().subscribe((response) => {
      this.toptancilar = response.data;
    });
  }
  updateSeciliToptanci(e: any) {
    this.seciliToptanciId = Number(e.target.value);
  }

  getKullanicilar() {
    this.kullaniciService.getAll().subscribe((response) => {
      this.kullanicilar = response.data;
    });
  }
  updateSeciliKullanici(e: any) {
    this.seciliKullaniciId = Number(e.target.value);
    if (this.seciliKullaniciId > 0) {
      this.getYetkilerByKullaniciAdminSectiyse(this.seciliKullaniciId);
    } else {
      this.seciliKullaniciFiyati = 0;
    }
  }

  getYetkilerByKullaniciAdminSectiyse(kullaniciId: number) {
    this.kullaniciYetkiService
      .getOperasyonYetkilerByKullaniciId(kullaniciId)
      .subscribe((response) => {
        this.seciliKullaniciYetki = response.data;
        if (this.seciliKullaniciYetki.length > 0) {
          this.seciliKullaniciYetkiId =
            this.seciliKullaniciYetki[0].operationClaimId;
        } else {
          this.seciliKullaniciYetkiId = 0;
        }

        if (this.seciliKullaniciYetkiId == 0) {
          this.seciliKullaniciFiyati = this.urunDetay.perakendeFiyati;
        } else if (this.seciliKullaniciYetkiId == 1) {
          this.seciliKullaniciFiyati = this.urunDetay.alisFiyati;
        } else if (this.seciliKullaniciYetkiId == 2) {
          this.seciliKullaniciFiyati = this.urunDetay.toptanciFiyati;
        } else if (this.seciliKullaniciYetkiId == 3) {
          this.seciliKullaniciFiyati = this.urunDetay.bayiFiyati;
        }
      });
  }

  sepete_ekle(yuzde: number) {
    //kullanıcı adminse işleyiş başka; seçtiği kullanıcının yetkisine göre fiyat
    //bi de sepet direkt true sepet onayına gerek yok
    //bi de admin onayına da gerek yok direkt onay durumu 2 ve satış ve satınalma siparişleri de oluşsun
    if (this.kullaniciYetkiId == 1) {
      let tarih = new Date();
      let tarihStr = tarih.toISOString().substring(0, 19);

      this.sepetForm = new FormGroup({
        onayId: new FormControl(2, Validators.required),
        musteriId: new FormControl(this.seciliKullaniciId, Validators.required),
        urunId: new FormControl(this.urunDetay.urunId, Validators.required),
        adet: new FormControl(this.adet, Validators.required),
        fiyat: new FormControl(this.seciliKullaniciFiyati, Validators.required),
        tarih: new FormControl(tarih),
        durum: new FormControl(true, Validators.required),
        tarihStr: new FormControl(tarihStr),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      //sepeti ekle
      this.sepetService.addSepet(sepetModel).subscribe(
        (response) => {
          //eklenen sepetin idsi için tarihStr ve onay durumuna göre çek
          this.sepetService
            .getSepetByOnayIdAndTarih(2, tarihStr)
            .subscribe((response) => {
              this.eklendiktenSonrakiSepetId = response.data.sepetId;
              //satışı ekle
              this.satisForm = new FormGroup({
                sepetId: new FormControl(
                  this.eklendiktenSonrakiSepetId,
                  Validators.required
                ),
              });

              let satisModel = Object.assign({}, this.satisForm.value);

              this.satisService.addSatis(satisModel).subscribe((response) => {
                //satinalimi ekle
                this.satinAlimForm = new FormGroup({
                  sepetId: new FormControl(
                    this.eklendiktenSonrakiSepetId,
                    Validators.required
                  ),
                  saticiId: new FormControl(
                    this.seciliToptanciId,
                    Validators.required
                  ),
                });
                let satinAlimModel = Object.assign(
                  {},
                  this.satinAlimForm.value
                );
                this.satinAlimService
                  .addSatinAlim(satinAlimModel)
                  .subscribe((response) => {});
              });
            });
          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    }
    //değilse normal
    else {
      if (this.kullaniciYetkiId == 0) {
        this.fiyat =
          this.urunDetay.perakendeFiyati -
          this.urunDetay.perakendeFiyati * (yuzde / 100);
      } else if (this.kullaniciYetkiId == 2) {
        this.fiyat =
          this.urunDetay.toptanciFiyati -
          this.urunDetay.toptanciFiyati * (yuzde / 100);
      } else if (this.kullaniciYetkiId == 3) {
        this.fiyat =
          this.urunDetay.bayiFiyati - this.urunDetay.bayiFiyati * (yuzde / 100);
      }

      if (this.kullanici) {
        this.kullaniciId = this.kullanici.userId;
        this.sepetService
          .getSepetlerByMusteriIdAndDurum(this.kullaniciId, false)
          .subscribe((response) => {
            this.sepet = response.data;
            if (this.sepet.length > 0) {
              this.sepet.forEach((element) => {
                if (element.urunId == this.urunDetay.urunId) {
                  this.sepetId = element.sepetId;
                  this.adet += element.adet;
                  this.sepetteAyniUrundenVarMi = true;
                }
              });
              this.sepet_guncelle();
            } else {
              this.sepet_guncelle();
            }
          });
      } else {
        if (localStorage.getItem('musteriId')) {
          this.kullaniciId = Number(localStorage.getItem('musteriId'));

          this.sepetService
            .getSepetlerByMusteriIdAndDurum(this.kullaniciId, false)
            .subscribe((response) => {
              this.sepet = response.data;
              if (this.sepet.length > 0) {
                this.sepet.forEach((element) => {
                  if (element.urunId == this.urunDetay.urunId) {
                    this.sepetId = element.sepetId;
                    this.adet += element.adet;
                    this.sepetteAyniUrundenVarMi = true;
                  }
                });
                this.sepet_guncelle();
              } else {
                this.sepet_guncelle();
              }
            });
        } else {
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
                  if (element.urunId == this.urunDetay.urunId) {
                    this.sepetId = element.sepetId;
                    this.adet += element.adet;
                    this.sepetteAyniUrundenVarMi = true;
                  }
                });
                this.sepet_guncelle();
              } else {
                this.sepet_guncelle();
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
              if (element.urunId == this.urunDetay.urunId) {
                this.sepetId = element.sepetId;
                this.adet += element.adet;
                this.sepetteAyniUrundenVarMi = true;
              }
            });
            this.sepet_guncelle();
          } else {
            this.sepet_guncelle();
          }
        }); */
    }
  }

  sepet_guncelle() {
    if (this.sepetteAyniUrundenVarMi) {
      this.sepetForm = new FormGroup({
        sepetId: new FormControl(this.sepetId),
        onayId: new FormControl(1),
        musteriId: new FormControl(this.kullaniciId),
        urunId: new FormControl(this.urunDetay.urunId),
        adet: new FormControl(this.adet),
        fiyat: new FormControl(this.fiyat),
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
        urunId: new FormControl(this.urunDetay.urunId),
        adet: new FormControl(this.adet),
        fiyat: new FormControl(this.fiyat),
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
        urunId: new FormControl(this.urunDetay.urunId, Validators.required),
        adet: new FormControl(this.adet, Validators.required),
        fiyat: new FormControl(this.fiyat, Validators.required),
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
        urunId: new FormControl(this.urunDetay.urunId, Validators.required),
        adet: new FormControl(this.adet, Validators.required),
        fiyat: new FormControl(this.fiyat, Validators.required),
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

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;
      this.getYetkilerByKullanici(this.kullanici.userId);
    });
  }

  getYetkilerByKullanici(kullaniciId: number) {
    this.kullaniciYetkiService
      .getOperasyonYetkilerByKullaniciId(kullaniciId)
      .subscribe((response) => {
        this.kullaniciYetki = response.data;
        if (this.kullaniciYetki.length > 0) {
          this.kullaniciYetkiId = this.kullaniciYetki[0].operationClaimId;
          if (this.kullaniciYetkiId === 1) {
            this.getToptancilar();
            this.getKullanicilar();
          }
        }
      });
  }

  getUrunByUrunId(urunId: number) {
    this.urunService.getUrunByUrunId(urunId).subscribe((response) => {
      this.urunDetay = response.data;

      this.uyumMarkaIdler = this.urunDetay.uyumMarkaId;
      this.uyumModelIdler = this.urunDetay.uyumModelId;

      this.getUyumluMarkalar();
      this.getUyumluModeller();
    });
  }

  getUyumluMarkalar() {
    this.uyumMarkaIdler.split(',').forEach((element) => {
      this.uyumMarkaService
        .getUyumMarkaByUyumMarkaId(Number(element))
        .subscribe((response) => {
          this.uyumMarkaAdlar.push(response.data.uyumMarkaAdi);
        });
    });
  }

  getUyumluModeller() {
    this.uyumModelIdler.split(',').forEach((element) => {
      this.uyumModelService
        .getUyumModelByUyumModelId(Number(element))
        .subscribe((response) => {
          this.uyumModelAdlar.push(response.data.uyumModelAdi);
        });
    });
  }

  getUrunResimleriByUrunId(urunId: number) {
    this.resimService.getResimlerByUrunId(urunId).subscribe((response) => {
      this.urunResimleri = response.data;
      console.log(this.urunResimleri);
    });
  }

  setSeciliResim(image: Resim) {
    this.seciliResim = image;
  }

  getCurrentImageClass(image: Resim) {
    if (this.urunResimleri[0] == image) {
      return 'carousel-item active';
    } else {
      return 'carousel-item ';
    }
  }

  getButtonClass(image: Resim) {
    if ((image = this.urunResimleri[0])) {
      return 'active';
    } else {
      return '';
    }
  }

  adetArtir() {
    this.adet += 1;
  }

  adetAzalt() {
    if (this.adet > 1) {
      this.adet -= 1;
    }
  }
}
