import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';




import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { environment } from '../../environments/environment'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { Auth } from '@angular/fire/auth'

import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { provideFirebaseApp } from '@angular/fire/app';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  firestore = inject(Firestore);
  constructor(public router: Router, private auth: Auth) { }

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombre: string = '';
  nacionalidad: string = '';
  errorMessage: string = '';
  // ---------------
  async register() {
    const auth = this.auth;
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
    try {
      const credencialUsuario = await createUserWithEmailAndPassword(auth, this.email, this.password);//Aca crearemos un usuario agarrando el correo y la contraseña
      const uid = credencialUsuario.user.uid;//Guarda el UID del usuario en la variable
      //funcion para guardar datos del usuario al registrarse en firestore
      await setDoc(doc(this.firestore, "usuarios", uid), {
        nombre: this.nombre,
        nacionalidad: this.nacionalidad,
        email: this.email
      });
      console.log('usuario registrado correctamente', uid)
    } catch (error: any) {

      this.errorMessage = error.message;
      console.log('no se pudo registrar');

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
