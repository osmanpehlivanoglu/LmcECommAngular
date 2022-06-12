import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { Kategori } from 'src/app/models/kategori';
import { Marka } from 'src/app/models/marka';
import { Urun } from 'src/app/models/urun';
import { UyumMarka } from 'src/app/models/uyumMarka';
import { UyumModel } from 'src/app/models/uyumModel';
import { KategoriService } from 'src/app/services/kategori.service';
import { MarkaService } from 'src/app/services/marka.service';
import { UrunService } from 'src/app/services/urun.service';
import { UyumMarkaService } from 'src/app/services/uyum-marka.service';
import { UyumModelService } from 'src/app/services/uyum-model.service';

@Component({
  selector: 'app-urun-ekle',
  templateUrl: './urun-ekle.component.html',
  styleUrls: ['./urun-ekle.component.css'],
})
export class UrunEkleComponent implements OnInit {
  kategoriler: Kategori[] = [];
  markalar: Marka[] = [];

  eklenenUrunId: number;

  urunForm: FormGroup;
  urunForm2: FormGroup;
  urunForm3: FormGroup;

  seciliKategoriId: number = 0;
  seciliMarkaId: number = 0;

  uyumMarkalar: UyumMarka[] = [];
  uyumModeller: UyumModel[] = [];

  seciliUyumMarkaId: string = '0';
  seciliUyumModelId: string = '0';

  uyumModelIdler: number[] = [];
  uyumMarkaIdler: number[] = [];
  uyumModelAdlar: string[] = [];

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  yasakKategoriVeMarkaIdler = [0, '0'];

  constructor(
    private kategoriService: KategoriService,
    private markaService: MarkaService,
    private uyumMarkaService: UyumMarkaService,
    private uyumModelService: UyumModelService,
    private urunService: UrunService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.urunForm = new FormGroup({
      urunAdi: new FormControl(null, Validators.required),
      stokKodu: new FormControl(null, Validators.required),
      stokMiktari: new FormControl(null, Validators.required),
      alisFiyati: new FormControl(null, Validators.required),
      toptanciFiyati: new FormControl(null, Validators.required),
      bayiFiyati: new FormControl(null, Validators.required),
      perakendeFiyati: new FormControl(null, Validators.required),
      kategoriId: new FormControl(this.seciliKategoriId, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      markaId: new FormControl(this.seciliMarkaId, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      uyumMarkaId: new FormControl(this.seciliUyumMarkaId, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      uyumModelId: new FormControl(this.seciliUyumModelId, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      aciklama: new FormControl(null, Validators.required),
    });

    this.urunForm2 = new FormGroup({
      uyumMarkaId: new FormControl(null),
      uyumModelId: new FormControl(null),
    });

    this.urunForm3 = new FormGroup({
      kategoriAdi: new FormControl(null),
      markaAdi: new FormControl(null),
    });

    this.getKategoriler();
    this.getUyumMarkalar();
  }

  setEklenenUrunId() {
    this.urunService.getAll().subscribe((response) => {
      this.eklenenUrunId = Number(
        response.data[response.data.length - 1].urunId
      );
    });
  }

  ekle() {
    if (this.urunForm.valid) {
      let urunModel = Object.assign({}, this.urunForm.value);

      this.urunService.addUrun(urunModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          this.setEklenenUrunId();
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

  getUyumMarkalar() {
    this.uyumMarkaService.getAll().subscribe((response) => {
      this.uyumMarkalar = response.data;
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

  getUyumluModeller() {
    if (!this.seciliUyumMarkaId.includes('0')) {
      this.uyumModelIdler = [];
      this.uyumMarkaIdler = [];
      this.uyumModelAdlar = [];

      this.seciliUyumMarkaId
        .toString()
        .split(',')
        .forEach((element) => {
          this.uyumModelService
            .getUyumModellerByUyumMarkaId(Number(element))
            .subscribe((response) => {
              this.uyumModelIdler.push(response.data[0].uyumModelId);
              this.uyumMarkaIdler.push(response.data[0].uyumMarkaId);
              this.uyumModelAdlar.push(response.data[0].uyumModelAdi);
              this.uyumModeller = [];
              for (let index = 0; index < this.uyumModelIdler.length; index++) {
                this.uyumModeller.push({
                  uyumModelId: this.uyumModelIdler[index],
                  uyumMarkaId: this.uyumMarkaIdler[index],
                  uyumModelAdi: this.uyumModelAdlar[index],
                });
              }
            });
        });
    }
  }

  updateSeciliKategori(e: any) {
    this.seciliKategoriId = Number(e.target.value);
    this.urunForm.patchValue({
      kategoriId: this.seciliKategoriId,
    });
  }

  updateSeciliMarka(e: any) {
    this.seciliMarkaId = Number(e.target.value);
    this.urunForm.patchValue({
      markaId: this.seciliMarkaId,
    });
  }

  updateSeciliUyumMarka() {
    this.seciliUyumMarkaId = this.urunForm2.get('uyumMarkaId').value;

    this.urunForm.patchValue({
      uyumMarkaId: this.seciliUyumMarkaId.toString(),
    });

    this.seciliUyumModelId = '0';
    this.urunForm.patchValue({
      uyumModelId: this.seciliUyumModelId,
    });
  }

  updateSeciliUyumModel() {
    this.seciliUyumModelId = this.urunForm2.get('uyumModelId').value;

    this.urunForm.patchValue({
      uyumModelId: this.seciliUyumModelId.toString(),
    });
  }

  kategoriVeyaMarkaSecilmemis(control: FormControl): { [s: string]: boolean } {
    if (this.yasakKategoriVeMarkaIdler.indexOf(control.value) !== -1) {
      return { secilmemis: true };
    }
    return null;
  }
}
