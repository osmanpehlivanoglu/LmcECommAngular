import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalVariable } from 'src/app/models/global';
import { Resim } from 'src/app/models/resim';
import { ResimService } from 'src/app/services/resim.service';

class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-resim-ekle',
  templateUrl: './resim-ekle.component.html',
  styleUrls: ['./resim-ekle.component.css'],
})
export class ResimEkleComponent implements OnInit {
  constructor(
    private activatedRoute: ActivatedRoute,
    private resimService: ResimService
  ) {}

  resimFormUrun: FormGroup;
  urunId: number;

  eklendiMi: boolean = false;
  mesaj: string;

  resimListesi: FileList[];

  resimUrl = GlobalVariable.BASE_URL;
  urunResimleri: Resim[];

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['eklenenUrunId']) {
        this.setResimFormUrun(params['eklenenUrunId']);
        this.getResimlerByUrunId(params['eklenenUrunId']);
      }
    });
  }

  setResimFormUrun(urunId: number) {
    this.urunId = urunId;
    this.resimFormUrun = new FormGroup({
      urunId: new FormControl(this.urunId),
      image: new FormControl(null),
      fileSource: new FormControl(null),
    });
  }

  onFileChange(e: any) {
    this.resimListesi = e.target.files;
  }

  ekle() {
    for (let index = 0; index < this.resimListesi.length; index++) {
      this.resimFormUrun.patchValue({
        fileSource: this.resimListesi[index],
      });

      let simdikiTarih = new Date();

      this.resimService
        .uploadImage(
          this.resimFormUrun.value.fileSource,
          this.urunId,
          simdikiTarih
        )
        .subscribe((response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          this.getResimlerByUrunId(this.urunId);
        });
    }
  }

  getResimlerByUrunId(urunId: number) {
    this.resimService.getResimlerByUrunId(urunId).subscribe((r) => {
      this.urunResimleri = r.data;
    });
  }

  deleteResim(resimId: number) {
    this.resimService.deleteImage(resimId).subscribe((r) => {
      this.eklendiMi = true;
      this.mesaj = r.message;
      this.getResimlerByUrunId(this.urunId);
    });
  }
}
