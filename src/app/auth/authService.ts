import { Injectable, inject } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, Auth, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, Timestamp } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, onSnapshot } from '@angular/fire/firestore';
import { JuegosService } from '../services/juegos';

@Injectable({
  providedIn: 'root'

})
export class AuthService {
  //firestore injectado
  firestore = inject(Firestore);
  //credenciales de usuario autenticado
  usuarioCredencial: any;
  //lista de favoritos para desplegar luego
  favoritos: any[] = [];

  listaFavoritos: any[] = [];

  constructor(private auth: Auth) { }

  // servicio de login para authenticar correo y contraseña
  async login(email: string, password: string) {
    this.usuarioCredencial = await signInWithEmailAndPassword(this.auth, email, password);
    return this.usuarioCredencial;
  }
  // -------------------
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
  //Esta funcion boton servira para guardar los juegos que añadamos a favoritos
  async agregarFavoritos(idDelJuego: string, nombreJuego: string) {
    const user = this.auth.currentUser;
    if (!user) {
      console.log('Usuario no logueado');
      return;
    }

    const refUsuario = doc(this.firestore, "favoritos", user.uid);

    // 1️⃣ Verificamos si el juego ya está en favoritos
    const docSnap = await getDoc(refUsuario);

    if (docSnap.exists()) {
      const datos = docSnap.data();
      const juegos = datos['juegos'] || [];

      const yaExiste = juegos.some((j: any) => j.id === idDelJuego);
      if (yaExiste) {
        console.log('⚠️ El juego ya está en favoritos');
        return; // salimos para evitar duplicado
      }

      // 2️⃣ Si el documento existe y el juego no estaba, lo agregamos
      await updateDoc(refUsuario, {
        juegos: arrayUnion({ id: idDelJuego, nombre: nombreJuego }),
      });
      console.log(`✅ Juego "${nombreJuego}" agregado a favoritos`);
    } else {
      // 3️⃣ Si no existe el documento, lo creamos
      await setDoc(refUsuario, {
        juegos: [{ id: idDelJuego, nombre: nombreJuego }],
      });
      console.log('📄 Documento de favoritos creado y juego agregado');
    }
  }


  //funcion para subir comentario al firestore y storage para almacenarlo y llamarlo luego
  async subirComentario(juegoId: string, comentario: string, imagen: File | null) {
    const user = this.auth.currentUser;
    if (!user) return;

    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    const userSnap = await getDoc(userRef);

    let nombreUsuario = "Usuario desconocido";
    if (userSnap.exists()) {
      const userData = userSnap.data();
      nombreUsuario = userData['nombre'] || nombreUsuario;
    }


    let imageUrl = '';
    if (imagen) {
      const storage = getStorage();
      const imageRef = ref(storage, `comentarios/${user.uid}/${Date.now()}_${imagen.name}`);
      await uploadBytes(imageRef, imagen);
      imageUrl = await getDownloadURL(imageRef);
    }
    const comentariosRef = collection(this.firestore, `juegos/${juegoId}/comentarios`);
    await addDoc(comentariosRef, {
      uid: user.uid,
      nombreUsuario,
      comentario,
      imageUrl,
      fecha: Timestamp.now()
    });
  }
  // ---------------------------------------

  //funcion para traer comentarios del firestore guardados
  //al inicializar la pagina, 
  async obtenerComentarios(juegoId: string) {
    const ref = collection(this.firestore, `juegos/${juegoId}/comentarios`);
    const { getDocs, orderBy, query } = await import('firebase/firestore');
    //ordenamos por fecha en forma descendiente
    const q = query(ref, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    //retornamos todos los valores en el tab 4
    return snapshot.docs.map(doc => doc.data());
  }


  async obtenerDatosUsuarioActual() {
    const user = this.auth.currentUser;
    if (!user) {
      console.log('No hay usuario logueado');
      return null;
    }

    const refUsuario = doc(this.firestore, "usuarios", user.uid);
    const snap = await getDoc(refUsuario);

    if (snap.exists()) {
      const datos = snap.data();
      console.log('📄 Datos del usuario:', datos);
      return datos;
    } else {
      console.log('El documento del usuario no existe');
      return null;
    }
  }

















  //pestañas favoritos











  //Esto sera para llamar a los objetos guardados en el firestore
  obtenerFavoritos() {
    const user = this.auth.currentUser;
    if (!user) {
      console.log('No hay ningun usuario logueado');
      return ;
    }
  
    const refUsuario = doc(this.firestore, "favoritos", user.uid);

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

  //funcion para eliminar juego del firestore o de la lista de favoritos
  async eliminarJuego(idJuego: string) {
      const user = this.auth.currentUser;
      if(!user) {
        console.log('No hay usuario logueado');
        return;
      }

    const refUsuario = doc(this.firestore, "favoritos", user.uid);
      const docSnap = await getDoc(refUsuario);

      if(docSnap.exists()) {
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