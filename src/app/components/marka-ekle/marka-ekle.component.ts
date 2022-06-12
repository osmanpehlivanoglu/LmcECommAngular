import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Toptanci } from 'src/app/models/toptanci';
import { MarkaService } from 'src/app/services/marka.service';
import { ToptanciService } from 'src/app/services/toptanci.service';

@Component({
  selector: 'app-marka-ekle',
  templateUrl: './marka-ekle.component.html',
  styleUrls: ['./marka-ekle.component.css'],
})
export class MarkaEkleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;
  markaForm: FormGroup;
  toptanciAdiIcinForm: FormGroup;
  seciliToptanciId: number = 0;
  toptancilar: Toptanci[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private markaService: MarkaService,
    private toptanciService: ToptanciService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['eklenenKategoriId']) {
        this.setMarkaForm(params['eklenenKategoriId']);
      }
    });

    this.toptanciAdiIcinForm = new FormGroup({
      toptanciAdi: new FormControl(null, Validators.required),
    });

    this.getToptancilar();
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

  setMarkaForm(kategoriId: number) {
    this.markaForm = new FormGroup({
      kategoriId: new FormControl(Number(kategoriId), Validators.required),
      toptanciId: new FormControl(null, Validators.required),
      markaAdi: new FormControl(null, Validators.required),
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
