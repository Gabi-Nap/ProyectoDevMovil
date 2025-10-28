import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
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
  constructor(private router: Router, private authService: AuthService,private auth:Auth) { }

  async login() {
    try {
     await this.authService.login(this.email,this.password);
     this.router.navigate(['/tabs/tab1'])
     console.log(this.authService.usuarioCredencial.user.uid)
     
    } catch (error:any) {      
      this.errorMessage = 'Email o contraseña incorrectos';
      console.log('error de conexion')
    }
  }
  //cerrar sesion
  sesionCerrada() {
    signOut(this.auth);
    console.log('sesion cerrada');
  }
  // ---------------------------
  //¡momentaneo! ver si estamos logueados mostrandonos las credenciales
  verConsola() {
    const auth:any = this.authService;
    onAuthStateChanged(auth, (user) => {
      if (user) {      
        const uid = user.uid;
        console.log(uid)        
      } else {
        console.log('el usuario se deslogueo')        
      }
    });
  }
  // ---------------------------
  //oculta la contraseña con icono de ojo
  ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }


}
