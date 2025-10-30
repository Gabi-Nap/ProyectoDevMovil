import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { onAuthStateChanged,signOut } from "firebase/auth";
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
  //funcion para el boton de login, al apretarlo hace todas estas acciones
  async login() {
    //un if en caso de que se encuentre campos vacios en correo y contraseña, si ambos se encuentran con datos, hace la siguiente accion mas abajo
    if (!this.email || !this.password) {
      this.authService.mostrarToast('Por favor, llene todos los campos', 'warning');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.authService.mostrarToast('El formato del correo no es válido', 'warning');
      return;
    }
    //si todos los if se respetan y no toca ni un return de los de arriba, continua con el codigo de abajo
    try {
      //llama a la funcion login que esta en authService que sirve para loguearse, recibiendo como parametro email y password
      await this.authService.login(this.email, this.password);
      //una vez authenticados, navega al tabs 1 paginia principal
      this.router.navigate(['/apps/inicio'])
      //esta funcion mostrarToast esta en authService, sirve para mostrar un cartel pequeño en la app
      this.authService.mostrarToast('Inicio de sesion exitoso', 'success')
    }//En caso de que alla un error en la autenticacion, se saltara el 'try' y pasara al catch capturando el error y este se mostrara en pantalla
     catch (error: any) {
      //usamos la funcion del cartel para mostrar el error
      this.authService.mostrarToast('¡error al ingresar datos!', 'warning')
      console.log('error de conexion')//esto es para ver en la consola si funcionaba(lo borraremos)
    }
  }


  //funcion para cerrar sesion del usuario
  sesionCerrada() {
    //este siignOut es funcion propia de firebase que sirve para desloguear el usuario autenticado en la app
    //lo que ven ahi el 'auth' es como una variable propia de firebase, esta se llama con this desde el constructor
    //si apretamos en cerrar sesion en la app, veran que 'auth' es la que trae los datos del usuario autenticado y no nos traera nada pero si nos logueamos, 'auth' automaticamente va a tener los datos del usuario autenticado
    signOut(this.auth);
    console.log('sesion cerrada');//borraremos esto, solo nos avisa si ya cerramos sesion
  }
  // ---------------------------
  //¡momentaneo! ver si estamos logueados mostrandonos las credenciales
  //pueden jugar con la consola para llamar si 'auth' tiene datos al loguearse o desloguearse
  //se va a borrar esta funcion ya que es de prueba, se la pueden implementar a cualquier boton para probar y jugar
  verConsola() {
    const auth: any = this.authService;
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log(uid)
      } else {
        console.log('el usuario se deslogueo')
      }
    });
  }
  // ---------------------------
  //oculta la contraseña con icono de ojo mediante un boton de la aplicación
  ocultarContra() {
    this.mostrarPassword = !this.mostrarPassword;
  }


}
