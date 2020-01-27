import { Component } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  myForm: FormGroup;
  counter = 0;

  constructor(private router: Router) {
    this.formInit();
  }

  ionViewDidLeave() {
    this.myForm.reset();
  }

  formInit() {
    this.myForm = new FormGroup({
      userName: new FormControl('admin', [Validators.required]),
      password: new FormControl('123456', [Validators.required, Validators.minLength(6)])
    });
  }

  login() {
    if (this.myForm.invalid) {
      Object.keys(this.myForm.controls).forEach(key => {
        if (this.myForm.controls[key].invalid) {
          this.myForm.controls[key].markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    localStorage.setItem('token', '12345678');
    this.router.navigate(['/dashboard']);
  }
}
