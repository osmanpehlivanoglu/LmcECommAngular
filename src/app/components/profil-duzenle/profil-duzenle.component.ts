import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { KullaniciService } from 'src/app/services/kullanici.service';
import { SepetService } from 'src/app/services/sepet.service';

@Component({
  selector: 'app-profil-duzenle',
  templateUrl: './profil-duzenle.component.html',
  styleUrls: ['./profil-duzenle.component.css'],
})
export class ProfilDuzenleComponent implements OnInit {
  kayitForm: FormGroup;

  kullanici: User;

  hile: any;

  constructor(
    private toastrService: ToastrService,
    private kullaniciService: KullaniciService,
    private authService: AuthService,
    private sepetService: SepetService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserIdByEmail(localStorage.getItem('email'));

    this.kayitForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      firma: new FormControl(null),
      email: new FormControl(null, [Validators.required, Validators.email]),
      telefon: new FormControl(null, [
        Validators.required,
        Validators.minLength(10),
      ]),
      adres: new FormControl(null, Validators.required),
    });
  }

  getUserIdByEmail(email: string) {
    this.kullaniciService.getKullaniciByMail(email).subscribe((response) => {
      this.kullanici = response.data;

      this.hile = this.kullanici;

      this.kayitForm = new FormGroup({
        userId: new FormControl(this.hile.userId),
        firstName: new FormControl(
          this.kullanici.firstName,
          Validators.required
        ),
        lastName: new FormControl(this.kullanici.lastName, Validators.required),
        firma: new FormControl(this.kullanici.firma),
        email: new FormControl(this.kullanici.email, [
          Validators.required,
          Validators.email,
        ]),
        telefon: new FormControl(this.kullanici.telefon, [
          Validators.required,
          Validators.minLength(10),
        ]),
        adres: new FormControl(this.kullanici.adres, Validators.required),
        passwordHash: new FormControl(this.hile.passwordHash),
        passwordSalt: new FormControl(this.hile.passwordSalt),
      });
    });
  }

  guncelle() {
    let kayitModel = Object.assign({}, this.kayitForm.value);

    this.kullaniciService.updateKullanici(kayitModel).subscribe(
      (response) => {
        this.toastrService.success(response.message, 'Başarılı!');
      },
      (responseError) => {
        this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
      }
    );
  }

  sil() {
    let kayitModel = Object.assign({}, this.kayitForm.value);

    this.kullaniciService.deleteKullanici(kayitModel).subscribe(
      (response) => {
        this.toastrService.success(response.message, 'Başarılı!');
        this.authService.logout();
        localStorage.clear();
        this.sepetService.setSepetteKacCesitUrunVar(0);
        this.authService.setKullaniciGirisYapmisMi(false);
        this.authService.setKullaniciAdminMi(false);
        this.router.navigateByUrl('/kayit-ol');
      },
      (responseError) => {
        this.toastrService.success('Bir şeyler ters gitti', 'Hata!');
      }
    );
  }
}
