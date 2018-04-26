import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { TravelDetailPage } from '../travel-detail/travel-detail';

import { ViagensService } from '../../services/viagens.service';

import { Viagem } from '../../models/viagem';

@Component({
  selector: 'page-open-travels',
  templateUrl: 'open-travels.html',
})

export class OpenTravelsPage {

  viagens: Array<Viagem> = new Array<Viagem>();

  subscriptionCompleted: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private vService: ViagensService) {
    this.presentLoading();
    this.vService.getOpenTravels();
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
