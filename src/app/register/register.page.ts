import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../auth/authService';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {

  constructor(private auth: Auth, private authService: AuthService, public router: Router) { }
  email = '';
  password = '';
  nombre = '';
  sexo = '';

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const uid = userCredential.user.uid;

      // Guardar datos extras en Firestore
      await this.authService.guardarUsuario(uid, {
        nombre: this.nombre,
        sexo: this.sexo,

        password: this.password,

        email: this.email
        
      });
      this.router.navigate(['/tabs/tab3']);
      

    } catch (error) {
      console.error(error);
    }
  }




  // async register() {
  //   try {
  //     const user = await this.authService.register(this.email, this.password);
  //     console.log('Usuario registrado:', user);
  //     alert('¡Registro exitoso!');
  //   } catch (err) {
  //     console.error(err);
  //     alert('Error en registro: ' + err);
  //   }
  // }

}
