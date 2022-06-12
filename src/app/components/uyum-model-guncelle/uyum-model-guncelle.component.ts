import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UyumMarka } from 'src/app/models/uyumMarka';
import { UyumModel } from 'src/app/models/uyumModel';
import { UyumMarkaService } from 'src/app/services/uyum-marka.service';
import { UyumModelService } from 'src/app/services/uyum-model.service';

@Component({
  selector: 'app-uyum-model-guncelle',
  templateUrl: './uyum-model-guncelle.component.html',
  styleUrls: ['./uyum-model-guncelle.component.css'],
})
export class UyumModelGuncelleComponent implements OnInit {
  uyumMarkalar: UyumMarka[] = [];
  seciliUyumMarkaId: number = 0;

  uyumModeller: UyumModel[] = [];
  seciliUyumModelId: number = 0;
  seciliUyumModelAdi: string;

  uyumModelForm: FormGroup;
  uyumModelAdiveYeniUyumMarkaIcinForm: FormGroup;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  constructor(
    private uyumMarkaService: UyumMarkaService,
    private uyumModelService: UyumModelService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUyumMarkalar();

    this.uyumModelForm = new FormGroup({
      uyumMarkaId: new FormControl(null, Validators.required),
      uyumModelId: new FormControl(null, Validators.required),
      uyumModelAdi: new FormControl(null, Validators.required),
    });

    this.uyumModelAdiveYeniUyumMarkaIcinForm = new FormGroup({
      uyumMarkaAdiDegisik: new FormControl(null, Validators.required),
      uyumModelAdiDegisik: new FormControl(null, Validators.required),
      yeniUyumMarkaDegisik: new FormControl(null, Validators.required),
    });
  }

  getUyumMarkalar() {
    this.uyumMarkaService.getAll().subscribe((response) => {
      this.uyumMarkalar = response.data;
    });
  }

  getUyumModellerByUyumMarkaId(uyumMarkaId: number) {
    this.uyumModelService
      .getUyumModellerByUyumMarkaId(uyumMarkaId)
      .subscribe((response) => {
        this.uyumModeller = response.data;
      });
  }

  updateSeciliUyumMarka(e: any) {
    this.seciliUyumModelId = 0;
    this.seciliUyumMarkaId = Number(e.target.value);
    this.uyumModelForm.patchValue({
      uyumMarkaId: this.seciliUyumMarkaId,
      uyumModelId: '',
      uyumModelAdi: '',
    });
    this.uyumModelAdiveYeniUyumMarkaIcinForm.patchValue({
      yeniUyumMarkaDegisik: this.seciliUyumMarkaId,
      uyumModelAdiDegisik: '',
    });
  }

  updateSeciliUyumMarkaYeni(e: any) {
    this.seciliUyumMarkaId = Number(e.target.value);

    this.uyumModelForm.patchValue({
      uyumMarkaId: this.seciliUyumMarkaId,
    });
  }

  updateSeciliUyumModel(e: any) {
    this.seciliUyumModelId = Number(e.target.value);

    this.uyumModeller.forEach((element) => {
      if (this.seciliUyumModelId == element.uyumModelId) {
        this.seciliUyumModelAdi = element.uyumModelAdi;
      }
    });

    this.uyumModelForm.patchValue({
      uyumModelId: this.seciliUyumModelId,
      uyumModelAdi: this.seciliUyumModelAdi,
    });
  }

  guncelle() {
    if (this.uyumModelForm.valid) {
      let uyumModelModel = Object.assign({}, this.uyumModelForm.value);

      this.uyumModelService.updateUyumModel(uyumModelModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.uyumModelForm.reset();
            this.uyumModelAdiveYeniUyumMarkaIcinForm.reset();
            this.getUyumMarkalar();
          }, 2000);
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }

  sil() {
    if (this.uyumModelForm.valid) {
      let uyumModelModel = Object.assign({}, this.uyumModelForm.value);

      this.uyumModelService.deleteUyumModel(uyumModelModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.uyumModelForm.reset();
            this.getUyumMarkalar();
          }, 2000);
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }
}
