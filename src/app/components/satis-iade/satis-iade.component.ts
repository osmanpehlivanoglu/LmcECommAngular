import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Sepet } from 'src/app/models/sepet';
import { SatisIadeService } from 'src/app/services/satis-iade.service';
import { SepetService } from 'src/app/services/sepet.service';

@Component({
  selector: 'app-satis-iade',
  templateUrl: './satis-iade.component.html',
  styleUrls: ['./satis-iade.component.css'],
})
export class SatisIadeComponent implements OnInit {
  sepetler: Sepet[] = [];

  seciliSepetIndex: number;

  guncelAdet: number;

  satisIadeForm: FormGroup;
  satinAlimIadeForm: FormGroup;

  guncellenecekSatisId: number;
  guncellenecekSatinAlimId: number;

  seciliInputElement: any;

  constructor(
    private sepetService: SepetService,
    private satisIadeService: SatisIadeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSepetlerByOnayId(2, true);
  }

  hangiIndextekiSepet(id: number) {
    this.seciliSepetIndex = id;
  }

  getSepetlerByOnayId(id: number, durum: true) {
    this.sepetService
      .getSepetlerDtoByOnayIdAndDurum(id, durum)
      .subscribe((response) => {
        this.sepetler = response.data.reverse();
      });
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
    }
  }

  onayla_satis_iade(id: number) {
    if (this.guncelAdet) {
      this.satisIadeForm = new FormGroup({
        satisId: new FormControl(id),
        adet: new FormControl(this.guncelAdet),
        tarih: new FormControl(new Date()),
      });

      let satisIadeModel = Object.assign({}, this.satisIadeForm.value);

      this.satisIadeService.addSatisIade(satisIadeModel).subscribe(
        (response) => {
          this.getSepetlerByOnayId(2, true);
          this.toastrService.success(response.message, 'Başarılı!');
          this.guncelAdet = 0;
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
          this.guncelAdet = 0;
        }
      );
    } else {
      this.toastrService.error('Adedi yeniden girmeniz gerekiyor.', 'Hata!');
    }
  }
}
