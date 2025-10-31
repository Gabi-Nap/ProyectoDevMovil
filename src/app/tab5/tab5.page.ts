import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/authService';
import { Auth } from '@angular/fire/auth';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: false
})
export class Tab5Page implements OnInit {
  constructor(private authService: AuthService, private auth: Auth, private firestore: Firestore) { }
  listaFavoritos: any[] = [];
  async ngOnInit() {
    this.listaFavoritos = this.authService.listaFavoritos    
    await this.obtenerFavoritosTiempoReal();
  }
  
  /**
  @function eliminarFavorito
  @description Accion para eliminar un juego de favoritos de la lista
  @param idJuego debe ser tipo string
  @returns retorna una promesa
  */
  async eliminarFavorito(idJuego: string) {
    const user :any= this.auth.currentUser;
    
    const refUsuario = doc(this.firestore, 'favoritos', user.uid);
    const snap = await getDoc(refUsuario);

    if (snap.exists()) {
      const juegos = snap.data()['juegos'] || [];
      const nuevosJuegos = juegos.filter((juego: any) => juego.id !== idJuego);
      await updateDoc(refUsuario, { juegos: nuevosJuegos });
    }
  }
  /**
  @function obtenerFavoritosTiempoReal
  @description Obtenemos la lista de juegos favoritos en tiempo real
  @param 
  @returns retorna una promesa
  */
  async obtenerFavoritosTiempoReal() {
    const user :any= this.auth.currentUser;
    const refUsuario = doc(this.firestore, 'favoritos', user.uid);
    onSnapshot(refUsuario, (docSnap) => {
      if (docSnap.exists()) {
        const datos = docSnap.data();
        this.listaFavoritos = datos['juegos'] || [];
      } else {
        this.listaFavoritos = [];
      }
    });
  }
}

