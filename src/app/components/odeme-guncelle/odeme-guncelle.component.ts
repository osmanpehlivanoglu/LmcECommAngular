import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlinanOdeme } from 'src/app/models/alinanodeme';
import { YapilanOdeme } from 'src/app/models/yapilanodeme';
import { AlinanOdemeService } from 'src/app/services/alinan-odeme.service';
import { YapilanOdemeService } from 'src/app/services/yapilan-odeme.service';

@Component({
  selector: 'app-odeme-guncelle',
  templateUrl: './odeme-guncelle.component.html',
  styleUrls: ['./odeme-guncelle.component.css'],
})
export class OdemeGuncelleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  alinanOdemeler: AlinanOdeme[] = [];
  yapilanOdemeler: YapilanOdeme[] = [];
  guncelMiktar: number;

  seciliOdemeTuru: number = 0;
  seciliOdemeId: number;

  guncellenecekAlinanOdeme: AlinanOdeme;
  guncellenecekYapilanOdeme: YapilanOdeme;
  alinanOdemeForm: FormGroup;
  yapilanOdemeForm: FormGroup;

  constructor(
    private alinanOdemeService: AlinanOdemeService,
    private yapilanOdemeService: YapilanOdemeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {}

  updateSeciliOdeme(e: any) {
    this.seciliOdemeTuru = Number(e.target.value);

    if (this.seciliOdemeTuru == 1) {
      this.getYapilanOdemeler();
    } else if (this.seciliOdemeTuru == 2) {
      this.getAlinanOdemeler();
    }
  }

  guncel_miktar(e: any) {
    this.guncelMiktar = Number(e.target.value);
  }

  getAlinanOdemeler() {
    this.alinanOdemeService.getAll().subscribe((response) => {
      this.alinanOdemeler = response.data;
      this.yapilanOdemeler = [];
    });
  }

  getYapilanOdemeler() {
    this.yapilanOdemeService.getAll().subscribe((response) => {
      this.yapilanOdemeler = response.data;
      this.alinanOdemeler = [];
    });
  }

  guncelle(id: number) {
    if (this.seciliOdemeTuru === 1) {
      this.yapilanOdemeService
        .getYapilanOdemeByYapilanOdemeId(id)
        .subscribe((response) => {
          this.guncellenecekYapilanOdeme = response.data;

          this.yapilanOdemeForm = new FormGroup({
            yapilanOdemeId: new FormControl(id),
            miktar: new FormControl(this.guncelMiktar),
            toptanciId: new FormControl(
              this.guncellenecekYapilanOdeme.toptanciId
            ),
            tarih: new FormControl(this.guncellenecekYapilanOdeme.tarih),
          });

          if (this.yapilanOdemeForm.valid) {
            let yapilanOdemeModel = Object.assign(
              {},
              this.yapilanOdemeForm.value
            );

            this.yapilanOdemeService
              .updateYapilanOdeme(yapilanOdemeModel)
              .subscribe(
                (response) => {
                  this.getYapilanOdemeler();
                  this.toastrService.success(response.message, 'Başarılı');
                },
                (responseError) => {
                  this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
                }
              );
          } else {
            this.formHataliMi = true;
            this.mesaj = 'Hatalı Form!';
          }
        });
    } else if (this.seciliOdemeTuru === 2) {
      this.alinanOdemeService
        .getAlinanOdemeByAlinanOdemeId(id)
        .subscribe((response) => {
          this.guncellenecekAlinanOdeme = response.data;

          this.alinanOdemeForm = new FormGroup({
            alinanOdemeId: new FormControl(id),
            miktar: new FormControl(this.guncelMiktar),
            musteriId: new FormControl(this.guncellenecekAlinanOdeme.musteriId),
            tarih: new FormControl(this.guncellenecekAlinanOdeme.tarih),
          });

          if (this.alinanOdemeForm.valid) {
            let alinanOdemeModel = Object.assign(
              {},
              this.alinanOdemeForm.value
            );

            this.alinanOdemeService
              .updateAlinanOdeme(alinanOdemeModel)
              .subscribe(
                (response) => {
                  this.getAlinanOdemeler();
                  this.toastrService.success(response.message, 'Başarılı');
                },
                (responseError) => {
                  this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
                }
              );
          } else {
            this.formHataliMi = true;
            this.mesaj = 'Hatalı Form!';
          }
        });
    }
  }

  iptal(id: number) {
    if (this.seciliOdemeTuru === 1) {
      this.yapilanOdemeService
        .getYapilanOdemeByYapilanOdemeId(id)
        .subscribe((response) => {
          this.guncellenecekYapilanOdeme = response.data;

          this.yapilanOdemeForm = new FormGroup({
            yapilanOdemeId: new FormControl(id),
            miktar: new FormControl(this.guncellenecekYapilanOdeme.miktar),
            toptanciId: new FormControl(
              this.guncellenecekYapilanOdeme.toptanciId
            ),
            tarih: new FormControl(this.guncellenecekYapilanOdeme.tarih),
          });

          if (this.yapilanOdemeForm.valid) {
            let yapilanOdemeModel = Object.assign(
              {},
              this.yapilanOdemeForm.value
            );

            this.yapilanOdemeService
              .deleteYapilanOdeme(yapilanOdemeModel)
              .subscribe(
                (response) => {
                  this.getYapilanOdemeler();
                  this.toastrService.success(response.message, 'Başarılı');
                },
                (responseError) => {
                  this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
                }
              );
          } else {
            this.formHataliMi = true;
            this.mesaj = 'Hatalı Form!';
          }
        });
    } else if (this.seciliOdemeTuru === 2) {
      this.alinanOdemeService
        .getAlinanOdemeByAlinanOdemeId(id)
        .subscribe((response) => {
          this.guncellenecekAlinanOdeme = response.data;

          this.alinanOdemeForm = new FormGroup({
            alinanOdemeId: new FormControl(id),
            miktar: new FormControl(this.guncellenecekAlinanOdeme.miktar),
            musteriId: new FormControl(this.guncellenecekAlinanOdeme.musteriId),
            tarih: new FormControl(this.guncellenecekAlinanOdeme.tarih),
          });

          if (this.alinanOdemeForm.valid) {
            let alinanOdemeModel = Object.assign(
              {},
              this.alinanOdemeForm.value
            );

            this.alinanOdemeService
              .deleteAlinanOdeme(alinanOdemeModel)
              .subscribe(
                (response) => {
                  this.getAlinanOdemeler();
                  this.toastrService.success(response.message, 'Başarılı');
                },
                (responseError) => {
                  this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
                }
              );
          } else {
            this.formHataliMi = true;
            this.mesaj = 'Hatalı Form!';
          }
        });
    }
  }
}
