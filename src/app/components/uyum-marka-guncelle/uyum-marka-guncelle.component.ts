import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UyumMarka } from 'src/app/models/uyumMarka';
import { UyumMarkaService } from 'src/app/services/uyum-marka.service';

@Component({
  selector: 'app-uyum-marka-guncelle',
  templateUrl: './uyum-marka-guncelle.component.html',
  styleUrls: ['./uyum-marka-guncelle.component.css'],
})
export class UyumMarkaGuncelleComponent implements OnInit {
  uyumMarkalar: UyumMarka[] = [];
  seciliUyumMarkaId: number = 0;
  seciliUyumMarkaAdi: string = '';

  uyumMarkaForm: FormGroup;
  uyumMarkaAdiIcinForm: FormGroup;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  constructor(
    private uyumMarkaService: UyumMarkaService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getUyumMarkalar();

    this.uyumMarkaForm = new FormGroup({
      uyumMarkaId: new FormControl(null),
      uyumMarkaAdi: new FormControl(null, Validators.required),
    });

    this.uyumMarkaAdiIcinForm = new FormGroup({
      uyumMarkaAdiDegisik: new FormControl(null),
    });
  }

  getUyumMarkalar() {
    this.uyumMarkaService.getAll().subscribe((response) => {
      this.uyumMarkalar = response.data;
    });
  }

  updateSeciliUyumMarka(e: any) {
    this.seciliUyumMarkaId = Number(e.target.value);

    this.uyumMarkalar.forEach((element) => {
      if (this.seciliUyumMarkaId == element.uyumMarkaId) {
        this.seciliUyumMarkaAdi = element.uyumMarkaAdi;
      }
    });

    this.uyumMarkaForm.patchValue({
      uyumMarkaId: this.seciliUyumMarkaId,
      uyumMarkaAdi: this.seciliUyumMarkaAdi,
    });
  }

  guncelle() {
    if (this.uyumMarkaForm.valid) {
      let uyumMarkaModel = Object.assign({}, this.uyumMarkaForm.value);

      this.uyumMarkaService.updateUyumMarka(uyumMarkaModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.uyumMarkaForm.reset();
            this.uyumMarkaAdiIcinForm.reset();
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
    if (this.uyumMarkaForm.valid) {
      let uyumMarkaModel = Object.assign({}, this.uyumMarkaForm.value);

      this.uyumMarkaService.deleteUyumMarka(uyumMarkaModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.uyumMarkaForm.reset();
            this.uyumMarkaAdiIcinForm.reset();
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
