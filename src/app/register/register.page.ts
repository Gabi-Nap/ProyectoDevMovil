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
  nombreUsuario: string = '';
  sexo: string = '';
  errorMessage: string = '';
  // ---------------
  async register() {
    
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }
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
      this.errorMessage = error.message;
      console.log('no se pudo registrar');
    }
  }

}
