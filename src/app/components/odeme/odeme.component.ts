import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Toptanci } from 'src/app/models/toptanci';
import { User } from 'src/app/models/user';
import { AlinanOdemeService } from 'src/app/services/alinan-odeme.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { ToptanciService } from 'src/app/services/toptanci.service';
import { YapilanOdemeService } from 'src/app/services/yapilan-odeme.service';

@Component({
  selector: 'app-odeme',
  templateUrl: './odeme.component.html',
  styleUrls: ['./odeme.component.css'],
})
export class OdemeComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  musteriler: User[] = [];
  toptancilar: Toptanci[] = [];

  seciliOdemeTuru: number = 0;
  seciliMusteriId: number = 0;
  seciliToptanciId: number = 0;

  odemeMusteriToptanciAdiIcinForm: FormGroup;
  odemeYapForm: FormGroup;
  odemeAlForm: FormGroup;

  constructor(
    private kullaniciService: KullaniciService,
    private toptanciService: ToptanciService,
    private alinanOdemeService: AlinanOdemeService,
    private yapilanOdemeService: YapilanOdemeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.odemeMusteriToptanciAdiIcinForm = new FormGroup({
      odemeAdi: new FormControl(null, Validators.required),
      toptanciAdi: new FormControl(null, Validators.required),
      musteriAdi: new FormControl(null, Validators.required),
      odemeId: new FormControl(null, Validators.required),
    });

    this.odemeYapForm = new FormGroup({
      toptanciId: new FormControl(null, Validators.required),
      miktar: new FormControl(null, Validators.required),
      tarih: new FormControl(new Date(), Validators.required),
    });

    this.odemeAlForm = new FormGroup({
      musteriId: new FormControl(null, Validators.required),
      miktar: new FormControl(null, Validators.required),
      tarih: new FormControl(new Date(), Validators.required),
    });
  }

  getMusteriler() {
    this.kullaniciService.getAll().subscribe((response) => {
      this.musteriler = response.data;
      this.odemeAlForm = new FormGroup({
        musteriId: new FormControl(null, Validators.required),
        miktar: new FormControl(null, Validators.required),
        tarih: new FormControl(new Date(), Validators.required),
      });
      this.toptancilar = [];
    });
  }

  getToptancilar() {
    this.toptanciService.getAll().subscribe((response) => {
      this.toptancilar = response.data;
      this.musteriler = [];
      this.odemeYapForm = new FormGroup({
        toptanciId: new FormControl(null, Validators.required),
        miktar: new FormControl(null, Validators.required),
        tarih: new FormControl(new Date(), Validators.required),
      });
    });
  }

  updateSeciliOdeme(e: any) {
    this.seciliOdemeTuru = Number(e.target.value);
    this.odemeAlForm.patchValue({
      odemeId: this.seciliOdemeTuru,
    });

    if (this.seciliOdemeTuru == 1) {
      this.getToptancilar();
    } else if (this.seciliOdemeTuru == 2) {
      this.getMusteriler();
    }
  }

  updateSeciliToptanci(e: any) {
    this.seciliToptanciId = Number(e.target.value);
    this.odemeYapForm.patchValue({
      toptanciId: this.seciliToptanciId,
    });
  }

  updateSeciliMusteri(e: any) {
    this.seciliMusteriId = Number(e.target.value);
    this.odemeAlForm.patchValue({
      musteriId: this.seciliMusteriId,
    });
  }

  ekle() {
    if (this.toptancilar.length > 0) {
      if (this.odemeYapForm.valid) {
        let odemeYapModel = Object.assign({}, this.odemeYapForm.value);

        this.yapilanOdemeService.addYapilanOdeme(odemeYapModel).subscribe(
          (response) => {
            this.eklendiMi = true;
            this.mesaj = response.message;
            setTimeout(() => {
              this.eklendiMi = false;
              this.mesaj = '';
              this.seciliToptanciId = 0;
              this.seciliMusteriId = 0;
              this.seciliOdemeTuru = 0;
              this.musteriler = [];
              this.toptancilar = [];
              this.odemeYapForm.reset();
              this.odemeAlForm.reset();
              this.odemeMusteriToptanciAdiIcinForm.reset();
            }, 2000);
          },
          (responseError) => {
            this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
          }
        );
      } else {
        this.formHataliMi = true;
        this.mesaj = 'Hatalı Form!';
      }
    } else if (this.musteriler.length > 0) {
      if (this.odemeAlForm.valid) {
        let odemeAlModel = Object.assign({}, this.odemeAlForm.value);

        this.alinanOdemeService.addAlinanOdeme(odemeAlModel).subscribe(
          (response) => {
            this.eklendiMi = true;
            this.mesaj = response.message;
            setTimeout(() => {
              this.eklendiMi = false;
              this.mesaj = '';
              this.seciliToptanciId = 0;
              this.seciliMusteriId = 0;
              this.seciliOdemeTuru = 0;
              this.musteriler = [];
              this.toptancilar = [];
              this.odemeYapForm.reset();
              this.odemeAlForm.reset();
              this.odemeMusteriToptanciAdiIcinForm.reset();
            }, 2000);
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
  }
}
