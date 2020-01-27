import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DashboardPage } from './dashboard.page';
import { PhotoService } from 'src/app/core/photo.service';
import { PipeModule } from '../pipe.module';

const routes: Routes = [{
  path: '',
  component: DashboardPage
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipeModule
  ],
  declarations: [DashboardPage],
  providers: [
    PhotoService
  ]
})
export class DashboardPageModule { }
