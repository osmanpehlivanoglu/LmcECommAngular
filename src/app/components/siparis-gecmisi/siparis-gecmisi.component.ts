import { Component, OnInit } from '@angular/core';
import { Sepet } from 'src/app/models/sepet';
import { Urun } from 'src/app/models/urun';
import { User } from 'src/app/models/user';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SepetService } from 'src/app/services/sepet.service';
import { UrunService } from 'src/app/services/urun.service';

@Component({
  selector: 'app-siparis-gecmisi',
  templateUrl: './siparis-gecmisi.component.html',
  styleUrls: ['./siparis-gecmisi.component.css'],
})
export class SiparisGecmisiComponent implements OnInit {
  sepetOnayli: Sepet[] = [];
  urunlerDetayOnayli: Urun[] = [];
  urunDetayOnayli: Urun;
  sepetFiyatiOnayli: number = 0;

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
      this.getOnayliSepetler(this.kullanici.userId, true, 2);
    });
  }

  getOnayliSepetler(musteriId: number, durum: boolean, onayId: number) {
    this.sepetFiyatiOnayli = 0;
    this.sepetService
      .getSepetlerDtoByMusteriIdAndDurumAndOnayId(musteriId, durum, onayId)
      .subscribe((response) => {
        this.sepetOnayli = response.data;

        this.sepetOnayli.forEach((element) => {
          this.sepetFiyatiOnayli += element.adet * element.fiyat;
        });

        this.getUrunlerDetayOnayli();
      });
  }

  getUrunlerDetayOnayli() {
    this.urunlerDetayOnayli = [];
    this.sepetOnayli.forEach((element) => {
      this.urunService.getUrunByUrunId(element.urunId).subscribe((response) => {
        this.urunDetayOnayli = response.data;
        this.urunlerDetayOnayli.push(this.urunDetayOnayli);
      });
    });
  }
}
