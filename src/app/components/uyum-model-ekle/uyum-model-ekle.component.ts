import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UyumModelService } from 'src/app/services/uyum-model.service';

@Component({
  selector: 'app-uyum-model-ekle',
  templateUrl: './uyum-model-ekle.component.html',
  styleUrls: ['./uyum-model-ekle.component.css'],
})
export class UyumModelEkleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;
  uyumModelForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    private uyumModelService: UyumModelService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['eklenenUyumMarkaId']) {
        this.setUyumModelForm(params['eklenenUyumMarkaId']);
      }
    });
  }

  setUyumModelForm(uyumMarkaId: number) {
    this.uyumModelForm = new FormGroup({
      uyumMarkaId: new FormControl(Number(uyumMarkaId), Validators.required),
      uyumModelAdi: new FormControl(null, Validators.required),
    });
  }

  ekle() {
    if (this.uyumModelForm.valid) {
      let uyumModelModel = Object.assign({}, this.uyumModelForm.value);

      this.uyumModelService.addUyumModel(uyumModelModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;
          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.uyumModelForm.get('markaAdi').reset();
          }, 2000);
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
}
