import { Pipe, PipeTransform } from '@angular/core';
import { Urun } from '../models/urun';

@Pipe({
  name: 'urunFilter',
})
export class UrunFilterPipe implements PipeTransform {
  transform(value: Urun[], filterText: string): Urun[] {
    filterText = filterText ? filterText.toLocaleLowerCase() : '';
    return filterText
      ? value.filter(
          (u: Urun) =>
            u.kategoriAdi.toLowerCase().indexOf(filterText) !== -1 ||
            u.markaAdi.toLowerCase().indexOf(filterText) !== -1 ||
            u.aciklama.toLowerCase().indexOf(filterText) !== -1 ||
            u.urunAdi.toLowerCase().indexOf(filterText) !== -1
        )
      : value;
  }
}
