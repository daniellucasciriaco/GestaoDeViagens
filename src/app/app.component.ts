import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';

import { HomePage } from '../pages/home/home';
import { OpenTravelPage } from '../pages/open-travel/open-travel';
import { OpenTravelsPage } from '../pages/open-travels/open-travels';
import { ClosedTravelsPage } from '../pages/closed-travels/closed-travels';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public fcm: FCM) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Início', component: HomePage },
      { title: 'Abrir Viagem', component: OpenTravelPage },
      { title: 'Viagens Abertas', component: OpenTravelsPage },
      { title: 'Viagens Fechadas', component: ClosedTravelsPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.fcmConfig();
    });
  }

  openPage(page) {
    this.nav.setRoot(page.component);
  }

  fcmConfig() {
    if (this.platform.is('android')) {
      this.fcm.getToken().then(token => {
        this.fcm.subscribeToTopic("viagens");
      })

      this.fcm.onNotification().subscribe(data=>{
        if(data.wasTapped){
          console.log("Received in background");
        } else {
          console.log("Received in foreground");
        };
      })

      this.fcm.onTokenRefresh().subscribe(token=>{
        console.log(token);
      })
    } 
  }
}
