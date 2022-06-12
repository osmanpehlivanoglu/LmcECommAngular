import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ResimEkleComponent } from './components/resim-ekle/resim-ekle.component';
import { UrunDetayComponent } from './components/urun-detay/urun-detay.component';
import { UrunEkleComponent } from './components/urun-ekle/urun-ekle.component';

import { UrunComponent } from './components/urun/urun.component';
import { UrunGuncelleComponent } from './components/urun-guncelle/urun-guncelle.component';
import { KategoriEkleComponent } from './components/kategori-ekle/kategori-ekle.component';
import { MarkaEkleComponent } from './components/marka-ekle/marka-ekle.component';
import { UyumMarkaEkleComponent } from './components/uyum-marka-ekle/uyum-marka-ekle.component';
import { UyumModelEkleComponent } from './components/uyum-model-ekle/uyum-model-ekle.component';
import { KategoriGuncelleComponent } from './components/kategori-guncelle/kategori-guncelle.component';
import { MarkaGuncelleComponent } from './components/marka-guncelle/marka-guncelle.component';
import { UyumMarkaGuncelleComponent } from './components/uyum-marka-guncelle/uyum-marka-guncelle.component';
import { UyumModelGuncelleComponent } from './components/uyum-model-guncelle/uyum-model-guncelle.component';
import { MarkaEkleSifirdanComponent } from './components/marka-ekle-sifirdan/marka-ekle-sifirdan.component';
import { UyumModelEkleSifirdanComponent } from './components/uyum-model-ekle-sifirdan/uyum-model-ekle-sifirdan.component';
import { KayitOlComponent } from './components/kayit-ol/kayit-ol.component';
import { GirisYapComponent } from './components/giris-yap/giris-yap.component';
import { OperasyonYetkiEkleComponent } from './components/operasyon-yetki-ekle/operasyon-yetki-ekle.component';
import { OperasyonYetkiGuncelleComponent } from './components/operasyon-yetki-guncelle/operasyon-yetki-guncelle.component';
import { KullaniciOperasyonYetkiEkleComponent } from './components/kullanici-operasyon-yetki-ekle/kullanici-operasyon-yetki-ekle.component';
import { ToptanciEkleComponent } from './components/toptanci-ekle/toptanci-ekle.component';
import { ToptanciGuncelleComponent } from './components/toptanci-guncelle/toptanci-guncelle.component';
import { LoginGuard } from './guards/login.guard';

import { KullaniciOperasyonYetkiGuncelleComponent } from './components/kullanici-operasyon-yetki-guncelle/kullanici-operasyon-yetki-guncelle.component';
import { SepetComponent } from './components/sepet/sepet.component';
import { SatisOnayBekleyenlerComponent } from './components/satis-onay-bekleyenler/satis-onay-bekleyenler.component';
import { SatisOnayDuzeltmeComponent } from './components/satis-onay-duzeltme/satis-onay-duzeltme.component';
import { SatisIptalDuzeltmeComponent } from './components/satis-iptal-duzeltme/satis-iptal-duzeltme.component';
import { OdemeComponent } from './components/odeme/odeme.component';
import { OdemeGuncelleComponent } from './components/odeme-guncelle/odeme-guncelle.component';
import { SatisIadeComponent } from './components/satis-iade/satis-iade.component';
import { SatinAlimIadeComponent } from './components/satin-alim-iade/satin-alim-iade.component';
import { SatisIadeGuncelleComponent } from './components/satis-iade-guncelle/satis-iade-guncelle.component';
import { SatinAlimIadeGuncelleComponent } from './components/satin-alim-iade-guncelle/satin-alim-iade-guncelle.component';
import { ProfilComponent } from './components/profil/profil.component';
import { ProfilDuzenleComponent } from './components/profil-duzenle/profil-duzenle.component';
import { SiparisGecmisiComponent } from './components/siparis-gecmisi/siparis-gecmisi.component';
import { BegenilerComponent } from './components/begeniler/begeniler.component';
import { CokSatanlarComponent } from './components/cok-satanlar/cok-satanlar.component';
import { YeniUrunlerComponent } from './components/yeni-urunler/yeni-urunler.component';
import { KampanyalarComponent } from './components/kampanyalar/kampanyalar.component';
import { ResimEkleHomeComponent } from './components/resim-ekle-home/resim-ekle-home.component';
import { ResimEkleHomeRightComponent } from './components/resim-ekle-home-right/resim-ekle-home-right.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeComponent },
  { path: 'urunler/k/tk/m/tm', component: UrunComponent },
  {
    path: 'urunler/k/:kategoriId/m/tm',
    component: UrunComponent,
  },
  {
    path: 'urunler/k/:kategoriId/m/:markaId',
    component: UrunComponent,
  },
  {
    path: 'urunler/:urunId',
    component: UrunDetayComponent,
  },
  {
    path: 'urun-ekle',
    component: UrunEkleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'urun-ekle/r/:eklenenUrunId',
    component: ResimEkleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'urun-guncelle/:urunId',
    component: UrunGuncelleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'kategori-ekle',
    component: KategoriEkleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'kategori-ekle/m/:eklenenKategoriId',
    component: MarkaEkleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'uyum-marka-ekle',
    component: UyumMarkaEkleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'uyum-marka-ekle/m/:eklenenUyumMarkaId',
    component: UyumModelEkleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'kategori-guncelle',
    component: KategoriGuncelleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'marka-guncelle',
    component: MarkaGuncelleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'uyum-marka-guncelle',
    component: UyumMarkaGuncelleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'uyum-model-guncelle',
    component: UyumModelGuncelleComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'marka-ekle',
    component: MarkaEkleSifirdanComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'uyum-model-ekle',
    component: UyumModelEkleSifirdanComponent,
    canActivate: [LoginGuard],
  },

  {
    path: 'kayit-ol',
    component: KayitOlComponent,
  },

  {
    path: 'giris-yap',
    component: GirisYapComponent,
  },
  /* {
    path: 'operasyon-yetki-ekle',
    component: OperasyonYetkiEkleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'operasyon-yetki-guncelle',
    component: OperasyonYetkiGuncelleComponent,
    canActivate: [LoginGuard],
  }, */
  {
    path: 'kullanici-operasyon-yetki-ekle',
    component: KullaniciOperasyonYetkiEkleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'kullanici-operasyon-yetki-guncelle',
    component: KullaniciOperasyonYetkiGuncelleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'toptanci-ekle',
    component: ToptanciEkleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'toptanci-guncelle',
    component: ToptanciGuncelleComponent,
    canActivate: [LoginGuard],
  },
  {
    path: 'sepet',
    component: SepetComponent,
  },
  {
    path: 'satis-onay-bekleyenler',
    component: SatisOnayBekleyenlerComponent,
  },
  {
    path: 'satis-onay-duzeltme',
    component: SatisOnayDuzeltmeComponent,
  },
  {
    path: 'satis-iptal-duzeltme',
    component: SatisIptalDuzeltmeComponent,
  },
  {
    path: 'odeme',
    component: OdemeComponent,
  },
  {
    path: 'odeme-duzeltme',
    component: OdemeGuncelleComponent,
  },
  {
    path: 'satis-iade',
    component: SatisIadeComponent,
  },
  {
    path: 'satin-alim-iade',
    component: SatinAlimIadeComponent,
  },
  {
    path: 'satis-iade-guncelle',
    component: SatisIadeGuncelleComponent,
  },
  {
    path: 'satin-alim-iade-guncelle',
    component: SatinAlimIadeGuncelleComponent,
  },
  {
    path: 'profil',
    component: ProfilComponent,
  },

  {
    path: 'profil/profil-duzenle',
    component: ProfilDuzenleComponent,
  },

  {
    path: 'profil/siparis-gecmisi',
    component: SiparisGecmisiComponent,
  },

  {
    path: 'profil/begeniler',
    component: BegenilerComponent,
  },

  {
    path: 'cok-satanlar',
    component: CokSatanlarComponent,
  },

  {
    path: 'yeni-urunler',
    component: YeniUrunlerComponent,
  },

  {
    path: 'kampanyalar',
    component: KampanyalarComponent,
  },
  {
    path: 'resim-ekle-ana',
    component: ResimEkleHomeComponent,
  },
  {
    path: 'resim-ekle-sag',
    component: ResimEkleHomeRightComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
