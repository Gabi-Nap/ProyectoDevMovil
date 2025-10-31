import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from "firebase/auth";
import { AuthService } from '../auth/authService'
import { Auth } from '@angular/fire/auth'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  email: string = '';
  password: string = '';
  mostrarPassword: boolean = false;

  constructor(private router: Router, private authService: AuthService, private auth: Auth) { }

  /**
  @function login
  @description llama servicio de autenticacion y tiene validaciones para poder authenticarse
  @param
  @returns retorna una promesa
 */
  async login() {
    if (!this.email || !this.password) {
      this.authService.mostrarToast('Por favor, llene todos los campos', 'warning');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.authService.mostrarToast('El formato del correo no es válido', 'warning');
      return;
    }
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/apps/inicio'])      
      this.authService.mostrarToast('Inicio de sesion exitoso', 'success')
    }
     catch (error: any) {
      this.authService.mostrarToast('¡error al ingresar datos!', 'warning')
    }
  }

  /**
  @function sesionCerrada
  @description se encarga de cerrar sesion eliminando las credenciales del authenticado
  @param
  @returns
 */
  sesionCerrada() {
    signOut(this.auth);    
  }



}
