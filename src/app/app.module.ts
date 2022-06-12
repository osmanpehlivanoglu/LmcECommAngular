import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import tr from '@angular/common/locales/tr';
import {
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData,
} from '@angular/common';

import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { YeniUrunComponent } from './components/yeni-urun/yeni-urun.component';
import { CokSatanComponent } from './components/cok-satan/cok-satan.component';
import { KampanyaComponent } from './components/kampanya/kampanya.component';
import { SidebarLeftComponent } from './components/sidebar-left/sidebar-left.component';
import { UrunComponent } from './components/urun/urun.component';
import { UrunFilterPipe } from './pipes/urun-filter.pipe';
import { UrunDetayComponent } from './components/urun-detay/urun-detay.component';
import { ResimEkleComponent } from './components/resim-ekle/resim-ekle.component';
import { UrunEkleComponent } from './components/urun-ekle/urun-ekle.component';
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
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { KullaniciOperasyonYetkiGuncelleComponent } from './components/kullanici-operasyon-yetki-guncelle/kullanici-operasyon-yetki-guncelle.component';
import { SepetComponent } from './components/sepet/sepet.component';
import { SatisOnayBekleyenlerComponent } from './components/satis-onay-bekleyenler/satis-onay-bekleyenler.component';
import { SatisOnayDuzeltmeComponent } from './components/satis-onay-duzeltme/satis-onay-duzeltme.component';
import { SatisIptalDuzeltmeComponent } from './components/satis-iptal-duzeltme/satis-iptal-duzeltme.component';
import { OdemeComponent } from './components/odeme/odeme.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OdemeGuncelleComponent } from './components/odeme-guncelle/odeme-guncelle.component';
import { SatisIadeComponent } from './components/satis-iade/satis-iade.component';
import { SatinAlimIadeComponent } from './components/satin-alim-iade/satin-alim-iade.component';
import { SatisIadeGuncelleComponent } from './components/satis-iade-guncelle/satis-iade-guncelle.component';
import { SatinAlimIadeGuncelleComponent } from './components/satin-alim-iade-guncelle/satin-alim-iade-guncelle.component';
import { ProfilComponent } from './components/profil/profil.component';
import { SiparisGecmisiComponent } from './components/siparis-gecmisi/siparis-gecmisi.component';
import { ProfilDuzenleComponent } from './components/profil-duzenle/profil-duzenle.component';
import { BegenilerComponent } from './components/begeniler/begeniler.component';
import { CokSatanlarComponent } from './components/cok-satanlar/cok-satanlar.component';
import { YeniUrunlerComponent } from './components/yeni-urunler/yeni-urunler.component';
import { KampanyalarComponent } from './components/kampanyalar/kampanyalar.component';
import { ResimEkleHomeComponent } from './components/resim-ekle-home/resim-ekle-home.component';
import { ResimEkleHomeRightComponent } from './components/resim-ekle-home-right/resim-ekle-home-right.component';

registerLocaleData(tr);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    YeniUrunComponent,
    CokSatanComponent,
    KampanyaComponent,
    SidebarLeftComponent,
    UrunComponent,
    UrunFilterPipe,
    UrunDetayComponent,
    ResimEkleComponent,
    UrunEkleComponent,
    UrunGuncelleComponent,
    KategoriEkleComponent,
    MarkaEkleComponent,
    UyumMarkaEkleComponent,
    UyumModelEkleComponent,
    KategoriGuncelleComponent,
    MarkaGuncelleComponent,
    UyumMarkaGuncelleComponent,
    UyumModelGuncelleComponent,
    MarkaEkleSifirdanComponent,
    UyumModelEkleSifirdanComponent,
    KayitOlComponent,
    GirisYapComponent,
    OperasyonYetkiEkleComponent,
    OperasyonYetkiGuncelleComponent,
    KullaniciOperasyonYetkiEkleComponent,
    ToptanciEkleComponent,
    ToptanciGuncelleComponent,
    KullaniciOperasyonYetkiGuncelleComponent,
    SepetComponent,
    SatisOnayBekleyenlerComponent,
    SatisOnayDuzeltmeComponent,
    SatisIptalDuzeltmeComponent,
    OdemeComponent,
    OdemeGuncelleComponent,
    SatisIadeComponent,
    SatinAlimIadeComponent,
    SatisIadeGuncelleComponent,
    SatinAlimIadeGuncelleComponent,
    ProfilComponent,
    SiparisGecmisiComponent,
    ProfilDuzenleComponent,
    BegenilerComponent,
    CokSatanlarComponent,
    YeniUrunlerComponent,
    KampanyalarComponent,
    ResimEkleHomeComponent,
    ResimEkleHomeRightComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
    CarouselModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'tr-TR' },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
