import { Component, OnInit } from '@angular/core';
import { AuthService } from '../authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  email = '';
  password = '';

  constructor(private authServise: AuthService, private router: Router) {}

  ngOnInit() {}

  /**
   * @function login
   * @description Intenta autenticar al usuario utilizando el servicio de autenticación (`AuthService`)
   * y redirige a la página principal si el inicio de sesión es exitoso.
   * En caso de error, muestra un mensaje en la consola.
   * @return {void}
   */
  login() {
    try {
      const user = this.authServise.login(this.email, this.password);
      console.log('login correcto', user);
      this.router.navigate(['/tabs/tab1']); // Redirige al contenido principal
    } catch (err) {
      console.error('Error al iniciar sesion', err);
    }
  }
}
