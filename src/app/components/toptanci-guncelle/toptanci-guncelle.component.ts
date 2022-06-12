import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Toptanci } from 'src/app/models/toptanci';
import { ToptanciService } from 'src/app/services/toptanci.service';

@Component({
  selector: 'app-toptanci-guncelle',
  templateUrl: './toptanci-guncelle.component.html',
  styleUrls: ['./toptanci-guncelle.component.css'],
})
export class ToptanciGuncelleComponent implements OnInit {
  toptancilar: Toptanci[] = [];
  toptanci: Toptanci;
  seciliToptanciId: number = 0;

  toptanciForm: FormGroup;
  toptanciAdiIcinForm: FormGroup;

  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  constructor(
    private toptanciService: ToptanciService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getToptancilar();

    this.toptanciForm = new FormGroup({
      toptanciId: new FormControl(null, Validators.required),
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      firma: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      telefon: new FormControl(null, Validators.required),
      adres: new FormControl(null, Validators.required),
    });

    this.toptanciAdiIcinForm = new FormGroup({
      toptanciAdiDegisik: new FormControl(null),
    });
  }

  getToptancilar() {
    this.toptanciService.getAll().subscribe((response) => {
      this.toptancilar = response.data;
    });
  }

  getToptanciByToptanciId(toptanciId: number) {
    this.toptanciService
      .getToptanciByToptanciId(toptanciId)
      .subscribe((response) => {
        this.toptanci = response.data;

        this.toptanciForm = new FormGroup({
          toptanciId: new FormControl(
            this.toptanci.toptanciId,
            Validators.required
          ),
          firstName: new FormControl(
            this.toptanci.firstName,
            Validators.required
          ),
          lastName: new FormControl(
            this.toptanci.lastName,
            Validators.required
          ),
          firma: new FormControl(this.toptanci.firma, Validators.required),
          email: new FormControl(this.toptanci.email, Validators.required),
          telefon: new FormControl(this.toptanci.email, Validators.required),
          adres: new FormControl(this.toptanci.adres, Validators.required),
        });
      });
  }
  updateSeciliToptanci(e: any) {
    this.seciliToptanciId = Number(e.target.value);
    this.toptanciForm.patchValue({
      toptanciId: this.seciliToptanciId,
    });
    this.getToptanciByToptanciId(this.seciliToptanciId);
  }

  guncelle() {
    if (this.toptanciForm.valid) {
      let toptanciModel = Object.assign({}, this.toptanciForm.value);

      this.toptanciService.updateToptanci(toptanciModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.toptanciForm.reset();
            this.toptanciAdiIcinForm.reset();
            this.getToptancilar();
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
    if (this.toptanciForm.valid) {
      let markaModel = Object.assign({}, this.toptanciForm.value);

      this.toptanciService.deleteToptanci(markaModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.toptanciForm.reset();
            this.toptanciAdiIcinForm.reset();
            this.getToptancilar();
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
