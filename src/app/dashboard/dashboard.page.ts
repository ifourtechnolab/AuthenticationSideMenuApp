import { Component } from '@angular/core';
import { PhotoService } from 'src/app/core/photo.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {

  constructor(private photoService: PhotoService) { }

  ionViewWillEnter() {
    this.photoService.loadSaved();
  }
}
