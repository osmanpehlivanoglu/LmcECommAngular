import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Kategori } from 'src/app/models/kategori';
import { Toptanci } from 'src/app/models/toptanci';
import { KategoriService } from 'src/app/services/kategori.service';
import { MarkaService } from 'src/app/services/marka.service';
import { ToptanciService } from 'src/app/services/toptanci.service';

@Component({
  selector: 'app-marka-ekle-sifirdan',
  templateUrl: './marka-ekle-sifirdan.component.html',
  styleUrls: ['./marka-ekle-sifirdan.component.css'],
})
export class MarkaEkleSifirdanComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;
  markaForm: FormGroup;
  kategoriAdiIcinForm: FormGroup;
  seciliKategoriId: number = 0;
  kategoriler: Kategori[] = [];
  seciliToptanciId: number = 0;
  toptancilar: Toptanci[] = [];

  constructor(
    private markaService: MarkaService,
    private kategoriService: KategoriService,
    private toptanciService: ToptanciService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.markaForm = new FormGroup({
      kategoriId: new FormControl(null, Validators.required),
      toptanciId: new FormControl(null, Validators.required),
      markaAdi: new FormControl(null, Validators.required),
    });

    this.kategoriAdiIcinForm = new FormGroup({
      kategoriAdi: new FormControl(null, Validators.required),
      toptanciAdi: new FormControl(null, Validators.required),
    });

    this.getKategoriler();
    this.getToptancilar();
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  getToptancilar() {
    this.toptanciService.getAll().subscribe((response) => {
      this.toptancilar = response.data;
    });
  }
  updateSeciliToptanci(e: any) {
    this.seciliToptanciId = Number(e.target.value);
    this.markaForm.patchValue({
      toptanciId: this.seciliToptanciId,
    });
  }
  updateSeciliKategori(e: any) {
    this.seciliKategoriId = Number(e.target.value);
    this.markaForm.patchValue({
      kategoriId: this.seciliKategoriId,
    });
  }

  ekle() {
    if (this.markaForm.valid) {
      let markaModel = Object.assign({}, this.markaForm.value);

      this.markaService.addMarka(markaModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.markaForm.get('markaAdi').reset();
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
