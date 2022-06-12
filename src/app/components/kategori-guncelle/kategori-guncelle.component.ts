import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Kategori } from 'src/app/models/kategori';
import { KategoriService } from 'src/app/services/kategori.service';

@Component({
  selector: 'app-kategori-guncelle',
  templateUrl: './kategori-guncelle.component.html',
  styleUrls: ['./kategori-guncelle.component.css'],
})
export class KategoriGuncelleComponent implements OnInit {
  kategoriler: Kategori[] = [];
  seciliKategoriId: number = 0;
  seciliKategoriAdi: string = '';

  kategoriForm: FormGroup;
  kategoriAdiIcinForm: FormGroup;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  constructor(
    private kategoriService: KategoriService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getKategoriler();

    this.kategoriForm = new FormGroup({
      kategoriId: new FormControl(null),
      kategoriAdi: new FormControl(null, Validators.required),
    });

    this.kategoriAdiIcinForm = new FormGroup({
      kategoriAdiDegisik: new FormControl(null),
    });
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  updateSeciliKategori(e: any) {
    this.seciliKategoriId = Number(e.target.value);

    this.kategoriler.forEach((element) => {
      if (this.seciliKategoriId == element.kategoriId) {
        this.seciliKategoriAdi = element.kategoriAdi;
      }
    });

    this.kategoriForm.patchValue({
      kategoriId: this.seciliKategoriId,
      kategoriAdi: this.seciliKategoriAdi,
    });
  }

  guncelle() {
    if (this.kategoriForm.valid) {
      let kategoriModel = Object.assign({}, this.kategoriForm.value);

      this.kategoriService.updateKategori(kategoriModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.kategoriForm.reset();
            this.kategoriAdiIcinForm.reset();
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
    if (this.kategoriForm.valid) {
      let kategoriModel = Object.assign({}, this.kategoriForm.value);

      this.kategoriService.deleteKategori(kategoriModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.kategoriForm.reset();
            this.kategoriAdiIcinForm.reset();
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
