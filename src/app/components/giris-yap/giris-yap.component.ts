import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { SepetService } from 'src/app/services/sepet.service';
import { Sepet } from 'src/app/models/sepet';
import { ToastrService } from 'ngx-toastr';
import { UrunService } from 'src/app/services/urun.service';
import { KampanyaService } from 'src/app/services/kampanya.service';

@Component({
  selector: 'app-giris-yap',
  templateUrl: './giris-yap.component.html',
  styleUrls: ['./giris-yap.component.css'],
})
export class GirisYapComponent implements OnInit {
  formHataliMi: boolean = false;
  mesaj: string;
  girisForm: FormGroup;

  kullanici: User;
  kullaniciYetki: KullanıcıOperasyonYetki[] = [];
  kullaniciYetkiId: number = 0;

  sepet: Sepet[] = [];

  localSepet: Sepet[] = [];

  sepetForm: FormGroup;

  guncelFiyat: number;

  constructor(
    private authService: AuthService,
    private kullaniciService: KullaniciService,
    private router: Router,
    private sepetService: SepetService,
    private toastrService: ToastrService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private location: Location,
    private zone: NgZone,
    private urunService: UrunService,
    private kampanyaService: KampanyaService
  ) {}

  ngOnInit(): void {
    this.girisForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, Validators.required),
    });
  }

  backClicked() {
    this.location.back();
  }

  login() {
    if (this.girisForm.valid) {
      let girisModel = Object.assign({}, this.girisForm.value);

      this.authService.login(girisModel).subscribe(
        (response) => {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('email', this.girisForm.value.email);
          this.getUserIdByEmail(localStorage.getItem('email'));
          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
      this.authService.setKullaniciGirisYapmisMi(false);
    }
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
        }
        this.sepetleriToparla();
      });
  }

  sepetleriToparla() {
    if (localStorage.getItem('musteriId')) {
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
        .subscribe((response) => {
          response.data.forEach((element) => {
            this.sepetService.deleteSepet(element).subscribe((response) => {});
          });
        });

      this.sepetService
        .getSepetlerByMusteriIdAndDurum(
          Number(localStorage.getItem('musteriId')),
          false
        )
        .subscribe((response) => {
          this.localSepet = response.data;

          if (this.localSepet.length > 0) {
            this.localSepet.forEach((element) => {
              this.urunService
                .getUrunByUrunId(element.urunId)
                .subscribe((responseUrun) => {
                  this.kampanyaService
                    .getKampanyaByUrunId(element.urunId)
                    .subscribe((responseKampanya) => {
                      if (responseKampanya.data) {
                        if (this.kullaniciYetkiId === 0) {
                          this.guncelFiyat = element.fiyat;
                        } else if (this.kullaniciYetkiId === 1) {
                          this.guncelFiyat = responseUrun.data.alisFiyati;
                        } else if (this.kullaniciYetkiId === 2) {
                          this.guncelFiyat =
                            responseUrun.data.toptanciFiyati -
                            responseUrun.data.toptanciFiyati *
                              (responseKampanya.data.yuzde / 100);
                        } else if (this.kullaniciYetkiId === 3) {
                          this.guncelFiyat =
                            responseUrun.data.bayiFiyati -
                            responseUrun.data.bayiFiyati *
                              (responseKampanya.data.yuzde / 100);
                        }
                      } else {
                        if (this.kullaniciYetkiId === 0) {
                          this.guncelFiyat = element.fiyat;
                        } else if (this.kullaniciYetkiId === 1) {
                          this.guncelFiyat = responseUrun.data.alisFiyati;
                        } else if (this.kullaniciYetkiId === 2) {
                          this.guncelFiyat = responseUrun.data.toptanciFiyati;
                        } else if (this.kullaniciYetkiId === 3) {
                          this.guncelFiyat = responseUrun.data.bayiFiyati;
                        }
                      }

                      this.sepetForm = new FormGroup({
                        sepetId: new FormControl(element.sepetId),
                        onayId: new FormControl(1),
                        musteriId: new FormControl(this.kullanici.userId),
                        urunId: new FormControl(element.urunId),
                        adet: new FormControl(element.adet),
                        fiyat: new FormControl(this.guncelFiyat),
                        tarih: new FormControl(new Date()),
                        durum: new FormControl(false),
                      });

                      let sepetModel = Object.assign({}, this.sepetForm.value);

                      this.sepetService
                        .updateSepet(sepetModel)
                        .subscribe((response) => {
                          this.sepetService.setSepetteKacCesitUrunVar(
                            this.localSepet.length
                          );
                          this.authService.setKullaniciGirisYapmisMi(true);
                          localStorage.removeItem('musteriId');
                          this.router.navigateByUrl('/urunler/k/tk/m/tm');
                          location.reload();
                        });

                      if (this.kullaniciYetkiId === 1) {
                        this.authService.setKullaniciAdminMi(true);
                      }
                    });
                });
            });
          } else {
            this.sepetService
              .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
              .subscribe((response) => {
                this.sepet = response.data;

                this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length);
                this.authService.setKullaniciGirisYapmisMi(true);
                localStorage.removeItem('musteriId');
                this.router.navigateByUrl('/urunler/k/tk/m/tm');

                location.reload();

                if (this.kullaniciYetkiId === 1) {
                  this.authService.setKullaniciAdminMi(true);
                }
              });
          }
        });
    } else {
      this.sepetService
        .getSepetlerByMusteriIdAndDurum(this.kullanici.userId, false)
        .subscribe((response) => {
          this.sepet = response.data;

          this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length);
          this.authService.setKullaniciGirisYapmisMi(true);
          this.router.navigateByUrl('/urunler/k/tk/m/tm');

          if (this.kullaniciYetkiId === 1) {
            this.authService.setKullaniciAdminMi(true);
          }
        });
    }
  }
}
