import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { TravelDetailPage } from '../travel-detail/travel-detail';

import { ViagensService } from '../../services/viagens.service';

import { Viagem } from '../../models/viagem';

@Component({
  selector: 'page-closed-travels',
  templateUrl: 'closed-travels.html',
})
export class ClosedTravelsPage {

  viagens: Array<Viagem>;

  subscriptionCompleted: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, protected vService: ViagensService) {
    this.presentLoading();
    this.vService.getClosedTravels();
    // Event Listener
    this.subscriptionCompleted = this.vService.completed$.subscribe((item) => {
      this.subscriptionCompleted.unsubscribe();
      this.viagens = item;
      this.dismissLoading();
    });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
  }

  goToDetail(key: string, status: string, origem: string, destino: string, datahora: string, viagem: Viagem) {
    this.navCtrl.push(TravelDetailPage, {Key: key, Status: status, Title: origem + " x " + destino + " - " + datahora, Viagem: viagem})
  }

  presentLoading() {
    this.loadingCtrl.create({
      content: "Carregando...",
      dismissOnPageChange: true
    }).present();
  }

  dismissLoading() {
    this.loadingCtrl.create({
      content: "Carregando...",
      dismissOnPageChange: true
    }).dismiss();
  }

}
