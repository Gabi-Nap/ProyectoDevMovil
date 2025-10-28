import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/authService';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone: false
})
export class FavoritosPage implements OnInit {

  constructor(private authService: AuthService, private auth: Auth, private router: Router) { }


  listaFavoritos: any[] = [];


  async ngOnInit() {
    // console.log(this.fabuloso)
    // console.log(this.authService.pruebas)
    // console.log(this.fabuloso1)
    this.listaFavoritos = this.authService.listaFavoritos
    await this.obtenerFavoritos();

  }

  eliminarJuego(juego: string) {
    return this.authService.eliminarJuego(juego);
  }
  verConsola() {
    console.log(this.listaFavoritos)
  }
  navegarJuego() {
    this.router.navigate(['/tabs/tab:id'])
  }
  obtenerFavoritos() {
    const user = this.auth.currentUser;
    if (!user) {
      console.log('No hay ningun usuario logueado');
      return;
    }

    const refUsuario = doc(this.authService.firestore, "favoritos", user.uid);

    onSnapshot(refUsuario, (docSnap) => {
      if (docSnap.exists()) {
        const datos = docSnap.data();
        const juegos = datos['juegos'] || [];
        console.log('🎮 Favoritos obtenidos:', juegos);
        this.listaFavoritos = juegos;

      } else {
        console.log('no hay ninguna lista de favoritos de este usuario');
        this.listaFavoritos = [];
      }
    });
  }


  async eliminarFavorito(idJuego: string) {
    const user = this.auth.currentUser;
    if (!user) return;

    const refUsuario = doc(this.authService.firestore, 'favoritos', user.uid);
    const snap = await getDoc(refUsuario);

    if (snap.exists()) {
      const juegos = snap.data()['juegos'] || [];
      const nuevosJuegos = juegos.filter((j: any) => j.id !== idJuego);

      await updateDoc(refUsuario, { juegos: nuevosJuegos });
      console.log('🗑️ Juego eliminado de favoritos');

      // Si estás usando getDoc:
      this.listaFavoritos = nuevosJuegos;

      // Si estás usando onSnapshot, no hace falta esta línea,
      // porque se actualiza automáticamente en tiempo real.
    }
  }

}
