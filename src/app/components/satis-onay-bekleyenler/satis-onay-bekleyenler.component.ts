import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Sepet } from 'src/app/models/sepet';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SepetService } from 'src/app/services/sepet.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-satis-onay-bekleyenler',
  templateUrl: './satis-onay-bekleyenler.component.html',
  styleUrls: ['./satis-onay-bekleyenler.component.css'],
})
export class SatisOnayBekleyenlerComponent implements OnInit {
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
    this.getSepetlerByOnayId(1, true);
  }

  hangiIndextekiSepet(id: number) {
    console.log(id);
    this.seciliSepetIndex = id;
    console.log(this.sepetler[this.seciliSepetIndex].musteriId);
  }

  getSepetlerByOnayId(id: number, durum: true) {
    this.sepetService
      .getSepetlerDtoByOnayIdAndDurum(id, durum)
      .subscribe((response) => {
        this.sepetler = response.data;
      });
  }

  guncel_adet(e: any) {
    this.guncelAdet = Number(e.target.value);
  }

  onayla(id: number) {
    this.sepetService.getSepetBySepetId(id).subscribe((response) => {
      this.guncellenecekSepet = response.data;

      this.sepetForm = new FormGroup({
        sepetId: new FormControl(id),
        onayId: new FormControl(2),
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
          this.getSepetlerByOnayId(1, true);
          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    });
  }

  iptal(id: number) {
    this.sepetService.getSepetBySepetId(id).subscribe((response) => {
      this.guncellenecekSepet = response.data;

      this.sepetForm = new FormGroup({
        sepetId: new FormControl(id),
        onayId: new FormControl(3),
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
          this.getSepetlerByOnayId(1, true);
          this.toastrService.success(response.message, 'Başarılı!');
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    });
  }

  guncelle(id: number) {
    if (this.guncelAdet) {
      this.sepetService.getSepetBySepetId(id).subscribe((response) => {
        this.guncellenecekSepet = response.data;

        this.sepetForm = new FormGroup({
          sepetId: new FormControl(id),
          onayId: new FormControl(1),
          adet: new FormControl(this.guncelAdet),
          musteriId: new FormControl(this.guncellenecekSepet.musteriId),
          urunId: new FormControl(this.guncellenecekSepet.urunId),
          fiyat: new FormControl(this.guncellenecekSepet.fiyat),
          tarih: new FormControl(this.guncellenecekSepet.tarih),
          durum: new FormControl(true),
        });

        let sepetModel = Object.assign({}, this.sepetForm.value);

        this.sepetService.updateSepet(sepetModel).subscribe(
          (response) => {
            this.getSepetlerByOnayId(1, true);
            this.toastrService.success(response.message, 'Başarılı!');
          },
          (responseError) => {
            this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
          }
        );
      });
    } else {
      this.toastrService.error(
        'Güncellenecek adedi değiştirmediniz...',
        'Hata!'
      );
    }
  }
}
