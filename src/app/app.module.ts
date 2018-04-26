import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { AngularFireModule } from "angularfire2";
import { AngularFireDatabase } from 'angularfire2/database';
import { Push } from '@ionic-native/push';
import { FCM } from '@ionic-native/fcm';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { OpenTravelPage } from '../pages/open-travel/open-travel';
import { OpenTravelsPage } from '../pages/open-travels/open-travels';
import { ClosedTravelsPage } from '../pages/closed-travels/closed-travels';
import { TravelDetailPage } from '../pages/travel-detail/travel-detail';
import { AddPessoasPage } from '../pages/add-pessoas/add-pessoas';
import { PassengerDetailPage } from '../pages/passenger-detail/passenger-detail';

import { ViagensService } from '../services/viagens.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

export const firebaseConfig = {
  apiKey: 'AIzaSyA57lNDw3oSa8eXTqirnrVyiQRUEgajKB0',
  authDomain: 'magellatur-15f4d.firebaseapp.com',
  databaseURL: 'https://magellatur-15f4d.firebaseio.com',
  projectId: 'magellatur-15f4d',
  storageBucket: 'magellatur-15f4d.appspot.com',
  messagingSenderId: '620636264849'
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OpenTravelPage,
    OpenTravelsPage,
    ClosedTravelsPage,
    TravelDetailPage,
    AddPessoasPage,
    PassengerDetailPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OpenTravelPage,
    OpenTravelsPage,
    ClosedTravelsPage,
    TravelDetailPage,
    AddPessoasPage,
    PassengerDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ViagensService,
    AngularFireDatabase,
    Push,
    FCM,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
