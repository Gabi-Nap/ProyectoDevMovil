import { Component, OnInit } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { AuthService } from '../auth/authService';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore'
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {
  usuario: any = null;
  fotoPerfil: string | null = null;
  // -----
  firestore = inject(Firestore);
  usuarioID: any = '';
  email: string = '';
  uid: string = '';
  sexo: any = '';
  datos: any = {};
  constructor(private auth: Auth, private authService: AuthService, private router: Router) {
  }

  cerrarSesion() {
    signOut(this.auth);
    this.usuario = null
    this.router.navigate(['/login'])
    console.log('sesion cerrada')
  }
  estadoCargado() {
    if (this.authService.usuarioCredencial) {
      const user = this.authService.usuarioCredencial.user;
      const datosUsuario = {
        email: user.email,
        uid: user.uid
      };
      this.datos.push(datosUsuario);
    }
  }
  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.usuario = user;
        await this.cargarDatosUsuario(user.uid);;
      }
    });
  }








  async cargarDatosUsuario(uid: string) {
    const docRef = doc(this.firestore, 'usuarios', uid);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      this.datos = data;
      this.fotoPerfil = data['fotoURL'] || 'assets/icon/avatar.png';
    } else {
      this.datos = {
        email: this.usuario?.email,
        uid: this.usuario?.uid,
      }
    }
  }










  async subirFotoPerfil(event: any) {
      const file = event.target.files[0];
      if (!file || !this.usuario) return;

      const storage = getStorage();
      const storageRef = ref(storage, `perfil/${this.usuario.uid}.jpg`);

      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      // Guardar en Firestore
      const docRef = doc(this.firestore, 'usuarios', this.usuario.uid);
      await setDoc(
        docRef,
        { fotoURL: url, email: this.usuario.email, uid: this.usuario.uid },
        { merge: true });

      this.fotoPerfil = url;
      await this.cargarDatosUsuario(this.usuario.uid);
      console.log('Foto de perfil actualizada');
    }





    irAFavoritos() {
      this.router.navigate(['/tabs/favoritos'])
    }




  }