import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ToptanciService } from 'src/app/services/toptanci.service';

@Component({
  selector: 'app-toptanci-ekle',
  templateUrl: './toptanci-ekle.component.html',
  styleUrls: ['./toptanci-ekle.component.css'],
})
export class ToptanciEkleComponent implements OnInit {
  eklendiMi: boolean = false;
  eklenmediMi: boolean = false;
  formHataliMi: boolean = false;
  mesaj: string;
  toptanciForm: FormGroup;

  constructor(
    private toptanciService: ToptanciService,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.toptanciForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      firma: new FormControl(null),
      email: new FormControl(null),
      telefon: new FormControl(null),
      adres: new FormControl(null, Validators.required),
    });
  }
  ekle() {
    if (this.toptanciForm.valid) {
      let toptanciModel = Object.assign({}, this.toptanciForm.value);

      this.toptanciService.addToptanci(toptanciModel).subscribe(
        (response) => {
          this.eklendiMi = true;
          this.mesaj = response.message;

          setTimeout(() => {
            this.eklendiMi = false;
            this.mesaj = '';
            this.toptanciForm.reset();
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
