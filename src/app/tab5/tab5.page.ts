import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/authService';
import { Auth } from '@angular/fire/auth';
import { collection, onSnapshot } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: false
})
export class Tab5Page implements OnInit {
  
  listaFavoritos: any[] = [];

  constructor(private authService: AuthService, private auth: Auth, private firestore: Firestore) { }
  
  async ngOnInit() {       
    await this.obtenerFavoritosTiempoReal();
  }
  
  /**
  @function eliminarFavorito
  @description Accion para eliminar un juego de favoritos de la lista
  @param idJuego debe ser tipo string
  @returns retorna una promesa
  */
  async eliminarFavorito(idJuego: string) {
    this.authService.quitarDeFavoritos(idJuego);
  }
  /**
  @function obtenerFavoritosTiempoReal
  @description Obtenemos la lista de juegos favoritos en tiempo real
  @param 
  @returns retorna una promesa
  */
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

