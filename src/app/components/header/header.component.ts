import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { GlobalVariable } from 'src/app/models/global';
import { Kampanya } from 'src/app/models/kampanya';
import { Kategori } from 'src/app/models/kategori';
import { KullanıcıOperasyonYetki } from 'src/app/models/kullanici-operasyon-yetki';
import { Marka } from 'src/app/models/marka';
import { Sepet } from 'src/app/models/sepet';
import { Urun } from 'src/app/models/urun';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { KampanyaService } from 'src/app/services/kampanya.service';
import { KategoriService } from 'src/app/services/kategori.service';
import { KullaniciOperasyonYetkiService } from 'src/app/services/kullanici-operasyon-yetki.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { MarkaService } from 'src/app/services/marka.service';
import { SepetService } from 'src/app/services/sepet.service';
import { UrunService } from 'src/app/services/urun.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  resimUrl = GlobalVariable.BASE_URL;

  kategoriler: Kategori[] = [];
  markalar: Marka[] = [];
  kampanyalar: Kampanya[] = [];

  urunler: Urun[] = [];
  yeniUrunler: Urun[] = [];
  eskiUrunler: Urun[] = [];

  filterText: string = '';

  kullanici: User;
  kullaniciYetki: KullanıcıOperasyonYetki[] = [];
  kullaniciYetkiId: number = 0;

  /* sepet: Sepet[] = []; */

  onayBekleyenSepetler: Sepet[] = [];

  satisiTamamlanmisSepetler: Sepet[] = [];
  cokSatanUrunIdler: number[];
  cokSatanUrun: Urun;
  cokSatanUrunler: Urun[] = [];

  sepetteKacCesitUrunVar: number;
  kullaniciGirisYapmisMi: boolean;
  kullaniciAdminMi: boolean;

  sepet: Sepet[] = [];

  constructor(
    private kategoriService: KategoriService,
    private markaService: MarkaService,
    private kullaniciService: KullaniciService,
    private kullaniciYetkiService: KullaniciOperasyonYetkiService,
    private authService: AuthService,
    private zone: NgZone,
    private sepetService: SepetService,
    private urunService: UrunService,
    private kampanyaService: KampanyaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getKategoriler();
    this.getUrunler();
    this.getSatisiTamamlanmisSepetler();
    this.getKampanyalar();

    this.getUserIdByEmail(localStorage.getItem('email'));

    this.authService.getKullaniciGirisYapmisMi().subscribe((response) => {
      this.kullaniciGirisYapmisMi = response;
      console.log(this.kullaniciGirisYapmisMi);
      /* this.getUserIdByEmail(localStorage.getItem('email')); */
    });

    this.authService.getKullaniciAdminMi().subscribe((response) => {
      this.kullaniciAdminMi = response;
    });

    this.sepetService.getSepetteKacCesitUrunVar().subscribe((response) => {
      this.sepetteKacCesitUrunVar = response;
    });
  }

  getSatisiTamamlanmisSepetler() {
    this.sepetService
      .getSepetlerDtoByOnayIdAndDurum(2, true)
      .subscribe((response) => {
        this.satisiTamamlanmisSepetler = response.data;
        let hangiUrun: number[] = [];
        this.satisiTamamlanmisSepetler.forEach((element) => {
          hangiUrun.push(element.urunId);
        });

        var arr = hangiUrun;
        var result = [];
        var count = 0;

        arr.sort();

        for (var i = 0; i < arr.length; i++) {
          count++;
          if (arr[i] != arr[i + 1]) {
            result.push({
              count: count,
              value: arr[i],
            });
            count = 0;
          }
        }

        result.sort(function (a, b) {
          if (a.count < b.count) return 1;
          if (a.count > b.count) return -1;
          return 0;
        });

        this.cokSatanUrunIdler = result.map(function (item) {
          return item.value;
        });

        this.getCokSatanlar(this.cokSatanUrunIdler);
      });
  }

  getCokSatanlar(array: number[]) {
    this.cokSatanUrunler = [];
    array.forEach((element) => {
      this.urunService.getUrunByUrunId(element).subscribe((response) => {
        this.cokSatanUrun = response.data;
        this.cokSatanUrunler.push(this.cokSatanUrun);
      });
    });
  }

  getSepetlerByOnayId(id: number, durum: true) {
    this.sepetService
      .getSepetlerDtoByOnayIdAndDurum(id, durum)
      .subscribe((response) => {
        this.onayBekleyenSepetler = response.data;
      });
  }

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;
      if (this.kullanici) {
        this.getYetkilerByKullanici(this.kullanici.userId);
        this.getSepetByMusteriIdAndDurum(this.kullanici.userId, false);
        this.authService.setKullaniciGirisYapmisMi(true);
      } else {
        if (localStorage.getItem('musteriId')) {
          this.getYetkilerByKullanici(
            Number(localStorage.getItem('musteriId'))
          );

          this.getSepetByMusteriIdAndDurum(
            Number(localStorage.getItem('musteriId')),
            false
          );
        }
      }
    });
  }

  getYetkilerByKullanici(kullaniciId: number) {
    this.kullaniciYetkiService
      .getOperasyonYetkilerByKullaniciId(kullaniciId)
      .subscribe((response) => {
        this.kullaniciYetki = response.data;
        if (this.kullaniciYetki.length > 0) {
          this.kullaniciYetkiId = this.kullaniciYetki[0].operationClaimId;
        }
      });
  }

  getSepetByMusteriIdAndDurum(musteriId: number, durum: boolean) {
    this.sepetService
      .getSepetlerByMusteriIdAndDurum(musteriId, false)
      .subscribe((response) => {
        this.sepet = response.data;
        this.sepetService.setSepetteKacCesitUrunVar(this.sepet.length);

        if (this.kullaniciYetkiId === 1) {
          this.authService.setKullaniciAdminMi(true);
        }
      });
  }

  logout() {
    this.authService.logout();
    localStorage.clear();
    this.sepetService.setSepetteKacCesitUrunVar(0);
    this.authService.setKullaniciGirisYapmisMi(false);
    this.authService.setKullaniciAdminMi(false);
    this.router.navigateByUrl('/');
    location.reload();
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  getUrunler() {
    this.urunService.getAll().subscribe((response) => {
      this.urunler = response.data;
    });
  }

  getKampanyalar() {
    this.kampanyaService.getAll().subscribe((response) => {
      this.kampanyalar = response.data;
    });
  }

  getMarkalar() {
    this.markaService.getAll().subscribe((response) => {
      this.markalar = response.data;
    });
  }

  getMarkalarByKategoriId(kategoriId: number) {
    this.markaService
      .getMarkalarByKategoriId(kategoriId)
      .subscribe((response) => {
        this.markalar = response.data;
      });
  }
}
