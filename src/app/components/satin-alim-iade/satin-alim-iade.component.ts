import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Sepet } from 'src/app/models/sepet';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SatinAlimIadeService } from 'src/app/services/satin-alim-iade.service';
import { SatisIadeService } from 'src/app/services/satis-iade.service';
import { SepetService } from 'src/app/services/sepet.service';

@Component({
  selector: 'app-satin-alim-iade',
  templateUrl: './satin-alim-iade.component.html',
  styleUrls: ['./satin-alim-iade.component.css'],
})
export class SatinAlimIadeComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  sepetler: Sepet[] = [];

  seciliSepetIndex: number;

  guncelAdet: number;

  satinAlimIadeForm: FormGroup;
  guncellenecekSatinAlimId: number;

  seciliInputElement: any;

  constructor(
    private sepetService: SepetService,
    private satinAlimIadeService: SatinAlimIadeService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.getSepetlerByOnayId(2, true);
  }

  getSepetlerByOnayId(id: number, durum: true) {
    this.sepetService
      .getSepetlerDtoByOnayIdAndDurum(id, durum)
      .subscribe((response) => {
        this.sepetler = response.data;
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

  hangiIndextekiSepet(id: number) {
    this.seciliSepetIndex = id;
  }

  onayla_satin_alim_iade(id: number) {
    if (this.guncelAdet) {
      this.satinAlimIadeForm = new FormGroup({
        satinAlimId: new FormControl(id),
        adet: new FormControl(this.guncelAdet),
        tarih: new FormControl(new Date()),
      });
      let satinAlimIadeModel = Object.assign({}, this.satinAlimIadeForm.value);

      this.satinAlimIadeService.addSatinAlimIade(satinAlimIadeModel).subscribe(
        (response) => {
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
