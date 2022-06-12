import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SatinAlimIade } from 'src/app/models/satin-alim-iade';
import { SatinAlimIadeService } from 'src/app/services/satin-alim-iade.service';
import { SatinAlimIadeComponent } from '../satin-alim-iade/satin-alim-iade.component';

@Component({
  selector: 'app-satin-alim-iade-guncelle',
  templateUrl: './satin-alim-iade-guncelle.component.html',
  styleUrls: ['./satin-alim-iade-guncelle.component.css'],
})
export class SatinAlimIadeGuncelleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  satinAlimIadeler: SatinAlimIade[] = [];
  guncelAdet: number;
  guncellenecekSatinAlimId: number;
  satinAlimIadeForm: FormGroup;

  seciliInputElement: any;

  constructor(
    private satinAlimIadeService: SatinAlimIadeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSatinAlimIadeler();
  }

  guncel_adet_oncesi(e: any) {
    this.guncelAdet = Number(e.target.value);
  }

  guncel_adet(e: any) {
    if (e.target.value <= this.guncelAdet) {
      this.guncelAdet = Number(e.target.value);
    } else {
      this.seciliInputElement = e.target as HTMLInputElement;
      this.seciliInputElement.value = this.guncelAdet;
      this.toastrService.error(
        'Adet yükseltmek için önce iadeyi geri almanız gerek',
        'Hata'
      );
    }
  }

  getSatinAlimIadeler() {
    this.satinAlimIadeService.getAll().subscribe((response) => {
      this.satinAlimIadeler = response.data;
    });
  }

  guncelle(id: number) {
    if (this.guncelAdet) {
      this.satinAlimIadeService
        .getSatinAlimIadeBySatinAlimIadeId(id)
        .subscribe((response) => {
          this.guncellenecekSatinAlimId = response.data.satinAlimIadeId;

          this.satinAlimIadeForm = new FormGroup({
            satisIadeId: new FormControl(id),
            satisId: new FormControl(this.guncellenecekSatinAlimId),
            adet: new FormControl(this.guncelAdet),
            tarih: new FormControl(new Date()),
          });

          let satinAlimIadeModel = Object.assign(
            {},
            this.satinAlimIadeForm.value
          );

          this.satinAlimIadeService
            .updateSatinAlimIade(satinAlimIadeModel)
            .subscribe(
              (response) => {
                this.toastrService.success(response.message, 'Başarılı!');
                this.guncelAdet = 0;
              },
              (responseError) => {
                this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
                this.guncelAdet = 0;
              }
            );
        });
    } else {
      this.toastrService.error('Adedi yeniden girmeniz gerekiyor.', 'Hata!');
    }
  }

  iptal(id: number) {
    if (this.guncelAdet) {
      this.satinAlimIadeService
        .getSatinAlimIadeBySatinAlimIadeId(id)
        .subscribe((response) => {
          this.guncellenecekSatinAlimId = response.data.satinAlimId;

          this.satinAlimIadeForm = new FormGroup({
            satisIadeId: new FormControl(id),
            satisId: new FormControl(this.guncellenecekSatinAlimId),
            adet: new FormControl(this.guncelAdet),
            tarih: new FormControl(new Date()),
          });

          let satinAlimIadeModel = Object.assign(
            {},
            this.satinAlimIadeForm.value
          );

          this.satinAlimIadeService
            .deleteSatinAlimIade(satinAlimIadeModel)
            .subscribe(
              (response) => {
                this.toastrService.success(response.message, 'Başarılı!');
                this.guncelAdet = 0;
              },
              (responseError) => {
                this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
                this.guncelAdet = 0;
              }
            );
        });
    } else {
      this.toastrService.error('Adedi yeniden girmeniz gerekiyor.', 'Hata!');
    }
  }
}
