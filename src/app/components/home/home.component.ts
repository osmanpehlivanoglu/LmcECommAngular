import { Component, OnInit } from '@angular/core';
import { GlobalVariable } from 'src/app/models/global';
import { Resim } from 'src/app/models/resim';
import { ResimService } from 'src/app/services/resim.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  resimUrl = GlobalVariable.BASE_URL;
  resimlerOn: Resim[];
  resimlerSag: Resim[];
  resimlerAlt: Resim[];

  constructor(private resimService: ResimService) {}

  ngOnInit(): void {
    this.resimService.getResimlerByUrunId(2000000000).subscribe((r) => {
      this.resimlerOn = r.data;
    });
    this.resimService.getResimlerByUrunId(2000000001).subscribe((r) => {
      this.resimlerSag = r.data;
    });
  }
}
