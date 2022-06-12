import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OperasyonYetkiService } from 'src/app/services/operasyon-yetki.service';

@Component({
  selector: 'app-operasyon-yetki-ekle',
  templateUrl: './operasyon-yetki-ekle.component.html',
  styleUrls: ['./operasyon-yetki-ekle.component.css'],
})
export class OperasyonYetkiEkleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;

  operasyonYetkiForm: FormGroup;

  constructor(private operasyonYetkiService: OperasyonYetkiService) {}

  ngOnInit(): void {
    this.operasyonYetkiForm = new FormGroup({
      name: new FormControl(null, Validators.required),
    });
  }

  ekle() {
    if (this.operasyonYetkiForm.valid) {
      let operasyonYetkiModel = Object.assign(
        {},
        this.operasyonYetkiForm.value
      );

      this.operasyonYetkiService
        .addOperasyonYetki(operasyonYetkiModel)
        .subscribe(
          (response) => {
            this.eklendiMi = true;
            this.mesaj = response.message;
            setTimeout(() => {
              this.eklendiMi = false;
              this.mesaj = '';
              this.operasyonYetkiForm.reset();
            }, 2000);
          },
          (responseError) => {
            this.eklenmediMi = true;
            this.mesaj = responseError.error.Message;

            setTimeout(() => {
              this.eklenmediMi = false;
              this.mesaj = '';
            }, 2000);
          }
        );
    } else {
      this.formHataliMi = true;
      this.mesaj = 'Hatalı Form!';
    }
  }
}
