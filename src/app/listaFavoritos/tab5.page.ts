import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/authService';
import { Auth } from '@angular/fire/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: false
})
export class Tab5Page implements OnInit {

  constructor(private authService: AuthService, private auth: Auth, private firestore: Firestore) { }


  listaFavoritos: any[] = [];//estara la lista de favoritos del usuario autenticado


  async ngOnInit() {
    //obtiene la lista de favoritos en tiempo real
    await this.obtenerFavoritosTiempoReal();
  }
  //funcion para un boton para eliminar el juego de la lista
  async eliminarFavorito(idJuego: string) {
    this.authService.quitarDeFavoritos(idJuego);
  }
  
  async obtenerFavoritosTiempoReal() {
    const user = this.auth.currentUser;
    if(!user){
      return ;
    }
    const refUsuario = collection(this.firestore, 'favoritos', user.uid, 'juegos');
    onSnapshot(refUsuario, (snapshot) => {
    this.listaFavoritos = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  });
  }

}

