import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Sepet } from 'src/app/models/sepet';
import { Urun } from 'src/app/models/urun';
import { User } from 'src/app/models/user';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SepetService } from 'src/app/services/sepet.service';
import { UrunService } from 'src/app/services/urun.service';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css'],
})
export class ProfilComponent implements OnInit {
  sepetOnayBekleyen: Sepet[] = [];
  urunlerDetayOnayBekleyen: Urun[] = [];
  urunDetayOnayBekleyen: Urun;
  sepetFiyatiOnayBekleyen: number = 0;

  kullanici: User;

  constructor(
    private sepetService: SepetService,
    private urunService: UrunService,
    private kullaniciService: KullaniciService
  ) {}

  ngOnInit(): void {
    this.getUserIdByEmail(localStorage.getItem('email'));
  }

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;
      this.getOnayBekleyenSepetler(this.kullanici.userId, true, 1);
    });
  }

  getOnayBekleyenSepetler(musteriId: number, durum: boolean, onayId: number) {
    this.sepetFiyatiOnayBekleyen = 0;
    this.sepetService
      .getSepetlerDtoByMusteriIdAndDurumAndOnayId(musteriId, durum, onayId)
      .subscribe((response) => {
        this.sepetOnayBekleyen = response.data;

        this.sepetOnayBekleyen.forEach((element) => {
          this.sepetFiyatiOnayBekleyen += element.adet * element.fiyat;
        });

        this.getUrunlerDetayOnayBekleyen();
      });
  }

  getUrunlerDetayOnayBekleyen() {
    this.urunlerDetayOnayBekleyen = [];
    this.sepetOnayBekleyen.forEach((element) => {
      this.urunService.getUrunByUrunId(element.urunId).subscribe((response) => {
        this.urunDetayOnayBekleyen = response.data;
        this.urunlerDetayOnayBekleyen.push(this.urunDetayOnayBekleyen);
      });
    });
  }
}
