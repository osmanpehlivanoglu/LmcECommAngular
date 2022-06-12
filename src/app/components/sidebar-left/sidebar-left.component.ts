import { Component, OnInit } from '@angular/core';
import { Kategori } from 'src/app/models/kategori';
import { Marka } from 'src/app/models/marka';
import { KategoriService } from 'src/app/services/kategori.service';
import { MarkaService } from 'src/app/services/marka.service';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.css'],
})
export class SidebarLeftComponent implements OnInit {
  kategoriler: Kategori[] = [];
  markalar: Marka[] = [];

  constructor(
    private kategoriService: KategoriService,
    private markaService: MarkaService
  ) {}

  ngOnInit(): void {
    this.getKategoriler();
  }

  getKategoriler() {
    this.kategoriService.getAll().subscribe((response) => {
      this.kategoriler = response.data;
    });
  }

  getMarkalar() {
    this.markaService.getAll().subscribe((response) => {
      this.markalar = response.data;
    });
  }

  getMarkalarByKategoriId(kategoriId: number) {
    this.markaService
      .getMarkalarByKategoriId(kategoriId)
      .subscribe((response) => {
        this.markalar = response.data;
      });
  }
}
