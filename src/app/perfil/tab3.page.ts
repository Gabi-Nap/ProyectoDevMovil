import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { EmailAuthProvider, getAuth, onAuthStateChanged, reauthenticateWithCredential, signOut, updatePassword } from "firebase/auth";
import { AuthService } from '../auth/authService';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore'
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { CuentaService } from '../services/cuenta';
import { AlertButton, AlertController, AlertInput, ToastController } from '@ionic/angular';



@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: false
})
export class Tab3Page implements OnInit {
  //es un input que obtendra el alert
  alertInputs: AlertInput[] = [
    {
      name: 'password',
      type: 'password',
      placeholder: 'Ingresa tu contraseña',
    }
  ];
  //es un boton para el alert
  alertButtons: AlertButton[] = [
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
  ];
  usuario: any = null;
  fotoPerfil: string | null = null; //foto de perfil guardada
  usuarioID: any = '';
  email: string = '';
  uid: string = '';
  nacionalidad: any = '';
  datos: any = {};
  constructor(private firestore: Firestore,private alertCtrl: AlertController, private auth: Auth, private authService: AuthService, private router: Router, private cuentaEliminadaServicio: CuentaService) {}
  //Esta funcion sera para el boton de cerrar sesion, al presionarlo desloguea al usuario
  cerrarSesion() {
    signOut(this.auth);
    this.usuario = null
    //al cerrar sesion navega al login
    this.router.navigate(['/login'])
    console.log('sesion cerrada')
    //utiliza la funcion del authService 'mostrarToast()' que mostrara un cartelito que diga sesion cerrada
    this.authService.mostrarToast('sesion cerrada', 'danger')
  }
  //ngOnInit que traera funciones que nos serviran para traer datos del authenticado en los campos requeridos
  ngOnInit() {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        this.usuario = user;
        await this.cargarDatosUsuario(user.uid);;
      }
    });
  }
  //----------------Esta sera la funcion que se hara para mostrar un cuadrado con alerta, la llamaremos en las funciones de arriba-------------
  //-----------------recibira 3 parametros que seran el titulo, el mensaje y la accion que hara presionando el boton OK-----------------------
  private async mostrarIonAlertaSimple(titulo: string, mensaje: string, onOk?: () => void) {//el 3er parametro puede ser null o no
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

  //--------------------Esta sera la funcion para traer los datos del usuario ya sea nombres o fotos de la base de datos con solo el UID----------------
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
  //--------------------------------Esta sera la funcion para subir una foto de perfil en el usuario-------------------------------
  async subirFotoPerfil(event: any) {
    const file = event.target.files[0];
    if (!file || !this.usuario) return;

    const storage = getStorage();
    //Aca se direcciona la ubicacion de donde guardar en el storage la imagen subida
    const storageRef = ref(storage, `perfil/${this.usuario.uid}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    // Aca guardaremos la url de la imagen en firestore, para luego llamarlo en algun momento
    const docRef = doc(this.firestore, 'usuarios', this.usuario.uid);
    //El setDoc es la funcion de firestore que hara que se cree un campo que en nuestro caso sera la imagen
    await setDoc(docRef,{
      fotoURL: url,//Este campo sera el nuevo que se añada en el firestore
      email: this.usuario.email,//Esto hara que en el firestore tambien se guarde el email
      uid: this.usuario.uid //Esto tambien se añade al firestore, el uid propio del usuario
    },
    //este merge se utiliza para actualizar solo algunos campos sin borrar el resto
    { merge: true });

    this.fotoPerfil = url;//guardamos la url de la foto en esta variable

    //Utilizamos la funcion asincronica que esta arriba que traera la foto de perfil mediante el uid
    await this.cargarDatosUsuario(this.usuario.uid);
    //Aca utilizaremos la funcion para mostrar el cartel verde para informar que fue la foto actualizada
    await this.authService.mostrarToast('Foto de perfil actualizada ', 'success');

    console.log('Foto de perfil actualizada');
  }
  //-----------------------------------------------Funcion para el boton de eliminar cuenta-------------------------------------------
  async eliminarCuenta(password: string) {
    try {
      const auth = getAuth();
      const user :any= auth.currentUser;//------------------------->>>>>>>>>>>>>>>>      
      // Reautenticar antes de eliminar 
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Si reautenticación correcta → usara la funcion para eliminar todo que la traeremos del servicio que esta dentro de
      // services/cuenta.ts que se activara eliminando todo lo del usuario
      await this.cuentaEliminadaServicio.eliminarCuentaDefinitivamente();
      //Este sera un cuadradito para mostrar que la cuenta fue borrada
      await this.mostrarIonAlertaSimple(
        'Cuenta eliminada',
        'Tu cuenta fue eliminada correctamente ✅',
        async () => {
          // callback cuando toca OK
          //reedirijiremos al login automaticamente despues del OK
          this.router.navigateByUrl('/login', {replaceUrl:true});
        }
      );
      //luego de eliminar todo correctamente, reedirijiremos al login automaticamente
    this.router.navigateByUrl('/login', { replaceUrl: true });
    } //Este sera el catch que capturara el error en caso de que nos equivoquemos en la contraseña
    catch (err: any) {
      //Mostrara una alerta que nos dira que nos equivocamos en la contraseña
      await this.mostrarIonAlertaSimple(
        'Error al eliminar',
        'Contraseña incorrecta de la cuenta',
        async () => {
          // callback cuando toca OK
          this.router.navigate(['/apps/perfil']);
        }
      );
      console.error('Error al eliminar cuenta:', err);//Esto solo mostrara el error en la consola
    }
  }
  
  // ---------------------------------------------------Cambiar contraseña--------------------------------------------------
  //Boton que servira para cambiar de contraseña, lo primero que ara sera crear un alertCtrl con los datos que se mostraran
  async abrirCambioPassword() {
    const alert = await this.alertCtrl.create({
      header: 'Cambiar contraseña',
      subHeader: 'Por seguridad, confirma tu contraseña actual',
      inputs: [
        {
          name: 'actual',//lo usaremos luego, llamemoslo regalo1
          type: 'password',
          placeholder: 'Contraseña actual',
        },
        {
          name: 'nueva',//lo usaremos luego, llamemoslo regalo2
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
          //funcion que hara en caso de apretar actualizar
          handler: async (data) => {
            const { actual, nueva } = data;
            //si los campos estan vacios nos lo hara saber mostrando una alerta
            if (!actual || !nueva) {
              this.mostrarIonAlertaSimple('Error', 'Debes completar ambos campos.');
              return false;//estara en falso haciendo que al apretar OK no se salga del if hasta poner un dato
            }
            //En caso de que ponga los datos correctos, se ejecurala la siguiente funcion aceptando los parametros
            //Los parametros que utilizaremos sera regalo1 y regalo2 y se ejecutara, esta funcion esta abajo
            await this.cambiarPassword(actual, nueva);
            return true;//retorna true y termina toda esta funcionalidad continuando con lo demas
          },
        },
      ],
    });
    
    await alert.present();//Esto es lo que nos permitira abrir la caja de alerta
  }

  //---------------------------------------- Cambiar la contraseña en Firebase Auth---------------------------------
  async cambiarPassword(passwordActual: string, nuevaPassword: string) {
    try {
      // llamara las credenciales de autenticacion de nuestro usuario
      const auth = getAuth();
      const user = auth.currentUser;      
      if (!user || !user.email) {
        this.mostrarIonAlertaSimple('Error', 'No hay usuario logueado.');
        return;
      }

      // Reautenticar al usuario para poder verificar su autenticacion
      const cred = EmailAuthProvider.credential(user.email, passwordActual);
      await reauthenticateWithCredential(user, cred);

      // Llamara la funcion para actualizar la contraseña, esta sera un metodo propio de firebase para reemplazar la contraseña por la nueva
      await updatePassword(user, nuevaPassword);

      // Se muestra una alerta que diga  que la contraseña fue actualizada
      this.mostrarIonAlertaSimple('Contraseña actualizada', '¡Tu contraseña fue cambiada correctamente!');
    }//En caso de que capture un error al actualizar la contraseña, mostrara un mensaje
     catch (err: any) {
      this.mostrarIonAlertaSimple('Error', 'La contraseña actual es incorrecta.');
    }
  }
  //---------- -------------------------------EDITAR CAMPOS DE INFORMACION-------------------------------------------------
  //Funcion para un boton para editar los campos de informacion ya sea nombre, nombre de usuario o nacionalidad

  async editarCampo(campo: string, valorActual: string) {
    //Creara un nuevo campo de alert con los campos asignados
    const alert = await this.alertCtrl.create({
      header: `Editar ${campo}`,//el campo representara el tipo de dato que vamos a editar, como: nombre, nacionalidad
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
          //la funcion que hara al apretar 'guardar' 
          handler: async (data) => {
            const nuevoValor = data.nuevoValor?.trim();
            //if en caso que de este el campo vacio
            if (!nuevoValor) {
              this.mostrarIonAlertaSimple('Error', `El dato no puede estar vacío`);
              return false;
            }
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) return;
            //Aca estamos seleccionando el campo donde se encontrara lo que queremos editar
            const ref = doc(this.firestore, 'usuarios', user.uid);
            await updateDoc(ref, { [campo]: nuevoValor });

            // actualizamos el valor local inmediatamente
            this.datos[campo] = nuevoValor;

            // alerta de confirmación
            this.mostrarIonAlertaSimple('Actualizado', `El dato fue actualizado correctamente ✅`);
            return true;
          },
        },
      ],
    });
    await alert.present();
  }
}