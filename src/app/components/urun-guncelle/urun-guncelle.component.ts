import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Kategori } from '../../models/kategori';
import { Marka } from '../../models/marka';
import { Urun } from '../../models/urun';
import { UyumMarka } from '../../models/uyumMarka';
import { UyumModel } from '../../models/uyumModel';
import { KategoriService } from '../../services/kategori.service';
import { MarkaService } from '../../services/marka.service';
import { UrunService } from '../../services/urun.service';
import { UyumMarkaService } from '../../services/uyum-marka.service';
import { UyumModelService } from '../../services/uyum-model.service';

@Component({
  selector: 'app-urun-guncelle',
  templateUrl: './urun-guncelle.component.html',
  styleUrls: ['./urun-guncelle.component.css'],
})
export class UrunGuncelleComponent implements OnInit {
  urun: Urun;
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

  uyumluMarkalar: string[] = [];
  uyumluModeller: string[] = [];

  constructor(
    private kategoriService: KategoriService,
    private markaService: MarkaService,
    private uyumMarkaService: UyumMarkaService,
    private uyumModelService: UyumModelService,
    private urunService: UrunService,
    private activatedRoute: ActivatedRoute,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.urunForm = new FormGroup({
      urunId: new FormControl(null, Validators.required),
      urunAdi: new FormControl(null, Validators.required),
      stokKodu: new FormControl(null, Validators.required),
      stokMiktari: new FormControl(null, Validators.required),
      alisFiyati: new FormControl(null, Validators.required),
      toptanciFiyati: new FormControl(null, Validators.required),
      bayiFiyati: new FormControl(null, Validators.required),
      perakendeFiyati: new FormControl(null, Validators.required),
      kategoriId: new FormControl(null, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      markaId: new FormControl(null, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      uyumMarkaId: new FormControl(null, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      uyumModelId: new FormControl(null, [
        Validators.required,
        this.kategoriVeyaMarkaSecilmemis.bind(this),
      ]),
      aciklama: new FormControl(null, Validators.required),
    });

    this.urunForm2 = new FormGroup({
      uyumMarkaId: new FormControl(null),
      uyumModelId: new FormControl(null),
    });

    this.activatedRoute.params.subscribe((params) => {
      this.getUrunByUrunId(params['urunId']);
    });

    this.getKategoriler();
    this.getUyumMarkalar();
  }

  guncelle() {
    if (this.urunForm.valid) {
      let urunModel = Object.assign({}, this.urunForm.value);

      this.urunService.updateUrun(urunModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
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
    if (this.urunForm.valid) {
      let urunModel = Object.assign({}, this.urunForm.value);

      this.urunService.deleteUrun(urunModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
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

  getUrunByUrunId(urunId: number) {
    this.urunService.getUrunByUrunId(urunId).subscribe((response) => {
      this.urun = response.data;

      this.urunForm = new FormGroup({
        urunId: new FormControl(this.urun.urunId, Validators.required),
        urunAdi: new FormControl(this.urun.urunAdi, Validators.required),
        stokKodu: new FormControl(this.urun.stokKodu, Validators.required),
        stokMiktari: new FormControl(
          this.urun.stokMiktari,
          Validators.required
        ),
        alisFiyati: new FormControl(this.urun.alisFiyati, Validators.required),
        toptanciFiyati: new FormControl(
          this.urun.toptanciFiyati,
          Validators.required
        ),
        bayiFiyati: new FormControl(this.urun.bayiFiyati, Validators.required),
        perakendeFiyati: new FormControl(
          this.urun.perakendeFiyati,
          Validators.required
        ),
        kategoriId: new FormControl(this.urun.kategoriId, [
          Validators.required,
          this.kategoriVeyaMarkaSecilmemis.bind(this),
        ]),
        markaId: new FormControl(this.urun.markaId, [
          Validators.required,
          this.kategoriVeyaMarkaSecilmemis.bind(this),
        ]),
        uyumMarkaId: new FormControl(this.urun.uyumMarkaId, [
          Validators.required,
          this.kategoriVeyaMarkaSecilmemis.bind(this),
        ]),
        uyumModelId: new FormControl(this.urun.uyumModelId, [
          Validators.required,
          this.kategoriVeyaMarkaSecilmemis.bind(this),
        ]),
        aciklama: new FormControl(this.urun.aciklama, Validators.required),
      });

      this.urunForm2 = new FormGroup({
        uyumMarkaId: new FormControl(null),
        uyumModelId: new FormControl(null),
      });

      this.getMarkalarByKategoriId(this.urun.kategoriId);
      this.getUyumMarkaAdlariByUyumMarkaId();
      this.getUyumModelAdlariByUyumModelId();
    });
  }

  getUyumMarkalar() {
    this.uyumMarkaService.getAll().subscribe((response) => {
      this.uyumMarkalar = response.data;
    });
  }

  getUyumMarkaAdlariByUyumMarkaId() {
    this.uyumluMarkalar = [];
    this.urun.uyumMarkaId
      .split(',')
      .map(Number)
      .forEach((element) => {
        this.uyumMarkaService
          .getUyumMarkaByUyumMarkaId(element)
          .subscribe((response) => {
            this.uyumluMarkalar.push(response.data.uyumMarkaAdi);
          });
      });
  }

  getUyumModelAdlariByUyumModelId() {
    this.uyumluModeller = [];
    this.urun.uyumModelId
      .split(',')
      .map(Number)
      .forEach((element) => {
        this.uyumModelService
          .getUyumModelByUyumModelId(element)
          .subscribe((response) => {
            this.uyumluModeller.push(response.data.uyumModelAdi);
          });
      });
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  getMarkalarByKategoriId(kategoriId: number) {
    if (kategoriId > 0) {
      this.markaService
        .getMarkalarByKategoriId(kategoriId)
        .subscribe((response) => {
          this.markalar = response.data;
        });
    }
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
