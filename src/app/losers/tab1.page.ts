import {Component, OnInit} from '@angular/core';
import {Player} from '../app.model';
import {AngularFireDatabase, AngularFireList} from '@angular/fire/database';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
@Component({
  selector: 'app-tab1',
  templateUrl: 'losers.page.html',
  styleUrls: ['losers.page.scss']
})
export class Tab1Page{
  players: Player[];
  currentPlayer: any = {};
  playerId = null;
  isLoggedIn = false;
  newPlayerName = '';
  newPlayerImgUrl = '';
  playersRef: AngularFireList<Player>;
  score = 0;
  constructor(db: AngularFireDatabase) {
    this.isLoggedIn =  !!JSON.parse(localStorage.getItem('pubquizine-isLoggedin'));
    this.playerId =  JSON.parse(localStorage.getItem('pubquizine-playerId')) ? JSON.parse(localStorage.getItem('families-playerId')): null;
    this.playersRef = db.list<Player>('players');
    this.playersRef.snapshotChanges().pipe(
        map(changes =>
            changes.map(player => ({ key: player.payload.key, ...player.payload.val() }))
        )
    ).subscribe((players) => this.players = players);

  }

  onAddPlayer() {
    this.playerId = Date.now();
    localStorage.setItem('pubquizine-playerId', JSON.stringify(this.playerId));
    localStorage.setItem('pubquizine-isLoggedin', JSON.stringify(true));
    this.isLoggedIn = true;
    let newPlayer: Player = {
      id: this.playerId,
      name: this.newPlayerName,
      photo: this.newPlayerImgUrl ? this.newPlayerImgUrl : this.generateRandomImage()
    };
    this.playersRef.push(newPlayer);
    // this.players.subscribe((players) => {
    //   currentPlayers = players
    // });
    // currentPlayers.push(newPlayer);
  }

  getImage(player: Player) {
    return player.photo ? player.photo : this.generateRandomImage()
  }

  addScoreForPlayer() {
    this.players.forEach(player => {
      if (player.id === this.playerId) {
        this.playersRef.update(player.key, { score: this.score});
      }
    });
  }

  onDeletePlayer() {
    this.players.forEach(player => {
      if (player.id === this.playerId) {
        this.playersRef.remove(player.key);
      }
    });
    localStorage.removeItem('pubquizine-playerId');
    localStorage.removeItem('pubquizine-isLoggedin');
    this.isLoggedIn = false;
    this.playerId = null;
  }

  protected generateRandomImage(): string {
    const randomImages =  ['https://www.zelda.com/links-awakening/assets/img/characters/char-link.png',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1cunY_BD0fHJIJQYz0w055vTJAvvuXVMVGLhZ9nyl2pqC6M-Rbg&s',
      'https://toppng.com/uploads/preview/the-top-10-most-idiotic-nintendo-characters-i-know-zelda-ocarina-of-time-rauru-11563598738isg2vaox0s.png',
      'https://f0.pngfuel.com/png/994/671/drawing-legend-of-zelda-wind-waker-characters-png-clip-art.png',
      'https://p7.hiclipart.com/preview/290/348/912/the-legend-of-zelda-the-wind-waker-hyrule-warriors-link-character-soundtrack-others.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzZZyvDPXZBSn3adgEIgTzTjGhtqjRXvrpqUekIuAVgSZtwn4APA&s'
    ];
    return randomImages[Math.floor(Math.random() * randomImages.length)];
  }
}
