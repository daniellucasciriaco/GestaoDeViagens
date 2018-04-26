import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

import { ViagensService } from '../../services/viagens.service';

import { Pessoa } from '../../models/pessoa';
import { Viagem } from '../../models/viagem';

@Component({
  selector: 'page-passenger-detail',
  templateUrl: 'passenger-detail.html',
})
export class PassengerDetailPage {

  pessoa: Pessoa;
  key: string;

  passengerSubscriptionDelete: any;
  passengerSubscriptionUpdate: any;
  passengerSubscriptionPresenceUpdate: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private vService: ViagensService) {
    this.pessoa = navParams.data.Pessoa;
    this.key = navParams.data.Pessoa.$key;
    // Event Listener update
    this.passengerSubscriptionUpdate = this.vService.passengerUpdateCompleted$.subscribe((item) => {
      this.passengerSubscriptionUpdate.unsubscribe();
      this.navCtrl.remove(2, 1, { animate : true }).then(() => {});
    });
    // Event Listener update presence
    this.passengerSubscriptionPresenceUpdate = this.vService.passengerPresenceUpdateCompleted$.subscribe((item) => {
      this.passengerSubscriptionPresenceUpdate.unsubscribe();
      this.navCtrl.remove(2, 1, { animate : true }).then(() => {});
    });
    // Event Listener delete
    this.passengerSubscriptionDelete = this.vService.passengerDeleteCompleted$.subscribe((item) => {
      this.vService.notifyAll(this.getNotificationTitle(), this.getNotificationDescription());
      this.passengerSubscriptionDelete.unsubscribe();
      this.navCtrl.remove(2, 1, { animate : true }).then(() => {});
    });
  }

  ionViewDidLoad() {
  }

  ngOnDestroy() {
  }

  getInfo() {
    if(this.pessoa.Pago) {
      return "Não Pagou"
    }
    else {
      return "Pagou";
    }
  }

  getPresenceInfo() {
    if(this.pessoa.Chegou) {
      return "Não Chegou"
    }
    else {
      return "Chegou";
    }
  }

  deletePassenger() {
    this.presentLoading();
    this.vService.deletePassenger(this.key);
  }

  changePaymentStatus() {
    this.presentLoading();
    this.vService.changePaymentStatus(!this.pessoa.Pago, this.key);
  }

  changePresenceStatus() {
    this.presentLoading();
    this.vService.changePresenceStatus(!this.pessoa.Chegou, this.key);
  }

  getNotificationTitle() : string {
    let origem: string;
    let destino: string;
    let data: string;
    let hora: string;

    let viagem: Viagem = this.navParams.data.Viagem;

    let datahora = viagem.DataHora.split(" ", 2);

    hora = datahora[1];

    let dataSplitted = datahora[0].split("/", 3);

    data = dataSplitted[0] + "/" + dataSplitted[1];

    if(viagem.Origem == "Belo Horizonte") {
      origem = "BH";
    }
    else {
      origem = "Viçosa";
    }

    if(viagem.Destino == "Belo Horizonte") {
      destino = "BH";
    }
    else {
      destino = "Viçosa";
    }

    return origem + " x " + destino + " (" + data + ")" + " às " + hora + " (Furou)";
  }

  getNotificationDescription() : string {
    let tamanho: number = this.navParams.data.NumeroPessoas;
    return "A viagem possui " + (tamanho - 1) + " passageiros.";
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
