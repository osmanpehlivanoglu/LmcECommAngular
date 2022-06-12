import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { KategoriService } from 'src/app/services/kategori.service';
import { MarkaService } from 'src/app/services/marka.service';

@Component({
  selector: 'app-kategori-ekle',
  templateUrl: './kategori-ekle.component.html',
  styleUrls: ['./kategori-ekle.component.css'],
})
export class KategoriEkleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  kategoriForm: FormGroup;
  markaForm: FormGroup;

  eklenenKategoriId: number;

  constructor(
    private kategoriService: KategoriService,
    private markaService: MarkaService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.kategoriForm = new FormGroup({
      kategoriAdi: new FormControl(null, Validators.required),
    });

    this.markaForm = new FormGroup({
      kategoriId: new FormControl(null),
      markaAdi: new FormControl(null),
    });
  }

  ekle() {
    if (this.kategoriForm.valid) {
      let kategoriModel = Object.assign({}, this.kategoriForm.value);

      this.kategoriService.addKategori(kategoriModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          this.setEklenenKategoriId();
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

  setEklenenKategoriId() {
    this.kategoriService.getAll().subscribe((response) => {
      this.eklenenKategoriId = Number(
        response.data[response.data.length - 1].kategoriId
      );

      this.markaForm.patchValue({
        kategoriId: this.eklenenKategoriId,
        markaAdi: 'Tüm Markalar',
      });
    });
  }
}
