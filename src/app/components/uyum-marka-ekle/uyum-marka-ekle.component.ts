import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UyumMarkaService } from 'src/app/services/uyum-marka.service';
import { UyumModelService } from 'src/app/services/uyum-model.service';

@Component({
  selector: 'app-uyum-marka-ekle',
  templateUrl: './uyum-marka-ekle.component.html',
  styleUrls: ['./uyum-marka-ekle.component.css'],
})
export class UyumMarkaEkleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  uyumMarkaForm: FormGroup;
  uyumModelForm: FormGroup;

  eklenenUyumMarkaId: number;

  constructor(
    private uyumMarkaService: UyumMarkaService,
    private uyumModelService: UyumModelService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.uyumMarkaForm = new FormGroup({
      uyumMarkaAdi: new FormControl(null, Validators.required),
    });

    this.uyumModelForm = new FormGroup({
      uyumMarkaId: new FormControl(null),
      uyumModelAdi: new FormControl(null),
    });
  }

  ekle() {
    if (this.uyumMarkaForm.valid) {
      let kategoriModel = Object.assign({}, this.uyumMarkaForm.value);

      this.uyumMarkaService.addUyumMarka(kategoriModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          this.setEklenenUyumMarkaId();
        },
        (responseError) => {
          this.toastrService.error('Bir şeyler ters gitti', 'Hata!');
        }
      );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }

  setEklenenUyumMarkaId() {
    this.uyumMarkaService.getAll().subscribe((response) => {
      this.eklenenUyumMarkaId = Number(
        response.data[response.data.length - 1].uyumMarkaId
      );

      this.uyumMarkaForm.patchValue({
        uyumMarkaId: this.eklenenUyumMarkaId,
      });

      this.uyumMarkaForm.patchValue({
        uyumModelAdi: 'Tüm Markalar',
      });

      this.tumMarkalarEkle();
    });
  }

  tumMarkalarEkle() {
    let uyumMarkaModel = Object.assign({}, this.uyumModelForm.value);
    this.uyumModelService
      .addUyumModel(uyumMarkaModel)
      .subscribe((response) => {});
  }
}
