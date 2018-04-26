import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { AddPessoasPage } from '../add-pessoas/add-pessoas';
import { PassengerDetailPage } from '../passenger-detail/passenger-detail';

import { ViagensService } from '../../services/viagens.service';

import { Pessoa } from '../../models/pessoa';

@Component({
  selector: 'page-travel-detail',
  templateUrl: 'travel-detail.html',
})
export class TravelDetailPage {

  pessoas: Array<Pessoa>;

  subscriptionUpdate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private vService: ViagensService) {
    this.presentLoading();
    this.vService.getPassengersPerTrip(navParams.data.Key);
    // Event Listener
    this.vService.passengersCompleted$.subscribe((item) => {
      this.pessoas = item;
      this.dismissLoading();
    });
    // Event Listener update
    this.subscriptionUpdate = this.vService.updateCompleted$.subscribe((item) => {
      this.subscriptionUpdate.unsubscribe();
      this.navCtrl.pop();
    });
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
  }

  addPessoa() {
    this.navCtrl.push(AddPessoasPage, {Key: this.navParams.data.Key, Viagem: this.navParams.data.Viagem, NumeroPessoas: this.pessoas.length})
  }

  closeTravel() {
    this.presentLoading();
    this.vService.closeTravel(this.navParams.data.Key);
  }

  goToPassengerDetail(pessoa: Pessoa) {
    this.navCtrl.push(PassengerDetailPage, {Pessoa: pessoa, NumeroPessoas: this.pessoas.length, Viagem: this.navParams.data.Viagem});
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
