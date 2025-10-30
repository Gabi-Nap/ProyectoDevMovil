import { Injectable } from '@angular/core';
import { signInWithEmailAndPassword, Auth } from '@angular/fire/auth';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, Timestamp } from '@angular/fire/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore } from '@angular/fire/firestore';
import { ToastController } from '@ionic/angular';
import { getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'

})
export class AuthService {
  //credenciales de usuario autenticado
  usuarioCredencial: any;
  //lista de favoritos para desplegar luego
  favoritos: any[] = [];

  listaFavoritos: any[] = [];

  constructor(private auth: Auth, private toastController: ToastController,private firestore:Firestore) { }

  // servicio de login para authenticar correo y contraseña, retornara las credenciales del usuario
  async login(email: string, password: string) {
    this.usuarioCredencial = await signInWithEmailAndPassword(this.auth, email, password);
    return this.usuarioCredencial;
  }
  // async obtenerUsuario(uid: string) {
  //   const docRef = doc(this.firestore, `users/${uid}`);
  //   const docSnap = await getDoc(docRef);

  //   if (docSnap.exists()) {
  //     console.log('Datos del usuario:', docSnap.data());
  //     return docSnap.data();
  //   } else {
  //     console.log('No se encontró el usuario');
  //     return null;
  //   }
  // }
  // --------------------------------------------------------------------
  //--------------------------funcion para traer todos los juegos favoritos del usuario actual autenticado------------------------
  async getFavoritosDelUsuario(): Promise<any[]>
   {
    const user :any= this.auth.currentUser;
    //lo que hace el doc es apuntar a nuestra base de datos, que dato vamos a manejar, osea genera la direccion para luego poder usarla
    const refUsuario = doc(this.firestore, 'favoritos', user.uid);
    //el getDoc devuelve un objeto llamado DocumentSnapshot y este nos permitira utilizar metodos utiles como el siguiente en el if que es 'exist'
    const snap = await getDoc(refUsuario);

    if (!snap.exists()) {//if que se lee como 'si el dato buscado no existe'
      return []; // retornara una lista vacia que mostrara que no tenemos ningun juego aun
    }
    //En caso de que exista seguira el codigo siguiente, llamara el metodo .data() propio de SnapShot para traer la indormacion que tiene
    const data = snap.data();
    return data['juegos'] || []; //retorna la informacion que tenga de lista con juegos o vacio
  }

  // -----------------------------Funcionalidad para boton favoritos---------------------------------------------------------------------------
  //Esta funcion boton servira para agregar a favoritos
  async agregarFavoritos(idDelJuego: string, nombreJuego: string,backgroundImage: string): Promise<void>
  {
    const user :any= this.auth.currentUser;
    ////lo que hace el doc es apuntar a nuestra base de datos, que dato vamos a manejar, osea genera la direccion para luego poder usarla
    const refUsuario = doc(this.firestore, "favoritos", user.uid);
    try { //el updateDoc sirve para actualizar solo algunos campos específicos de un documento existente, sin borrar los demás
      await updateDoc(refUsuario, {
        //Aca del juego seleccionado, agarramos su id y su nombre para luego guardarlos en la base de datos
        juegos: arrayUnion({ id: idDelJuego, nombre: nombreJuego,background_image: backgroundImage }),
      });
    } catch (err) {
      // si el doc no existe todavía, lo creamos con ese primer juego
      await setDoc(refUsuario, {
        juegos: [{ id: idDelJuego, nombre: nombreJuego,background_image: backgroundImage }],
      });
    }
  }
  // ---------------------------------------------------------------------------------------------------
  // ---------------------------------Funcion para quitar de favoritos------------------------------------------
  async quitarDeFavoritos(idJuego: string, nombreJuego: string, backgroundImage: string): Promise<void> 
  {
    const user :any= this.auth.currentUser;//------------->>>>>>>>>>>

    const refUsuario = doc(this.firestore, 'favoritos', user.uid);
    // IMPORTANTE:
    // arrayRemove necesita el objeto EXACTO que está guardado
    await updateDoc(refUsuario, {
      juegos: arrayRemove({ id: idJuego, nombre: nombreJuego, background_image: backgroundImage }),
    });
  }
  // ---------------------------------------------------------------------------------------------
  //Es para saber si es de los favoritos, sera llamado en el tab4 dentro del ngOnInit para llamar a los favoritos
  async esFavorito(idJuego: string): Promise<boolean> 
  {
    //La variable favoritos guarda los juegos favoritos del usuario, toda la lista
    const favoritos = await this.getFavoritosDelUsuario();//esta funcion trae los juegos favoritos del usuario

    return favoritos.some((juegoFavorito: any) => juegoFavorito.id === idJuego);
  }
  // -------------------------------------------------------------------------------------------------


  //-----------------------funcion para subir comentario al firestore y storage para almacenarlo y llamarlo luego----------------------------
  async subirComentario(juegoId: string, comentario: string, imagen: File | null) {
    const user :any= this.auth.currentUser;//-------------->>>>>>>>>>>

    const userRef = doc(this.firestore, `usuarios/${user.uid}`);
    const userSnap = await getDoc(userRef);
    let nombreUsuario = "Usuario desconocido";//esto es borrable ya que la app requerira todos los datos si o so en el registro
    if (userSnap.exists()) {//si el uid del usuario existe....
      //guarda la data en la vaiable userData
      const userData = userSnap.data();
      nombreUsuario = userData['nombre'] || nombreUsuario;//se agrega el nombre guardado en el firestore en la variable nombreUsuario para luego utilizarla en quien publico el comentario
    }
    let imageUrl = '';//variable que contiene la url de imagen
    if (imagen) {//si ya tenemos una imagen seleccionada en el comentario 
      const storage = getStorage();//el getStorage obtiene la instancia principal osea nuestro bucket del storage y la guarda en la variable storage
      const imageRef = ref(storage, `comentarios/${user.uid}/${Date.now()}_${imagen.name}`);//Esto muestra en que carpeta se va a guardar la imagen, esto va a crear una carpeta diferente por usuario
      //el Date.now lo que hara es crear un nombre distinto en los archivos para que no se dupliquen, estara concatenado con el nombre de la imagen con el guion bajo
      // --------------------------------------------------------
      //Esta funcion de abajo es propia de firebase, se utiliza para guardar el archivo que subimos dentro del storage
      //en el primer parametro te pide direccion de donde guardarlo, en el 2do parametro esta la imagen que subimos
      await uploadBytes(imageRef, imagen);
      //Aca se guarda la url de la imagen en la variable imagenUrl
      imageUrl = await getDownloadURL(imageRef);
    }
    //Aca continua con el codigo de abajo, guardamos en la variable los datos de la ruta asignada y tendremos la colleccion de datos
    const comentariosRef = collection(this.firestore, `juegos/${juegoId}/comentarios`);
    //el addDoc crea un nuevo documento dentro de donde nos ubicamos(seria un campo como nombre, nacionalidad, etc), vamos a añadir los nuevos datos proximos
    await addDoc(comentariosRef, {
      uid: user.uid,//guardaremos en el uid del juego
      nombreUsuario,//Sera el nombre de usuario del que publico la imagen
      comentario,//Publicara el comentario que se guardo dentro del juego
      imageUrl,//Se guarda la imagen guardada en el comentario
      fecha: Timestamp.now()//Se guarda la fecha exacta y horario en el que se subio el comentario
    });
  }
  // --------------------------------------------------------------------------------------

  //-------------funcion para traer comentarios guardados del firestore al inicializar la pagina,-----------------------------
  async obtenerComentarios(juegoId: string) {
    const referencia = collection(this.firestore, `juegos/${juegoId}/comentarios`);//llamamos toda la coleccion que se encuentra en la ruta seleccionada y se guarda en la variable    
    //ordenamos por fecha en forma descendiente con los metodos de firebase
    const ordenDeComentarios = query(referencia, orderBy('fecha', 'desc'));
    //En la variable snapshot guardaremos toda la colecion ya ordenada y el getDocs se utiliza para llamar todos los datos que se encuentren
    const snapshot = await getDocs(ordenDeComentarios);
    //retornamos todos los valores en el tab 4 ya en su forma descendiente por la fecha
    return snapshot.docs.map(doc => doc.data());
  }
// -----------------------------------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------------------------------
  // async obtenerDatosUsuarioActual() {
  //   const user :any= this.auth.currentUser;
  //

  //   const refUsuario = doc(this.firestore, "usuarios", user.uid);
  //   const snap = await getDoc(refUsuario);

  //   if (snap.exists()) {
  //     const datos = snap.data();
  //     console.log('Datos del usuario:', datos);
  //     return datos;
  //   } else {
  //     console.log('El documento del usuario no existe');
  //     return null;
  //   }
  // }
  //----------------------------------Esto sera para llamar a los objetos guardados en el firestore------------------------------------
  // obtenerFavoritos() {
  //   const user :any = this.auth.currentUser;//---------------------------->>>>>
  //   //Se ubica en la documentacion del firestore, en la seccion favoritos y luego en user.uid
  //   const refUsuario = doc(this.firestore, "favoritos", user.uid);

  //   onSnapshot(refUsuario, (docSnap) => {
  //     if (docSnap.exists()) {
  //       const datos = docSnap.data();//si user.uid existe entonces toda la data la guardamos en variable datos
  //       const juegos = datos['juegos'] || [];//guarda los datos de juegos del firestore en variable juegos
  //       console.log('🎮 Favoritos obtenidos:', juegos);
  //       this.listaFavoritos = juegos;

  //     } else {
  //       console.log('no hay ninguna lista de favoritos de este usuario');
  //       this.listaFavoritos = [];
  //     }
  //   });
  // }

  //--------------------------------funcion para eliminar juego del firestore o de la lista de favoritos----------------------------------
  // async eliminarJuego(idJuego: string) {
  //   const user :any= this.auth.currentUser;//--------------->>>>>>>>
  //   //nos ubicamos dentro de firestore, en la seccion favoritos, y luego en user.uid y la guardamos en una variable
  //   const refUsuario = doc(this.firestore, "favoritos", user.uid);
  //   //utilizamos el getDoc para traer un campo del firestore de donde estamos ubicados
  //   const docSnap = await getDoc(refUsuario);
  //   //si el campo existe, entonces entra al if
  //   if (docSnap.exists()) {
  //     const datos = docSnap.data();//guarda los datos en la variable
  //     const juegos = datos['juegos'];//agarramos un campo especifico que seria 'juegos' de firestore y lo guardamos en variable juegos

  //     // Buscamos el juego a eliminar del firestore
  //     const juegoAEliminar = juegos.find((juego: any) => juego.id === idJuego);//busca de todos los campos de 'juegos' el id y los compara con el parametro de la funcion principal y si lo encuentra lo guarda en una variable      

  //     // Eliminamos el objeto exacto con arrayRemove que es un metodo propio de firestore, se utiliza para eliminar arrays, y nos eliminara todo del firestore
  //     await updateDoc(refUsuario, {
  //       juegos: arrayRemove(juegoAEliminar)
  //     });      
  //   } else {
  //     console.log('No hay lista de favoritos para este usuario');
  //   }
  // }
  // -------------------------------------
  // ----------------------------------------Aca va la notificacion luego de que se ejecute una funcion-------------------------------
  //Sera una funcion para mostrar un cartel verde o rojo depende de lo que necesitemos
  async mostrarToast(mensaje: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000, // se cierra a los 3 segundos
      position: 'bottom',
      color: color, // 'success', 'danger', 'warning', 'primary', etc.
      icon: color === 'success' ? 'checkmark-circle' : 'alert-circle'
    });

    await toast.present();
  }
//-----------------------------------------Funcion para el funcionamiento del authGuard----------------------------------------------
  isLoggedIn(): boolean {
    return !!this.auth.currentUser;
  }
  // ------------------
}

