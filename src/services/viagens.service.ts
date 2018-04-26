import { Injectable } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ViagensService {

  public completed$: EventEmitter<any>;
  public insertCompleted$: EventEmitter<any>;
  public updateCompleted$: EventEmitter<any>;
  public passengerUpdateCompleted$: EventEmitter<any>;
  public passengerPresenceUpdateCompleted$: EventEmitter<any>;
  public passengerDeleteCompleted$: EventEmitter<any>;
  public insertPassengerCompleted$: EventEmitter<any>;
  public passengersCompleted$: EventEmitter<any>;

  firebaseDB: AngularFireDatabase;
  openTravels: FirebaseListObservable<any>;
  closedTravels: FirebaseListObservable<any>;
  passengersPerTrip: FirebaseListObservable<any>;

  constructor(db: AngularFireDatabase, public http: Http) {
    this.firebaseDB = db;
    this.completed$ = new EventEmitter();
    this.insertCompleted$ = new EventEmitter();
    this.updateCompleted$ = new EventEmitter();
    this.passengerUpdateCompleted$ = new EventEmitter();
    this.passengerPresenceUpdateCompleted$ = new EventEmitter();
    this.passengerDeleteCompleted$ = new EventEmitter();
    this.insertPassengerCompleted$ = new EventEmitter();
    this.passengersCompleted$ = new EventEmitter();
  }

  // Lista de viagens (Abertas e Fechadas)
  getOpenTravels() {
    this.openTravels = this.firebaseDB.list('/Viagem', {
      query: {
        orderByChild: "Status",
        equalTo: "Aberta"
      }
    });
    this.openTravels.subscribe(snapshot => {
      this.completed$.emit(snapshot);    
    });
  }

  getClosedTravels() {
    this.closedTravels = this.firebaseDB.list('/Viagem', {
      query: {
        orderByChild: "Status",
        equalTo: "Fechada"
      }
    });
    this.closedTravels.subscribe(snapshot => {
      this.completed$.emit(snapshot);    
    });
  }

  // Abrir Viagens
  openTravel(origem: string, destino: string, datahora: string) {
    let writer = this.firebaseDB.list('/Viagem', { preserveSnapshot: true });
    
    writer.push({ Origem: origem, Destino: destino, DataHora: datahora, Status: "Aberta" }).then((item) => {
      this.insertCompleted$.emit(item);
    });
  }

  // Fechar Viagens
  closeTravel(key: string) {
    let updater = this.firebaseDB.object('/Viagem/' + key);
    
    updater.update({ Status: "Fechada" }).then((item) => {
      this.updateCompleted$.emit(item);
    });
  }

  // Mudar status de pagamento
  changePaymentStatus(value: boolean, key: string) {
    let updater = this.firebaseDB.object('/Pessoa/' + key);
    
    updater.update({ Pago: value }).then((item) => {
      this.passengerUpdateCompleted$.emit(item);
    }); 
  }

  // Mudar status de presença
  changePresenceStatus(value: boolean, key: string) {
    let updater = this.firebaseDB.object('/Pessoa/' + key);
    
    updater.update({ Chegou: value }).then((item) => {
      this.passengerPresenceUpdateCompleted$.emit(item);
    }); 
  }

  // Deletar passageiro
  deletePassenger(key: string) {
    let item = this.firebaseDB.object('/Pessoa/' + key);
    
    item.remove().then((response) => {
      this.passengerDeleteCompleted$.emit(response);
    });
  }

  // Lista de Passageiros por viagem
  getPassengersPerTrip(key: string) {
    this.passengersPerTrip = this.firebaseDB.list('/Pessoa', {
      query: {
        orderByChild: "Viagem",
        equalTo: key
      }
    });
    this.passengersPerTrip.subscribe(snapshot => {
      this.passengersCompleted$.emit(snapshot);    
    });
  }

  // Inserir passageiro na viagem
  addPassenger(embarque: string, desembarque: string, documento: string, nome: string, pago: boolean, observacao: string, telefone: string, valorcombinado: string, viagem: string) {
    let writer = this.firebaseDB.list('/Pessoa', { preserveSnapshot: true });
    
    writer.push({ Embarque: embarque, Desembarque: desembarque, Documento: documento, Nome: nome, Pago: pago, Observacao: observacao, Telefone: telefone, ValorCombinado: valorcombinado, Chegou: false, Viagem: viagem }).then((item) => {
      this.insertPassengerCompleted$.emit(item);
    });
  }

  // Enviar Push Notification
  notifyAll(title: string, description: string) {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "key=AAAAkIDN2ZE:APA91bHAxx70P8kt1alufwiJYlyOvt1whT7hDNXjA62Giil0bbdpISanN1jfhT3vLXL7s3hFoSOgXKQfhdSuESo0vIw8MFT-KyGoSXrInlqnQMIPmWq4mm5n9JLCo96FTXuKP8KEGdyK");

    let body = {
      notification: {
        title: title,
        body: description,
        sound: "default",
        click_action: "FCM_PLUGIN_ACTIVITY",
        icon: "fcm_push_icon"
      },
      to: "/topics/viagens",
      priority: "high"
    };

    this.http.post("https://fcm.googleapis.com/fcm/send", JSON.stringify(body), { headers: headers})
    .map(res => res.json())
    .subscribe(data => {
      console.log(data);
    });
  }
}
