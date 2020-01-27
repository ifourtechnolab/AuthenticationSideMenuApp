import { Component, ViewChild } from '@angular/core';
import { Platform, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { ToastService } from './core/toast.service';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AlertController } from '@ionic/angular';
import { AuthGuard } from './core/auth/auth.guard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  tempCount = 1;
  backButtonPressedTimer: any;
  @ViewChild(IonRouterOutlet, { static: true }) routerOutlet: IonRouterOutlet;

  public appPages = [{
    title: 'Dashboard',
    url: '/dashboard',
    icon: 'home'
  }, {
    title: 'Info',
    url: '/about',
    icon: 'information-circle'
  }, {
    title: 'Settings',
    icon: 'setting',
    children: [{
      title: 'Share to WhatsApp',
      url: '/whatsapp',
      icon: 'logo-whatsapp'
    }, {
      title: 'Logout',
      url: '/logout',
      icon: 'log-out'
    }]
  }];

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar,
              private socialSharing: SocialSharing, private router: Router, private toastService: ToastService,
              private alertController: AlertController, private authGuard: AuthGuard) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#3b444b');

      this.splashScreen.hide();
      this.router.navigate(['/dashboard']);
    });
  }

  backButtonEvent() {
    this.platform.backButton.subscribe(() => {
      console.log(this.router.url);

      if (this.router.url === '/dashboard') {
        if (this.tempCount === 2) {
          navigator['app'].exitApp();
        }
        this.toastService.presentToast('Press again to exit..');
        this.tempCount++;
        if (this.backButtonPressedTimer) {
          clearTimeout(this.backButtonPressedTimer);
        }
        this.backButtonPressedTimer = setTimeout(() => {
          this.tempCount = 1;
        }, 3000);
      } else {
        this.routerOutlet.pop();
      }
    });
  }

  async setting(url: string) {
    if (url === '/whatsapp') {
      this.socialSharing.shareViaWhatsApp('Install App!!', '', 'https://ionicframework.com/docs').then(() => { }).catch(() => { });
    } else if (url === '/logout') {
      await this.presentAlertConfirm();
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Are you sure you want to logout?',
      buttons: [{
        text: 'No',
        role: 'cancel'
      }, {
        text: 'Yes',
        handler: () => {
          this.authGuard.logout();
        }
      }]
    });
    await alert.present();
  }
}
