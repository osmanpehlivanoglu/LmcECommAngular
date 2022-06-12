import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UyumMarka } from 'src/app/models/uyumMarka';
import { UyumMarkaService } from 'src/app/services/uyum-marka.service';
import { UyumModelService } from 'src/app/services/uyum-model.service';

@Component({
  selector: 'app-uyum-model-ekle-sifirdan',
  templateUrl: './uyum-model-ekle-sifirdan.component.html',
  styleUrls: ['./uyum-model-ekle-sifirdan.component.css'],
})
export class UyumModelEkleSifirdanComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;
  uyumModelForm: FormGroup;
  uyumMarkaAdiIcinForm: FormGroup;
  seciliUyumMarkaId: number = 0;
  uyumMarkalar: UyumMarka[] = [];

  constructor(
    private uyumModleService: UyumModelService,
    private uyumMarkaService: UyumMarkaService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUyumMarkalar();
    this.uyumModelForm = new FormGroup({
      uyumMarkaId: new FormControl(null, Validators.required),
      uyumModelAdi: new FormControl(null, Validators.required),
    });

    this.uyumMarkaAdiIcinForm = new FormGroup({
      uyumMarkaAdi: new FormControl(null, Validators.required),
    });
  }

  getUyumMarkalar() {
    this.uyumMarkaService.getAll().subscribe((response) => {
      this.uyumMarkalar = response.data;
    });
  }

  updateSeciliUyumMarka(e: any) {
    this.seciliUyumMarkaId = Number(e.target.value);
    this.uyumModelForm.patchValue({
      uyumMarkaId: this.seciliUyumMarkaId,
    });
  }

  ekle() {
    if (this.uyumModelForm.valid) {
      let uyumModelModel = Object.assign({}, this.uyumModelForm.value);

      this.uyumModleService.addUyumModel(uyumModelModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.uyumModelForm.get('markaAdi').reset();
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
