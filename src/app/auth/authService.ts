import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '@angular/fire/auth';

// import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
// import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Registro
  register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // Logout
  logout() {
    return this.auth.signOut();
  }
  async guardarUsuario(uid: string, datos: any) {
    const ref = doc(this.firestore, `usuarios/${uid}`);
    return await setDoc(ref, datos);
  }

  
}
