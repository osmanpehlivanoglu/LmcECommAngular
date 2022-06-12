export interface Begeni {
  begeniId: number;
  kullaniciId: number;
  urunId: number;
  stokKodu: string;
  urunAdi: string;
  aciklama: string;
  alisFiyati: number;
  toptanciFiyati: number;
  bayiFiyati: number;
  perakendeFiyati: number;
  stokMiktari: number;
  urunResmi: string[];
  tarih: Date;
  kategoriAdi: string;
  markaAdi: string;
}
