import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SatisIade } from 'src/app/models/satis-iade';
import { SatisIadeService } from 'src/app/services/satis-iade.service';

@Component({
  selector: 'app-satis-iade-guncelle',
  templateUrl: './satis-iade-guncelle.component.html',
  styleUrls: ['./satis-iade-guncelle.component.css'],
})
export class SatisIadeGuncelleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  satisIadeler: SatisIade[] = [];
  guncelAdet: number;
  guncellenecekSatisId: number;
  satisIadeForm: FormGroup;

  seciliSepetIndex: number;

  seciliInputElement: any;

  constructor(
    private satisIadeService: SatisIadeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSatisIadeler();
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

  getSatisIadeler() {
    this.satisIadeService.getAll().subscribe((response) => {
      this.satisIadeler = response.data.reverse();
    });
  }

  hangiIndextekiSepet(id: number) {
    this.seciliSepetIndex = id;
  }

  guncelle(id: number) {
    if (this.guncelAdet) {
      this.satisIadeService
        .getSatisIadeBySatisIadeId(id)
        .subscribe((response) => {
          this.guncellenecekSatisId = response.data.satisId;

          this.satisIadeForm = new FormGroup({
            satisIadeId: new FormControl(id),
            satisId: new FormControl(this.guncellenecekSatisId),
            adet: new FormControl(this.guncelAdet),
            tarih: new FormControl(new Date()),
          });

          let satisIadeModel = Object.assign({}, this.satisIadeForm.value);

          this.satisIadeService.updateSatisIade(satisIadeModel).subscribe(
            (response) => {
              this.getSatisIadeler();
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
      this.satisIadeService
        .getSatisIadeBySatisIadeId(id)
        .subscribe((response) => {
          this.guncellenecekSatisId = response.data.satisId;

          this.satisIadeForm = new FormGroup({
            satisIadeId: new FormControl(id),
            satisId: new FormControl(this.guncellenecekSatisId),
            adet: new FormControl(this.guncelAdet),
            tarih: new FormControl(new Date()),
          });

          let satisIadeModel = Object.assign({}, this.satisIadeForm.value);

          this.satisIadeService.deleteSatisIade(satisIadeModel).subscribe(
            (response) => {
              this.getSatisIadeler();
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
