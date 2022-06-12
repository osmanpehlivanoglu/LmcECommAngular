import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperasyonYetki } from 'src/app/models/operasyon-yetki';
import { OperasyonYetkiService } from 'src/app/services/operasyon-yetki.service';

@Component({
  selector: 'app-operasyon-yetki-guncelle',
  templateUrl: './operasyon-yetki-guncelle.component.html',
  styleUrls: ['./operasyon-yetki-guncelle.component.css'],
})
export class OperasyonYetkiGuncelleComponent implements OnInit {
  operasyonYetkiler: OperasyonYetki[] = [];
  seciliOperasyonYetkiId: number = 0;
  seciliOperasyonYetkiAdi: string = '';

  operasyonYetkiForm: FormGroup;
  operasyonYetkiAdiIcinForm: FormGroup;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  constructor(private operasyonYetkiService: OperasyonYetkiService) {}

  ngOnInit(): void {
    this.getOperasyonYetkiler();

    this.operasyonYetkiForm = new FormGroup({
      operationClaimId: new FormControl(null),
      name: new FormControl(null, Validators.required),
    });

    this.operasyonYetkiAdiIcinForm = new FormGroup({
      operasyonYetkiAdiDegisik: new FormControl(null),
    });
  }

  getOperasyonYetkiler() {
    this.operasyonYetkiService.getAll().subscribe((response) => {
      this.operasyonYetkiler = response.data;
    });
  }

  updateSeciliOperasyonYetki(e: any) {
    this.seciliOperasyonYetkiId = Number(e.target.value);

    this.operasyonYetkiler.forEach((element) => {
      if (this.seciliOperasyonYetkiId == element.operationClaimId) {
        this.seciliOperasyonYetkiAdi = element.name;
      }
    });

    this.operasyonYetkiForm.patchValue({
      operationClaimId: this.seciliOperasyonYetkiId,
      name: this.seciliOperasyonYetkiAdi,
    });
  }

  guncelle() {
    if (this.operasyonYetkiForm.valid) {
      let operasyonYetkiModel = Object.assign(
        {},
        this.operasyonYetkiForm.value
      );

      this.operasyonYetkiService
        .updateOperasyonYetki(operasyonYetkiModel)
        .subscribe(
          (response) => {
            this.eklendiMi = true;
            this.mesaj = response.message;
            setTimeout(() => {
              this.eklendiMi = false;
              this.mesaj = '';
              this.operasyonYetkiForm.reset();
              this.operasyonYetkiAdiIcinForm.reset();
              this.getOperasyonYetkiler();
            }, 2000);
          },
          (responseError) => {
            this.eklenmediMi = true;
            this.mesaj = responseError.error.Message;

            setTimeout(() => {
              this.eklenmediMi = false;
              this.mesaj = '';
            }, 2000);
          }
        );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }

  sil() {
    if (this.operasyonYetkiForm.valid) {
      let operasyonYetkiModel = Object.assign(
        {},
        this.operasyonYetkiForm.value
      );

      this.operasyonYetkiService
        .deleteOperasyonYetki(operasyonYetkiModel)
        .subscribe(
          (response) => {
            this.eklendiMi = true;
            this.mesaj = response.message;
            setTimeout(() => {
              this.eklendiMi = false;
              this.mesaj = '';
              this.operasyonYetkiForm.reset();
              this.operasyonYetkiAdiIcinForm.reset();
              this.getOperasyonYetkiler();
            }, 2000);
          },
          (responseError) => {
            if (responseError.error.Errors.length > 0) {
              for (let i = 0; i < responseError.error.Errors.length; i++) {
                this.eklenmediMi = true;
                this.mesaj = responseError.error.Errors[i].ErrorMessage;
              }
            }
          }
        );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }
}
