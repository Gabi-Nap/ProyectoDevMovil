import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, getAuth, signOut } from '@angular/fire/auth';

// import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@angular/fire/auth';
// import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

import { Firestore, doc, setDoc, getDoc, updateDoc, getFirestore } from '@angular/fire/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment';
import { Auth} from '@angular/fire/auth'


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private authService:Auth) { }

  // Login
  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.authService, email, password);
  }

  // Registro
  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.authService, email, password);
  }

  // Logout

  async cerrarSesion() {
    return await signOut(this.authService)
      
  }
}