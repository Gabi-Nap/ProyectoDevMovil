import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { __param } from 'tslib';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  /**
   * @function login
   * @description Inicia sesión en Firebase Authentication usando email y contraseña.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} password - Contraseña del usuario.
   * @return {Promise<UserCredential>} - Promesa que se resuelve con las credenciales del usuario si el login es exitoso.
   */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * @function register
   * @description Registra un nuevo usuario en Firebase Authentication con email y contraseña.
   * @param {string} email - Correo electrónico del nuevo usuario.
   * @param {string} password - Contraseña del nuevo usuario.
   * @return {Promise<UserCredential>} - Promesa que se resuelve con las credenciales del usuario creado.
   */
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  /*r
   * @function logout
   * @description Cierra la sesión del usuario actual en Firebase Authentication.
   * @return {Promise<void>} - Promesa que se resuelve cuando el usuario ha cerrado sesión.
   */
  logout() {
    return this.auth.signOut();
  }
  /**
   * @function guardarUsuario
   * @description Guarda o actualiza los datos del usuario en la colección `usuarios` de Firestore.
   * @param {string} uid - Identificador único del usuario (UID de Firebase).
   * @param {any} datos - Objeto con la información del usuario a guardar.
   * @return {Promise<void>} - Promesa que se resuelve cuando los datos se guardan correctamente.
   */
  async guardarUsuario(uid: string, datos: any) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    return await setDoc(ref, datos);
  }
  /**
   * @function isLoggedIn
   * @description Verifica si hay un usuario actualmente autenticado en Firebase.
   * @return {boolean} - Devuelve true si el usuario está autenticado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
}
