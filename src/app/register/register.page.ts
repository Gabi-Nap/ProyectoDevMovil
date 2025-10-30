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
  
  constructor(public router: Router, private auth: Auth, private authService: AuthService,private firestore: Firestore) { }
  //Campos que se ejecutan al mismo tiempo y lo que escribamos en estos, se escribiran en los campos de registro gracias al [(ngModel)]
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  nombreCompleto: string = '';
  nombreUsuario: string = '';
  nacionalidad: string = '';
  errorMessage: string = '';
  passwordsNoCoinciden = false;
  // ---------------------Boton de registrarse en la app------------------------------
  async register() {
    //if para validar que se llenen todos los campos
    if (!this.nombreUsuario || !this.nombreCompleto || !this.nacionalidad || !this.email  || !this.password  || !this.confirmPassword) {
      this.authService.mostrarToast('Por favor completa todos los campos', 'warning');
      console.log('error campo vacio')
      return;
    }
    // if para pedir que el email que se coloque sea en verdad un email con su @ y su .com
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.authService.mostrarToast('El formato del correo no es válido', 'warning');
      return;
    }
    // if para verificar que las contraseñas sean iguales al confirmar
    if (this.password !== this.confirmPassword) {      
      this.authService.mostrarToast('Las contraseñas no coinciden', 'warning');
      return;
    }    
    //Aca empieza el registro cuando todo esta ok!
    try {
      //Aca crearemos un usuario agarrando el correo y la contraseña y el resultado lo guardamos en esa variable
      const credencialUsuario = await createUserWithEmailAndPassword(this.auth, this.email, this.password);//con esta funcion que viene del firestore, facilmente registra un usuario
      //Aca guardamos el uid del usuario registrado
      const uid = credencialUsuario.user.uid;
      //Guarda el UID del usuario en la variable

      // El setDoc es de firestore, lo que hace es crear en firestore los datos que guardaremos al registrar los datos de un usuario
      //tienen que abrir firestore y crear la base de datos para ver los datos, conviene hacerlo para entender como funciona
      // en 'this.firestore' se refiere a nuestro firestore osea la pagina, 'usuarios' sera el campo donde guardaremos los datos, 'uid' sera el uid propio que se genera de un usuario registrado
      await setDoc(doc(this.firestore, "usuarios", uid), {
        nombreUsuario: this.nombreUsuario,
        nacionalidad: this.nacionalidad,
        nombreCompleto: this.nombreCompleto,
        email: this.email

      });
      //Una vez que los usuarios se registran arriba y se guarde todos los datos, hace lo que sigue.....      
      console.log('usuario registrado correctamente', uid)//esto es para ver lo que trae uid, que seria el uid propio del usuario (lo borraremos solo es una muestra para ver que trae)
      //Cuando dice authService, trae la funcion del componente llamado authService que en este caso traeremos mostrarToast() que sencillamente este creara un cartel temporal que se ejecuta si nos registramos con exito, es un cartel verde y se puede reutilizar 
      this.authService.mostrarToast('Usuario registrado correctamente', 'success')//de esta funcion el primer parametro sera el mensaje que mostrara, y el segundo que dice 'success' sera el color, se puede cambiar por cualquiera de la pagina de ionic que hay 'danger','tertiary','light','dark'
      //usamos la funcion de router para que despues de ejecutar todo de arriba navegue directo a la pagina de login
      this.router.navigate(['/login'])
    } //Este catch se ejecuta en caso de que al apretar registrar, este falla en algo asi que muestra que deberia aparecer en caso de error
    catch (error: any) {
      this.errorMessage = error.message;                        
      console.log('------------------')
      console.log('no se pudo registrar');
      console.log('------------------')
      console.log(this.errorMessage)
      this.authService.mostrarToast('Error al registrar usuario', 'danger')
      return;
    }
  }


}