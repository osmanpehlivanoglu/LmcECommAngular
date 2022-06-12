import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { OperasyonYetki } from 'src/app/models/operasyon-yetki';
import { User } from 'src/app/models/user';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { OperasyonYetkiService } from 'src/app/services/operasyon-yetki.service';

@Component({
  selector: 'app-kullanici-operasyon-yetki-guncelle',
  templateUrl: './kullanici-operasyon-yetki-guncelle.component.html',
  styleUrls: ['./kullanici-operasyon-yetki-guncelle.component.css'],
})
export class KullaniciOperasyonYetkiGuncelleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  kullanicilar: User[] = [];
  yetkiler: OperasyonYetki[] = [];
  yetki: OperasyonYetki;
  kullaniciYetkiler: KullanıcıOperasyonYetki[] = [];

  kullanicininTumYetkiler: string[] = [];

  kullaniciYetkilendirForm: FormGroup;
  adlarIcinForm: FormGroup;

  seciliKullaniciId: number = 0;
  seciliYetkiId: number = 0;
  seciliKullaniciOperasyonId: number = 0;

  constructor(
    private kullaniciService: KullaniciService,
    private yetkiService: OperasyonYetkiService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getKullanicilar();
    this.getYetkiler();

    this.kullaniciYetkilendirForm = new FormGroup({
      userId: new FormControl(null, Validators.required),
      operationClaimId: new FormControl(null, Validators.required),
      userOperationClaimId: new FormControl(null, Validators.required),
    });

    this.adlarIcinForm = new FormGroup({
      kullaniciAdi: new FormControl(null, Validators.required),
      yetkiAdi: new FormControl(null, Validators.required),
      mevcutYetki: new FormControl(null),
    });
  }

  getKullanicilar() {
    this.kullaniciService.getAll().subscribe((response) => {
      this.kullanicilar = response.data;
    });
  }

  getYetkiler() {
    this.yetkiService.getAll().subscribe((response) => {
      this.yetkiler = response.data;
    });
  }

  getOperasyonYetkilerByKullaniciId(kullaniciId: number) {
    this.kullaniciYetkiService
      .getOperasyonYetkilerByKullaniciId(kullaniciId)
      .subscribe((response) => {
        this.kullaniciYetkiler = response.data;

        if (this.kullaniciYetkiler.length > 0) {
          this.seciliKullaniciOperasyonId =
            this.kullaniciYetkiler[0].userOperationClaimId;
          this.kullaniciYetkilendirForm.patchValue({
            userOperationClaimId: this.seciliKullaniciOperasyonId,
          });
          this.yetkiler.forEach((element) => {
            if (
              this.kullaniciYetkiler[0].operationClaimId ==
              element.operationClaimId
            ) {
              this.adlarIcinForm.patchValue({
                mevcutYetki: element.name,
              });
            }
          });
        }
      });
  }

  updateSeciliKullanici(e: any) {
    this.adlarIcinForm.get('mevcutYetki').reset();
    this.kullaniciYetkilendirForm.get('userOperationClaimId').reset();
    this.seciliKullaniciOperasyonId = 0;

    this.seciliKullaniciId = Number(e.target.value);
    this.kullaniciYetkilendirForm.patchValue({
      userId: this.seciliKullaniciId,
    });

    this.getOperasyonYetkilerByKullaniciId(this.seciliKullaniciId);
  }

  updateSeciliYetki(e: any) {
    this.seciliYetkiId = Number(e.target.value);
    this.kullaniciYetkilendirForm.patchValue({
      operationClaimId: this.seciliYetkiId,
    });
  }

  guncelle() {
    if (this.kullaniciYetkilendirForm.valid) {
      let kullaniciYetkilendirModel = Object.assign(
        {},
        this.kullaniciYetkilendirForm.value
      );

      this.kullaniciYetkiService
        .updateOperasyonYetki(kullaniciYetkilendirModel)
        .subscribe(
          (response) => {
            this.eklendiMi = true;
            this.mesaj = response.message;
            setTimeout(() => {
              this.eklendiMi = false;
              this.mesaj = '';
              this.kullaniciYetkilendirForm.reset();
              this.adlarIcinForm.reset();
              this.seciliKullaniciId = 0;
              this.seciliYetkiId = 0;
              this.seciliKullaniciOperasyonId = 0;
            }, 2000);
          },
          (responseError) => {
            this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
          }
        );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!  Güncel yetki seçilmemiş.';
      setTimeout(() => {
        this.formHataliMi = false;
        this.mesaj = '';
      }, 2000);
    }
  }

  sil() {
    this.kullaniciYetkilendirForm = new FormGroup({
      userId: new FormControl(1111, Validators.required),
      operationClaimId: new FormControl(1111, Validators.required),
      userOperationClaimId: new FormControl(
        this.kullaniciYetkilendirForm.get('userOperationClaimId').value,
        Validators.required
      ),
    });

    let kullaniciYetkilendirModel = Object.assign(
      {},
      this.kullaniciYetkilendirForm.value
    );

    this.kullaniciYetkiService
      .deleteOperasyonYetki(kullaniciYetkilendirModel)
      .subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.kullaniciYetkilendirForm.reset();
            this.adlarIcinForm.reset();
          }, 2000);
        },
        (responseError) => {
          this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
        }
      );
  }
}
