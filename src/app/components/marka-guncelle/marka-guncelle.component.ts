import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Kategori } from 'src/app/models/kategori';
import { Marka } from 'src/app/models/marka';
import { KategoriService } from 'src/app/services/kategori.service';
import { MarkaService } from 'src/app/services/marka.service';

@Component({
  selector: 'app-marka-guncelle',
  templateUrl: './marka-guncelle.component.html',
  styleUrls: ['./marka-guncelle.component.css'],
})
export class MarkaGuncelleComponent implements OnInit {
  kategoriler: Kategori[] = [];
  seciliKategoriId: number = 0;

  markalar: Marka[] = [];
  seciliMarkaId: number = 0;
  seciliMarkaAdi: string;

  markaForm: FormGroup;
  markaAdiveYeniKategoriIcinForm: FormGroup;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  constructor(
    private kategoriService: KategoriService,
    private markaService: MarkaService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getKategoriler();

    this.markaForm = new FormGroup({
      kategoriId: new FormControl(null, Validators.required),
      markaId: new FormControl(null, Validators.required),
      markaAdi: new FormControl(null, Validators.required),
    });

    this.markaAdiveYeniKategoriIcinForm = new FormGroup({
      kategoriAdiDegisik: new FormControl(null, Validators.required),
      markaAdiDegisik: new FormControl(null, Validators.required),
      yeniKategoriDegisik: new FormControl(null, Validators.required),
    });
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  getMarkalarByKategoriId(kategoriId: number) {
    this.markaService
      .getMarkalarByKategoriId(kategoriId)
      .subscribe((response) => {
        this.markalar = response.data;
      });
  }

  updateSeciliKategori(e: any) {
    this.seciliMarkaId = 0;
    this.seciliKategoriId = Number(e.target.value);
    this.markaForm.patchValue({
      kategoriId: this.seciliKategoriId,
      markaId: '',
      markaAdi: '',
    });
    this.markaAdiveYeniKategoriIcinForm.patchValue({
      yeniKategoriDegisik: this.seciliKategoriId,
      markaAdiDegisik: '',
    });
  }

  updateSeciliKategoriYeni(e: any) {
    this.seciliKategoriId = Number(e.target.value);
    console.log(this.seciliKategoriId);
    this.markaForm.patchValue({
      kategoriId: this.seciliKategoriId,
    });
  }

  updateSeciliMarka(e: any) {
    this.seciliMarkaId = Number(e.target.value);

    this.markalar.forEach((element) => {
      if (this.seciliMarkaId == element.markaId) {
        this.seciliMarkaAdi = element.markaAdi;
      }
    });

    this.markaForm.patchValue({
      markaId: this.seciliMarkaId,
      markaAdi: this.seciliMarkaAdi,
    });
  }

  guncelle() {
    if (this.markaForm.valid) {
      let markaModel = Object.assign({}, this.markaForm.value);

      this.markaService.updateMarka(markaModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.markaForm.reset();
            this.markaAdiveYeniKategoriIcinForm.reset();
            this.getKategoriler();
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

  sil() {
    if (this.markaForm.valid) {
      let markaModel = Object.assign({}, this.markaForm.value);

      this.markaService.deleteMarka(markaModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.markaForm.reset();
            this.getKategoriler();
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
