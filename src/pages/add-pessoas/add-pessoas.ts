import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ViagensService } from '../../services/viagens.service';

import { Viagem } from '../../models/viagem';

@Component({
  selector: 'page-add-pessoas',
  templateUrl: 'add-pessoas.html',
})

export class AddPessoasPage {

  nome: string = "";
  documento: string = "";
  telefone: string = "";
  embarque: string = "";
  desembarque: string = "";
  valorcombinado: string = "";
  observacao: string = "";
  pagou: boolean = false;

  validador: Array<string>;

  subscriptionInsertPassenger: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private vService: ViagensService) {
  }

  ionViewDidLoad() {
  }

  addPessoa() {
    this.validarFormulario();

    if(this.validador.length == 0) {
      this.presentLoading();

      this.vService.addPassenger(this.embarque, this.desembarque, this.documento, this.nome, this.pagou, this.observacao, this.telefone, this.valorcombinado, this.navParams.data.Key);

      // Event Listener
      this.subscriptionInsertPassenger = this.vService.insertPassengerCompleted$.subscribe((item) => {
        this.vService.notifyAll(this.getNotificationTitle(), this.getNotificationDescription());
        this.subscriptionInsertPassenger.unsubscribe();
        this.navCtrl.remove(2, 1, { animate : true }).then(() => {});
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

    if(this.nome == "") {
      this.validador.push("Nome");
    }

    if(this.embarque == "") {
      this.validador.push("Embarque");
    }

    if(this.desembarque == "") {
      this.validador.push("Desembarque");
    }

    if(this.valorcombinado == "") {
      this.validador.push("Valor Combinado");
    }
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

    return origem + " x " + destino + " (" + data + ")" + " às " + hora;
  }

  getNotificationDescription() : string {
    let tamanho: number = this.navParams.data.NumeroPessoas;
    return "A viagem possui " + (tamanho + 1) + " passageiros.";
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
