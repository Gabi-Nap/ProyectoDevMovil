import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { environment } from '../../environments/environment'
import { initializeApp } from 'firebase/app';
import { AuthService } from '../auth/authService'
import { Auth} from '@angular/fire/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email :string= '';
  password :string= '';
  mostrarPassword: boolean = false;
  errorMessage: string = '';
  constructor(private router: Router, private cierro: AuthService,private authService:Auth) { }

  async login() {
    try {
     await this.cierro.login(this.email,this.password);
     console.log('Te conectaste bien')
    } catch (error) {      
      this.errorMessage = 'Email o contraseña incorrectos';
    }
  }
  sesionCerrada() {
    this.cierro.cerrarSesion()
    console.log('sesion cerrada');
  }
  verConsola() {
    const auth = this.authService;
    onAuthStateChanged(auth, (user) => {
      if (user) {
      
        const uid = user.uid;
        console.log(uid)
        
      } else {
        console.log('el usuario se deslogueo')
        // User is signed out
        // ...
      }
    });

  }
  ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }


}
