import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { EmailAuthProvider, onAuthStateChanged, reauthenticateWithCredential, signOut, updatePassword } from "firebase/auth";
import { AuthService } from '../auth/authService';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Firestore, } from '@angular/fire/firestore'
import { Router } from '@angular/router';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { CuentaService } from '../services/cuenta';
import { AlertController} from '@ionic/angular';
import { Storage } from '@angular/fire/storage';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {

  usuario: any = null;
  fotoPerfil: string | null = null;
  usuarioID: any = '';
  email: string = '';
  uid: string = '';
  nacionalidad: any = '';
  datos: any = {};

  constructor(private storage: Storage,private firestore: Firestore,private alertCtrl: AlertController, private auth: Auth, private authService: AuthService, private router: Router, private cuentaEliminadaServicio: CuentaService) {}
  
  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.usuario = user;
        await this.cargarDatosUsuario(user.uid);;
      }
    });
  }
  /**
  @function cerrarSesion
  @description cierra sesion del authenticado
  @param 
  @returns 
 */
  cerrarSesion() {
    signOut(this.auth);
    this.usuario = null
    this.router.navigate(['/login'])
    this.authService.mostrarToast('sesion cerrada', 'danger')
  }
  /**
  @function abrirAlertaEliminarCuenta
  @description crea una alerta permitiendonos eliminar una cuenta
  @param 
  @returns retorna una promesa
  */
  async abrirAlertaEliminarCuenta() {
  const alert = await this.alertCtrl.create({
    header: 'Eliminar cuenta',
    message: 'Esta acción es irreversible. Ingresa tu contraseña para confirmar.',
    inputs: [
      {
        name: 'password',
        type: 'password',
        placeholder: 'Ingresa tu contraseña',
      }
    ],
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
      },
      {
        text: 'Eliminar definitivamente',
        role: 'confirm',
        cssClass: 'danger',
        handler: async (data) => {
          const password = data.password;
          if (!password) {
            this.authService.mostrarToast('Por favor, ingresa tu contraseña.');
            return false;
          }
          await this.eliminarCuenta(password);
          return true;
        },
      },
    ],
  });
  await alert.present();
}
  /**
  @function mostrarIonAlertaSimple
  @description Muestra una alerta simple en casos de edicion de datos
  @param titulo debe ser tipo string
  @param mensaje debe ser tipo string
  @param onOk debe ser tipo void o null
  @returns retorna una promesa
  */
  private async mostrarIonAlertaSimple(titulo: string, mensaje: string, onOk?: () => void) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            if (onOk) onOk();
          },
        },
      ],
    });
    await alert.present();
  }

  
  /**
  @function cargarDatosUsuario
  @description Para cargar datos del usuario desde firestore como nombre, nacionalidad e imagen
  @param uid debe ser tipo string
  @returns 
  */
  async cargarDatosUsuario(uid: string) {
    const docRef = doc(this.firestore, 'usuarios', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      this.datos = data;
      this.fotoPerfil = data['fotoURL'] || 'assets/icon/hombre-avatar.png';
    } else {
      this.datos = {
        email: this.usuario?.email,
        uid: this.usuario?.uid,
      }
    }
  }
  
  /**
  @function subirFotoPerfil
  @description Para subir una imagen y guardarla o actualizarla
  @param event debe ser tipo any
  @returns retorna una promesa
  */
  async subirFotoPerfil(event: any) {
    const file = event.target.files[0];
    if (!file || !this.usuario) return;

    const storageRef = ref(this.storage, `perfil/${this.usuario.uid}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const docRef = doc(this.firestore, 'usuarios', this.usuario.uid);    
    await setDoc(docRef,{
      fotoURL: url,
      email: this.usuario.email,
      uid: this.usuario.uid
    },   
    { merge: true });
    this.fotoPerfil = url;
    await this.cargarDatosUsuario(this.usuario.uid);    
    await this.authService.mostrarToast('Foto de perfil actualizada ', 'success');
  }
  /**
  @function eliminarCuenta
  @description accion para Eliminar cuenta del usuario y acciones
  @param password debe ser tipo string
  @returns retorna una promesa
  */
  async eliminarCuenta(password: string) {
    try {      
      const user :any= this.auth.currentUser;         
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await this.cuentaEliminadaServicio.eliminarCuentaDefinitivamente();      
      await this.mostrarIonAlertaSimple(
        'Cuenta eliminada',
        'Tu cuenta fue eliminada correctamente ✅',
        async () => {
          this.router.navigateByUrl('/login', {replaceUrl:true});
        }
      );      
    this.router.navigateByUrl('/login', { replaceUrl: true });
    } 
    catch (err: any) {      
      await this.mostrarIonAlertaSimple(
        'Error al eliminar',
        'Contraseña incorrecta de la cuenta',
        async () => {          
          this.router.navigate(['/apps/perfil']);
        }
      );    
    }
  }
  

   /**
  @function abrirCambioPassword
  @description Accion para poder cambiar de contraseña y validaciones
  @param
  @returns retorna una promesa
  */
  async abrirCambioPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar contraseña',
      subHeader: 'Por seguridad, confirma tu contraseña actual',
      inputs: [
        {
          name: 'actual',
          type: 'password',
          placeholder: 'Contraseña actual',
        },
        {
          name: 'nueva',
          type: 'password',
          placeholder: 'Nueva contraseña',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Actualizar',
          role: 'confirm',
          handler: async (data) => {
            const { actual, nueva } = data;
            if (!actual || !nueva) {
              this.mostrarIonAlertaSimple('Error', 'Debes completar ambos campos.');
              return false;
            }
            if(actual == nueva){
              this.mostrarIonAlertaSimple('Error','¡Las contraseñas no deben ser iguales!');
              return ;
            }
            await this.cambiarPassword(actual, nueva);
            return true;
          },
        },
      ],
    });
    
    await alert.present();
  }

  /**
  @function cambiarPassword
  @description Accion para cambiar de contraseña del usuario autenticado
  @param passwordActual debe ser tipo string
  @param nuevaPassword debe ser tipo string
  @returns retorna una promesa
  */
  async cambiarPassword(passwordActual: string, nuevaPassword: string) {
    try {            
      const user = this.auth.currentUser;      
      if (!user || !user.email) {
        this.mostrarIonAlertaSimple('Error', 'No hay usuario logueado.');
        return;
      }
      const cred = EmailAuthProvider.credential(user.email, passwordActual);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, nuevaPassword);

      this.mostrarIonAlertaSimple('Contraseña actualizada', '¡Tu contraseña fue cambiada correctamente!');
    }
     catch (err: any) {
      this.mostrarIonAlertaSimple('Error', 'La contraseña actual es incorrecta.');
    }
  }
/**
  @function editarCampo
  @description Accion para editar los datos privados del usuario
  @param campo debe ser tipo string 
  @param valorActual debe ser tipo string
  @returns retorna una promesa
  */
  async editarCampo(campo: string, valorActual: string) {
    const alert = await this.alertCtrl.create({
      header: `Editar ${campo}`,
      inputs: [
        {
          name: 'nuevoValor',
          type: 'text',
          value: valorActual || '',
          placeholder: `${campo}`,
        },
      ],
      buttons: [
        { 
          text: 'Cancelar',
          role: 'cancel' 
        },
        {
          text: 'Guardar',          
          handler: async (data) => {
            const nuevoValor = data.nuevoValor?.trim();            
            if (!nuevoValor) {
              this.mostrarIonAlertaSimple('Error', `El dato no puede estar vacío`);
              return false;
            }          
            const user = this.auth.currentUser;
            if (!user) return;            
            const ref = doc(this.firestore, 'usuarios', user.uid);
            await updateDoc(ref, { [campo]: nuevoValor });
            this.datos[campo] = nuevoValor;
            this.mostrarIonAlertaSimple('Actualizado', `El dato fue actualizado correctamente ✅`);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }
}