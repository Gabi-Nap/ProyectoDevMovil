import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { Auth } from '@angular/fire/auth'
import { Firestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/authService';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  

  confirmPassword: string = '';
  nombreCompleto: string = '';
  nombreUsuario: string = '';
  nacionalidad: string = '';
  errorMessage: string = '';
  password: string = '';
  email: string = '';
  passwordsNoCoinciden = false;

  constructor(public router: Router, private auth: Auth, private authService: AuthService,private firestore: Firestore) { }
  /**
  @function Register
  @description contiene validaciones y registra al usuario
  @param
  @returns retorna una promesa
 */
  async register() {
    if (!this.nombreUsuario || !this.nombreCompleto || !this.nacionalidad || !this.email  || !this.password  || !this.confirmPassword) {
      this.authService.mostrarToast('Por favor completa todos los campos', 'warning');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.authService.mostrarToast('El formato del correo no es válido', 'warning');
      return;
    }
    if (this.password !== this.confirmPassword) {      
      this.authService.mostrarToast('Las contraseñas no coinciden', 'warning');
      return;
    }    
    try {
      const credencialUsuario = await createUserWithEmailAndPassword(this.auth, this.email, this.password);
      const uid = credencialUsuario.user.uid;
      await setDoc(doc(this.firestore, "usuarios", uid), {
        nombreUsuario: this.nombreUsuario,
        nacionalidad: this.nacionalidad,
        nombreCompleto: this.nombreCompleto,
        email: this.email
      });
      this.authService.mostrarToast('Usuario registrado correctamente', 'success')
      this.router.navigate(['/login'])
    }
    catch (error: any) {
      this.errorMessage = error.message;                              
      this.authService.mostrarToast('Error al registrar usuario', 'danger')
      return;
    }
  }
}