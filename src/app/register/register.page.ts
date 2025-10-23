import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../auth/authService';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false,
})
export class RegisterPage {
  constructor(
    private auth: Auth,
    private authService: AuthService,
    public router: Router,
    private alertController: AlertController
  ) {}
  email = '';
  password = '';
  nombre = '';
  sexo = '';

  async register() {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        this.email,
        this.password
      );
      const alert = this.alertController.create({
        header: 'registro exitoso',
        message:
          'Tu cuenta fue creada Correctamente . ahora podeis iniciar sesion.',
        buttons: ['OK'],
      });

      await (await alert).present();
      this.router.navigateByUrl('/login');
      //this.router.navigate(['/login']);

      const uid = userCredential.user.uid;

      // Guardar datos extras en Firestore
      await this.authService.guardarUsuario(uid, {
        nombre: this.nombre,
        sexo: this.sexo,

        password: this.password,

        email: this.email,
      });
    } catch (error: any) {
      console.error(error);

      let message = 'Ocurrió un error al registrarte.';

      if (error.code === 'auth/email-already-in-use') {
        message = 'Este correo ya está registrado.';
        this.router.navigateByUrl('/login');
      } else if (error.code === 'auth/invalid-email') {
        message = 'El correo ingresado no es válido.';
      } else if (error.code === 'auth/weak-password') {
        message = 'La contraseña debe tener al menos 6 caracteres.';
      }

      const alert = await this.alertController.create({
        header: 'Error',
        message,
        buttons: ['OK'],
      });

      await alert.present();
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
