import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, signOut, onAuthStateChanged } from '@angular/fire/auth';


// import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
// import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

import { doc, setDoc, getDoc, updateDoc, getFirestore, arrayUnion, arrayRemove } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Auth } from '@angular/fire/auth'
// ---------------------
//Esto para injectar los providers y poder utilizarlos
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
  
})
export class AuthService {
  firestore = inject(Firestore);

  usuarioCredencial:any ;
  // ----------------
  juegoId: any;

  juego: any = null // Esto contendra toda la informacion de un juego llamado por su id
  favoritos: any[] = [];
  
  // ------------------

  constructor(private auth: Auth) { }

  // Login
  async login(email: string, password: string) {
    this.usuarioCredencial = await signInWithEmailAndPassword(this.auth, email, password);
    return this.usuarioCredencial;
  }

  // Registro
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Logout

  async cerrarSesion() {
    this.usuarioCredencial = ''
    return await signOut(this.auth)
  }

  async obtenerUsuario(uid: string) {
    const docRef = doc(this.firestore, `users/${uid}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Datos del usuario:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('No se encontró el usuario');
      return null;
    }
  }
  // -------------------------------------------------------
  async agregarFavoritos(idDelJuego: string, nombreJuego: string) {
    onAuthStateChanged(this.auth, async (user) => {
    if (user) {
      const idDelUsuario = user.uid;
      
      const refUsuario = doc(this.firestore, "favoritos", idDelUsuario);
      try {
        // Al presionar añadir a favoritos, crea estos objetos en el firestore
        await updateDoc(refUsuario, {
          juegos: arrayUnion({
            id: idDelJuego,
            nombre: nombreJuego,
          }),
        });
        
        console.log('Juego agregado a favoritos');
      } catch (error) {
        // Si no existe el documento, lo creamos
        console.log('documento creado de favoritos');
        //si no tenemos una lista de favoritos creada, con esto en primer lugar la crearemos para luego añadir 
        //mas juegos favoritos con el updateDoc
        //lo que hara el setDoc sera crear la lista de favoritos
        await setDoc(refUsuario, {
          juegos: [{
            id: idDelJuego,
            nombre: nombreJuego,
            
          }],
        });        
        }
        this.favoritos.push({
          id: idDelJuego,
          nombre:nombreJuego})
      console.log('agregamos el siguiente juego:', nombreJuego);
    } else {
      console.log('el usuario esta desconectado');//esto vamos a borrarlo al finalizar la app, no es necesaria
    }
  });
}//Esto sera para llamar a los objetos guardados en el firestore
async obtenerFavoritos() {
  const user = this.auth.currentUser;
  if (!user) {
    console.log('No hay ningun usuario logueado');
    return [];
  }

  const refUsuario = doc(this.firestore, "favoritos", user.uid);
  const docSnap = await getDoc(refUsuario);

  if (docSnap.exists()) {
    const datos = docSnap.data();
    const juegos = datos['juegos'] || [];
    console.log('🎮 Favoritos obtenidos:', juegos);
    return juegos;
  } else {
    console.log('no hay ninguna lista de favoritos de este usuario');
    return [];
  }
}
//funcion para eliminar juego del firestore o de la lista de favoritos
async eliminarJuego(idJuego: string) {
  const user = this.auth.currentUser;
  if (!user) {
    console.log('No hay usuario logueado');
    return;
  }

  const refUsuario = doc(this.firestore, "favoritos", user.uid);
  const docSnap = await getDoc(refUsuario);

  if (docSnap.exists()) {
    const datos = docSnap.data();
    const juegos = datos['juegos'];

    // Buscamos el juego a eliminar
    const juegoAEliminar = juegos.find((j: any) => j.id === idJuego);

    if (!juegoAEliminar) {
      console.log('El juego no está en favoritos');
      return;
    }

    // Eliminamos el objeto exacto con arrayRemove
    await updateDoc(refUsuario, {
      juegos: arrayRemove(juegoAEliminar)
    });

    console.log(`Juego "${juegoAEliminar.nombre}" eliminado de favoritos`);
  } else {
    console.log('No hay lista de favoritos para este usuario');
  }
}

}