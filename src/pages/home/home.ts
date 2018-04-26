import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { OpenTravelPage } from '../open-travel/open-travel';
import { OpenTravelsPage } from '../open-travels/open-travels';
import { ClosedTravelsPage } from '../closed-travels/closed-travels';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  openPage(page) {
    let component: any;

    if(page == "OpenTravel") {
      component = OpenTravelPage
    }
    else if(page == "OpenTravels") {
      component = OpenTravelsPage
    }
    else if(page == "ClosedTravels") {
      component = ClosedTravelsPage
    }

    this.navCtrl.setRoot(component);
  }

}
