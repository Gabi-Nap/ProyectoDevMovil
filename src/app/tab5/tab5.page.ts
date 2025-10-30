import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/authService';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
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


  listaFavoritos: any[] = [];//estara la lista de favoritos del usuario autenticado


  async ngOnInit() {
    this.listaFavoritos = this.authService.listaFavoritos
    //obtiene la lista de favoritos en tiempo real
    await this.obtenerFavoritosTiempoReal();
  }
  //funcion para un boton para eliminar el juego de la lista
  async eliminarFavorito(idJuego: string) {
    const user: any = this.auth.currentUser;
    const refUsuario = doc(this.firestore, 'favoritos', user.uid);
    const snap = await getDoc(refUsuario);

    if (snap.exists()) {
      const juegos = snap.data()['juegos'] || [];
      const nuevosJuegos = juegos.filter((juego: any) => juego.id !== idJuego);

      await updateDoc(refUsuario, { juegos: nuevosJuegos });

      // Si estás usando onSnapshot, no hace falta esta línea,
      // porque se actualiza automáticamente en tiempo real.
    }
  }
  obtenerFavoritosTiempoReal() {
    const user: any = this.auth.currentUser;
    const refUsuario = doc(this.firestore, 'favoritos', user.uid);

    // Escucha cambios en tiempo real y los actualiza sin necesidad de actualizar la pagina
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

