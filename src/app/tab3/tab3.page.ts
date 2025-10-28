import { Component, OnInit } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { AuthService } from '../auth/authService';
import { doc, getDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore'
import { inject } from '@angular/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {
  firestore = inject(Firestore);
  credencialUsuario: string = '';
  usuarioID: any = '';
  email: string = '';
  uid: string = '';
  nacionalidad: any = '';
  datos: any[] = [];
  constructor(private auth: Auth, private authService: AuthService, private router: Router) {
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    console.log('sesion cerrada')
  }
  apretarEstado() {
    if (this.authService.usuarioCredencial) {
      const user = this.authService.usuarioCredencial.user;
      const datosUsuario = {
        email: user.email,
        uid: user.uid
      };
      this.datos.push(datosUsuario);
      console.log(this.datos)
      console.log('Datos guardados:', this.datos);
    } else {
      console.log('Nadie logueado, no hay credenciales');
    }
    console.log(this.authService.favoritos)
  }
  ngOnInit() {
    this.apretarEstado()
  }
  irAFavoritos() {
    this.router.navigate(['/tabs/favoritos'])
  }



}