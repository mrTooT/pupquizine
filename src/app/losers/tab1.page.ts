import {Component, OnInit} from '@angular/core';
import {Player} from '../app.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {FirebaseDeployConfig} from '@angular/fire/schematics/interfaces';
import {FirebaseDatabase} from '@angular/fire';
import {Observable} from 'rxjs';
@Component({
  selector: 'app-tab1',
  templateUrl: 'losers.page.html',
  styleUrls: ['losers.page.scss']
})
export class Tab1Page{
  players: Observable<Player[]>;
  currentPlayer: any = {};
  newPlayer: boolean = false;
  newPlayerName: string = '';
  isLoggedIn = false;
  playersRef: AngularFireList<any>;
  constructor(db: AngularFireDatabase,
              private firebaseAuthentication: FirebaseAuthentication) {
    this.players = db.list<Player>('players').valueChanges();
    this.firebaseAuthentication.onAuthStateChanged(() => {
      if (user) {
       this.currentPlayer = user;
      } else {
        // User is signed out.
        // ...
      }
    }
  }


  onAddPlayer() {
    this.firebaseAuthentication.createUserWithEmailAndPassword('test@gmail.com', '123')
        .then((res: any) => console.log(res))
        .catch((error: any) => console.error(error));
    let gangstahs: Player[] = [];
    this.players.subscribe((players) => {
      gangstahs = players
    });
    gangstahs.push({
      name: this.newPlayerName
    });
  }

  onLoginPlayer(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }
}
