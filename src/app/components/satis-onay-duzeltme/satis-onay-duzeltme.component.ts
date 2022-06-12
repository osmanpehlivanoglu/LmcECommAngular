import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Sepet } from 'src/app/models/sepet';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SepetService } from 'src/app/services/sepet.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-satis-onay-duzeltme',
  templateUrl: './satis-onay-duzeltme.component.html',
  styleUrls: ['./satis-onay-duzeltme.component.css'],
})
export class SatisOnayDuzeltmeComponent implements OnInit {
  sepetler: Sepet[] = [];

  seciliSepetIndex: number;

  guncelAdet: number;
  guncellenecekSepet: Sepet;
  sepetForm: FormGroup;

  constructor(
    private toastrService: ToastrService,
    private sepetService: SepetService
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
        this.sepetler = response.data;
      });
  }

  guncelle(id: number, onayId: number) {
    this.sepetService.getSepetBySepetId(id).subscribe((response) => {
      this.guncellenecekSepet = response.data;

      this.sepetForm = new FormGroup({
        sepetId: new FormControl(id),
        onayId: new FormControl(onayId),
        adet: new FormControl(this.guncellenecekSepet.adet),
        musteriId: new FormControl(this.guncellenecekSepet.musteriId),
        urunId: new FormControl(this.guncellenecekSepet.urunId),
        fiyat: new FormControl(this.guncellenecekSepet.fiyat),
        tarih: new FormControl(this.guncellenecekSepet.tarih),
        durum: new FormControl(true),
      });

      let sepetModel = Object.assign({}, this.sepetForm.value);

      this.sepetService.updateSepet(sepetModel).subscribe(
        (response) => {
          this.getSepetlerByOnayId(2, true);
          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    });
  }
}
