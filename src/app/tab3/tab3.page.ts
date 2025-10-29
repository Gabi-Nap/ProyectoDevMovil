import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AuthService } from '../auth/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false,
})
export class Tab3Page {
  email = '';
  password = '';

  /**
   * @constructor
   * @description
   * Inyecta los servicios necesarios para la autenticación y navegación del usuario.
   *
   * @param {AuthService} authService - Servicio encargado de manejar el login, registro y logout del usuario.
   * @param {Router} router - Servicio de enrutamiento para redirigir entre páginas de la aplicación.
   */

  constructor(private authService: AuthService, private router: Router) {}

  /**
   * @function logout
   * @description
   * Cierra la sesión del usuario actual y redirige a la pantalla de login.
   *
   * @async
   * @returns {Promise<void>} - Promesa que se resuelve una vez completado el cierre de sesión.
   */

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }

  /**
   * @function login
   * @description
   * Inicia sesión con el correo y contraseña ingresados por el usuario.
   * Si el login es exitoso, redirige a la página principal (`/tabs/tab1`).
   * En caso de error, muestra el error por consola.
   *
   * @async
   * @returns {Promise<void>} - Promesa que se resuelve una vez completado el proceso de login.
   */

  async login() {
    try {
      const user = await this.authService.login(this.email, this.password);
      console.log('Login correcto:', user);
      this.router.navigate(['/tabs/tab1']);
    } catch (err) {
      console.error(err);
    }
  }
}
