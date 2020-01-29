import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private storage: Storage) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return new Promise((resolve) => {
      const token = localStorage.getItem('token');
      console.log('token', token);
      if (token) {
        resolve(true);
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        resolve(false);
      }
    });
  }

  logout() {
    localStorage.clear();
    this.storage.clear();
    this.router.navigate(['/login']);
  }
}
