export interface Kampanya {
  kampanyaId: number;
  urunId: number;
  yuzde: number;
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
