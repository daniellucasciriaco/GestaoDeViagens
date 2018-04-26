import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { ViagensService } from '../../services/viagens.service';

@Component({
  selector: 'page-open-travel',
  templateUrl: 'open-travel.html',
})
export class OpenTravelPage {

  origem: string = "";
  destino: string = "";
  data: string = "";
  horario: string = "";

  validador: Array<string>;

  subscriptionInsertCompleted: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private vService: ViagensService) {
  }

  ionViewDidLoad() {
  }

  openTravel() {
    let dataSplitted = this.data.split("-", 3); 

    let datahora: string = dataSplitted[2] + "/" + dataSplitted[1] + "/" + dataSplitted[0] + " " + this.horario;

    this.validarFormulario();

    if(this.validador.length == 0) {
      this.presentLoading();
      
      this.vService.openTravel(this.origem, this.destino, datahora);
  
      // Event Listener
      this.subscriptionInsertCompleted = this.vService.insertCompleted$.subscribe((item) => {
        this.subscriptionInsertCompleted.unsubscribe();
        this.navCtrl.setRoot(HomePage);
      });
    }
    else {
      let stringValidacao = "";
      for (let i = 0; i < this.validador.length; i++)
      {
        if (i == 0) {
          stringValidacao += this.validador[i];
        }
        else {
          stringValidacao += ", " + this.validador[i];
        }
      }
      stringValidacao += ".";

      this.showAlert("Atenção!", "Preencha os campos obrigatórios: " + stringValidacao);
    }
  }

  validarFormulario() {
    this.validador = new Array<string>();

    if(this.origem == "") {
      this.validador.push("Origem");
    }

    if(this.destino == "") {
      this.validador.push("Destino");
    }

    if(this.data == "") {
      this.validador.push("Data");
    }

    if(this.horario == "") {
      this.validador.push("Hora");
    }
  }

  showAlert(title: string, description: string) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: description,
      buttons: ['OK']
    });
    alert.present();
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
