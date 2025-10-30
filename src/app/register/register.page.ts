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
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  firestore = inject(Firestore);
  alertController: any;
  constructor(public router: Router, private auth: Auth) { }

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
    mostrarPassword: boolean = false;
  mostrarConfirmPassword: boolean = false;
  nombreUsuario: string = '';
  sexo: string = '';
  errorMessage: string = '';
  // ---------------
  //Validar antes de registrar
  validarRegister() {
    //Limpiar mensajes de error anteriores
    this.errorMessage = '';

    //Validar nombre de usuario
    if (!this.nombreUsuario) {
      this.errorMessage = 'El nombre de usuario es requerido';
      return;
    }

    //Validar nacionalidad ------------------ cambiar this.sexo despues
    if (!this.sexo) {
      this.errorMessage = 'La nacionalidad es requerida';
      return;
    }

    //Validar email
    if (!this.email) {
      this.errorMessage = 'El email es requerido';
      return;
    }

    //Validar formato de email
    if (!this.email.includes('@') || !this.email.includes('.')) {
      this.errorMessage = 'Ingresa un email válido (debe tener @ y .)';
      return;
    }

    //Validar contraseña
    if (!this.password) {
      this.errorMessage = 'La contraseña es requerida';
      return;
    }

    //Validar longitud de contraseña
    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    //Validar confirmación de contraseña
    if (!this.confirmPassword) {
      this.errorMessage = 'Confirma tu contraseña';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    //Hacer register
    this.register();
  }
  async register() {
    try {
      const credencialUsuario = await createUserWithEmailAndPassword(this.auth, this.email, this.password);//Aca crearemos un usuario agarrando el correo y la contraseña
      const uid = credencialUsuario.user.uid;
       //Guarda el UID del usuario en la variable
      //funcion para guardar datos del usuario al registrarse en firestore

      await setDoc(doc(this.firestore, "usuarios", uid), {
        nombre: this.nombreUsuario,
        sexo: this.sexo,
        
        email: this.email
        
      });
      console.log('usuario registrado correctamente', uid)
      this.router.navigate(['/login'])
      
    } catch (error: any) {
      if (error.code==='auth/email-already-in-use') {
        this.errorMessage = 'Este email ya está en uso';
      }
      else{
        this.errorMessage = 'Error al registrar. Intenta nuevamente.';
      }
      console.log('no se pudo registrar');
    }
  }
ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }
  ocultarConfirmContra() {
    this.mostrarConfirmPassword = !this.mostrarConfirmPassword;
  }
}
