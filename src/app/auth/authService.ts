
import { signInWithEmailAndPassword, Auth } from '@angular/fire/auth';
import { doc, setDoc, getDoc,addDoc, collection, Timestamp } from '@angular/fire/firestore';
import { ref, uploadBytes, getDownloadURL, Storage } from '@angular/fire/storage';
import { Firestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { deleteDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  usuarioCredencial: any;
  favoritos: any[] = [];
  listaFavoritos: any[] = [];
  
  constructor(private auth: Auth, private toastController: ToastController, private firestore: Firestore, private storage: Storage) { }

  /**
  @function login
  @description guarda las credenciales del usuario luego de iniciar sesion
  @param email retorna un valor string
  @param password retorna un valor
  @returns retorna una promesa 
 */
  async login(email: string, password: string) {
    this.usuarioCredencial = await signInWithEmailAndPassword(this.auth, email, password);
    return this.usuarioCredencial;
  }

  /**
    @function getFavoritosDelUsuario
    @description llama a la lista de favoritos del usuario autenticado
    @param 
    @returns retorna una promesa
   */
  async getFavoritosDelUsuario(): Promise<any[]> {
    const user: any = this.auth.currentUser;
    const refUsuario = doc(this.firestore, 'favoritos', user.uid);
    const snap = await getDoc(refUsuario);
    if (!snap.exists()) {
      return [];
    }
    const data = snap.data();
    return data['juegos'] || [];
  }

  /**
  @function agregarFavoritos
  @description Agrega a una lista de favoritos del firestore, los datos del juego
  @param idDelJuego tipo string
  @param nombreJuego tipo string
  @param backgroundImage tipo string
  @returns retorna una promesa
 */
  async agregarFavoritos(idDelJuego: string | number, nombreJuego: string, backgroundImage: string): Promise<void> {
    const user: any = this.auth.currentUser;
    if (!user) {
      console.error('⚠️ No hay usuario logueado.');
      return;
    }

    const refUsuario = doc(this.firestore, "favoritos", user.uid, "juegos", String(idDelJuego));

    await setDoc(refUsuario, {
      id: idDelJuego,
      nombre: nombreJuego,
      background_image: backgroundImage
    });
  }

  /**
  @function quitarDeFavoritos
  @description Elimina de la lista de firestore los datos del juego seleccionado
  @param idDelJuego tipo string
  @param nombreJuego tipo string
  @param backgroundImage tipo string
  @returns retorna una promesa
 */
  async quitarDeFavoritos(idDelJuego: string | number): Promise<void> {
    const user: any = this.auth.currentUser;
    if (!user) {
      console.error('⚠️ No hay usuario logueado.');
      return;
    }

    const refUsuario = doc(this.firestore, "favoritos", user.uid, "juegos", String(idDelJuego));
    await deleteDoc(refUsuario);
  }

  /**
  @function esFavorito
  @description guarda en una variable la lista de los juegos favoritos
  @param idJuego tipo string
  @returns retorna una promesa
 */
  async esFavorito(idJuego: string): Promise<boolean> {
    const favoritos = await this.getFavoritosDelUsuario();
    return favoritos.some((juegoFavorito: any) => juegoFavorito.id === idJuego);
  }

  /**
  @function subirComentario
  @description sube el comentario con los datos al storage y firestore
  @param juegoId tipo string
  @param comentario tipo string
  @param imagen tipo file || null
  @returns retorna una promesa
 */
  async subirComentario(juegoId: string, comentario: string, imagen: File | null) {
    const user: any = this.auth.currentUser;

    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    const userSnap = await getDoc(userRef);
    let nombreUsuario = "Usuario desconocido";
    if (userSnap.exists()) {
      const userData = userSnap.data();
      nombreUsuario = userData['nombreUsuario'] || nombreUsuario;
    }
    let imageUrl = '';
    if (imagen) {
      const imageRef = ref(this.storage, `comentarios/${user.uid}/${Date.now()}_${imagen.name}`);
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

  /**
  @function obtenerComentarios
  @description funcion para traer los comentarios del firestore
  @param juegoId tipo string
  @returns retorna una promesa
 */
  async obtenerComentarios(juegoId: string) {
    const referencia = collection(this.firestore, `juegos/${juegoId}/comentarios`);
    const ordenDeComentarios = query(referencia, orderBy('fecha', 'desc'));
    const snapshot = await getDocs(ordenDeComentarios);
    return snapshot.docs.map(doc => doc.data());
  }

  /**
  @function mostrarToast
  @description funcion para crear cartel de informacion en caso de succesfull o failed
  @param mensaje tipo string
  @param color tipo string
  @returns retorna una promesa
 */
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: color,
      icon: color === 'success' ? 'checkmark-circle' : 'alert-circle'
    });
    await toast.present();
  }

  /**
    @function isLoggedIn
    @description para saber si estamos logueados para activar el guard
    @param 
    @returns retorna un boolean
   */
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}

