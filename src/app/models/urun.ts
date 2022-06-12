export interface Urun {
  urunId: number;
  kategoriId: number;
  kategoriAdi: string;
  markaId: number;
  markaAdi: string;
  uyumMarkaId: string;
  uyumModelId: string;
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
  saticiId: number;
}
