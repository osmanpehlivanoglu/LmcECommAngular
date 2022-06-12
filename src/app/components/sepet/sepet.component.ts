import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { Sepet } from 'src/app/models/sepet';
import { Urun } from 'src/app/models/urun';
import { User } from 'src/app/models/user';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SatinAlimService } from 'src/app/services/satin-alim.service';
import { SatisService } from 'src/app/services/satis.service';
import { SepetService } from 'src/app/services/sepet.service';
import { UrunService } from 'src/app/services/urun.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sepet',
  templateUrl: './sepet.component.html',
  styleUrls: ['./sepet.component.css'],
})
export class SepetComponent implements OnInit {
  kullanici: User;
  kullaniciYetki: KullanıcıOperasyonYetki[] = [];
  kullaniciYetkiId: number = 0;
  sepet: Sepet[] = [];
  urunlerDetay: Urun[] = [];
  urunDetay: Urun;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  sepetForm: FormGroup;
  satisForm: FormGroup;
  satinAlimForm: FormGroup;

  guncellenecekSepet: Sepet;

  guncelAdet: number;

  saticiId: number;

  sepetFiyati: number = 0;

  constructor(
    private kullaniciService: KullaniciService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private sepetService: SepetService,
    private urunService: UrunService,
    private satisService: SatisService,
    private satinAlimService: SatinAlimService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('email')) {
      this.getUserIdByEmail(localStorage.getItem('email'));
    } else {
      this.getSepetlerByMusteriAndDurum(
        Number(localStorage.getItem('musteriId')),
        false
      );
    }
  }

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;
      this.getYetkilerByKullanici(this.kullanici.userId);
      this.getSepetlerByMusteriAndDurum(this.kullanici.userId, false);
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

  getSepetlerByMusteriAndDurum(musteriId: number, durum: boolean) {
    this.sepetFiyati = 0;
    this.sepetService
      .getSepetlerByMusteriIdAndDurum(musteriId, durum)
      .subscribe((response) => {
        this.sepet = response.data;

        this.sepet.forEach((element) => {
          this.sepetFiyati += element.adet * element.fiyat;
        });

        this.getUrunlerDetay();
      });
  }

  getUrunlerDetay() {
    this.urunlerDetay = [];
    this.sepet.forEach((element) => {
      this.urunService.getUrunByUrunId(element.urunId).subscribe((response) => {
        this.urunDetay = response.data;
        this.urunlerDetay.push(this.urunDetay);
      });
    });
  }

  guncel_adet(e: any) {
    this.guncelAdet = Number(e.target.value);
  }

  guncelle(id: number) {
    //adedi sıfır seçmişse silelim
    if (this.guncelAdet > 0) {
      this.sepetService.getSepetBySepetId(id).subscribe((response) => {
        this.guncellenecekSepet = response.data;

        this.sepetForm = new FormGroup({
          sepetId: new FormControl(id),
          onayId: new FormControl(1),
          musteriId: new FormControl(this.guncellenecekSepet.musteriId),
          urunId: new FormControl(this.guncellenecekSepet.urunId),
          adet: new FormControl(this.guncelAdet),
          fiyat: new FormControl(this.guncellenecekSepet.fiyat),
          tarih: new FormControl(new Date()),
          durum: new FormControl(false),
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
      });
    } else {
      this.sil(id);
    }
  }

  sil(id: number) {
    this.sepetService.getSepetBySepetId(id).subscribe((response) => {
      this.guncellenecekSepet = response.data;
      this.sepetForm = new FormGroup({
        sepetId: new FormControl(id),
        onayId: new FormControl(1),
        musteriId: new FormControl(this.guncellenecekSepet.musteriId),
        urunId: new FormControl(this.guncellenecekSepet.urunId),
        adet: new FormControl(this.guncellenecekSepet.adet),
        fiyat: new FormControl(this.guncellenecekSepet.fiyat),
        tarih: new FormControl(new Date()),
        durum: new FormControl(false),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.deleteSepet(sepetModel).subscribe(
        (response) => {
          this.toastrService.success(response.message, 'Başarılı!');
          this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length - 1);
          console.log(this.sepet.length);
          if (this.sepet.length == 1) {
            localStorage.clear();
          }
          this.ngOnInit();
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    });
  }

  temizle() {
    if (this.kullanici) {
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
        .subscribe((response) => {
          this.sepet = response.data;

          this.sepet.forEach((element) => {
            this.sepetForm = new FormGroup({
              sepetId: new FormControl(element.sepetId),
              onayId: new FormControl(1),
              musteriId: new FormControl(element.musteriId),
              urunId: new FormControl(element.urunId),
              adet: new FormControl(element.adet),
              fiyat: new FormControl(element.fiyat),
              durum: new FormControl(false),
            });

            let sepetModel = Object.assign({}, this.sepetForm.value);

            this.sepetService.deleteSepet(sepetModel).subscribe(
              (response) => {
                this.sepetService.setSepetteKacCesitUrunVar(0);
                this.ngOnInit();
                this.toastrService.success(response.message, 'Başarılı!');
              },
              (responseError) => {
                this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
              }
            );
          });
        });
    } else {
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(
          Number(localStorage.getItem('musteriId')),
          false
        )
        .subscribe((response) => {
          this.sepet = response.data;

          this.sepet.forEach((element) => {
            this.sepetForm = new FormGroup({
              sepetId: new FormControl(element.sepetId),
              onayId: new FormControl(1),
              musteriId: new FormControl(element.musteriId),
              urunId: new FormControl(element.urunId),
              adet: new FormControl(element.adet),
              fiyat: new FormControl(element.fiyat),
              durum: new FormControl(false),
            });

            let sepetModel = Object.assign({}, this.sepetForm.value);

            this.sepetService.deleteSepet(sepetModel).subscribe(
              (response) => {
                this.sepetService.setSepetteKacCesitUrunVar(0);
                this.ngOnInit();
                this.toastrService.success(response.message, 'Başarılı!');
                localStorage.clear();
              },
              (responseError) => {
                this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
              }
            );
          });
        });
    }
  }

  onayla() {
    //giriş yapıldı mı
    if (this.kullanici) {
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
        .subscribe((response) => {
          this.sepet = response.data;

          this.sepet.forEach((element) => {
            this.sepetForm = new FormGroup({
              sepetId: new FormControl(element.sepetId),
              onayId: new FormControl(1),
              musteriId: new FormControl(element.musteriId),
              urunId: new FormControl(element.urunId),
              adet: new FormControl(element.adet),
              fiyat: new FormControl(element.fiyat),
              tarih: new FormControl(new Date()),
              durum: new FormControl(true),
            });

            let sepetModel = Object.assign({}, this.sepetForm.value);

            this.sepetService.updateSepet(sepetModel).subscribe(
              (response) => {
                this.eklendiMi = true;
                this.mesaj =
                  'Sipariş Başarılı! Siparişinizle ilgili en kısa sürede tarafınıza dönüş sağlanacaktır.';
                this.satisVeSatinAlimSiparisiOlustur(
                  element.sepetId,
                  element.urunId
                );
                setTimeout(() => {
                  this.eklendiMi = false;
                  this.mesaj = '';
                  this.sepetService.setSepetteKacCesitUrunVar(0);
                  this.ngOnInit();
                }, 2000);
              },
              (responseError) => {
                this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
              }
            );
          });
        });
    } else {
      this.toastrService.info(
        'Giriş sayfasına yönlendiriliyorsunuz...',
        'Kullanıcı Girişi Gerekli!'
      );
      this.router.navigateByUrl('/giris-yap');
    }
  }

  satisVeSatinAlimSiparisiOlustur(sepetId: number, urunId: number) {
    this.satisForm = new FormGroup({
      sepetId: new FormControl(sepetId),
    });

    let satisModel = Object.assign({}, this.satisForm.value);
    this.satisService.addSatis(satisModel).subscribe((response) => {});

    this.urunService.getUrunByUrunId(urunId).subscribe((response) => {
      this.saticiId = response.data.saticiId;
      this.satinAlimForm = new FormGroup({
        sepetId: new FormControl(sepetId),
        saticiId: new FormControl(this.saticiId),
      });
      let satinAlimModel = Object.assign({}, this.satinAlimForm.value);
      this.satinAlimService
        .addSatinAlim(satinAlimModel)
        .subscribe((response) => {});
    });
  }
}
