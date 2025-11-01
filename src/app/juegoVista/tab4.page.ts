import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from '../services/juegos';
import { AuthService } from '../auth/authService';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  juegoId: any;//id del juego para reedireccionamiento
  listaJuegos: any[] = [];//aca estara la lista de juegos del usuario logueado
  juego: any = null // Esto contendra toda la informacion de un juego llamado por su id
  //seccion comentarios
  imagenSeleccionada: File | null = null;//variable que contendra imagen
  comentarios: any[] = []; //el array que va a contener cada comentario almacenado
  comentario: string = '';//conectado de forma bidireccional al html, si en el input de html escribimos datos, estos automaticamente se añaden a esta variable mediante [(ngModel)]
  cargando = false;
  // ---------------------------------------------
  esFavoritoActual = false;    // Sera el estado del boton, si esta en false: El boton mostrara opcion para poder añadir a favoritos, si esta en true:Entonces el boton se mostrara como eliminar de favoritos
  cargandoFavorito = false;    // para deshabilitar el botón mientras actualiza
  constructor(private route: ActivatedRoute, private proveedorService: JuegosService, private authService: AuthService, private auth: Auth, private firestore: Firestore) { }

  //el ngOnInit siempre se encarga de inicializar la pantalla principal con las funciones que esten dentro de esta(osea el ngOnInit)
  async ngOnInit() {
    //Aca es donde vamos a capturar el id del juego con la siguiente linea y luego lo usaremos para llamar contenido
    this.juegoId = this.route.snapshot.paramMap.get('id');
    // Ejemplo: llamar a la API o servicio para traer los detalles del juego desde el metodo del authService
    this.proveedorService.getJuegoPorId(this.juegoId).subscribe(async (data) => {
      this.juego = data;//La informacion la va a guardar en la variable juego, permitiendonos traer todo tipo de datos de este juego
      await this.verificarSiEsFavorito()
    });
    //y aca otra funcion que funcionara para almacenar los datos al array : [listaJuegos]
    this.obtenerImagenes();//

    //aca asignamos valores al array :[comentarios] para luego desplegarlo en el html
    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);
    // ----------------------
  }
    async ionViewWillEnter() {
    // Esto se ejecuta cada vez que la página se vuelve visible
    if (this.juego) {
      await this.verificarSiEsFavorito();
    }
  }
  
  // --------------------------------------Funcion para el boton de favoritos-----------------------------------------------------------------------
  async toggleFavorito() {
    this.cargandoFavorito = true; // para bloquear el botón mientras actualiza
    try {
      //if que empieza si la variable 'esFavoritoActual' es 'true' pero normalmente esta en false en nuestra variable asi que no entra
      if (this.esFavoritoActual) {
        // si el juego ya es favorito lo quitamos con la funcion que se encuentra en authService
        await this.authService.quitarDeFavoritos(this.juego.id);
        this.esFavoritoActual = false;
      } else {//normalmente como iniciamos con nuestra variable 'esFavoritoActual' en false entraria aca
        //Activa el boton y llama la funcionalidad de authService
        await this.authService.agregarFavoritos(this.juego.id, this.juego.name, this.juego.background_image);
        //cambia la variable a 'true' y cada que entre en esta funcion 'toggleFavorito' entrara al primer if mostrando el quitar de favoritos
        this.esFavoritoActual = true;
      }
    }//Esto solo se activa en caso de que haya un error con el boton
    catch (err) {
      console.error('Error al cambiar favorito:', err);
      // acá podrías mostrar un toast de error
    }
  }
  async verificarSiEsFavorito() {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    const refUsuario = doc(this.firestore, "favoritos", user.uid, "juegos", String(this.juego.id));
    const snap = await getDoc(refUsuario);
    this.esFavoritoActual = snap.exists();
  }
  // -----------------------------------------------------------------------------------------------




  //el ActivatedRoute nos va a servir para capturar el id del juego 
  //y asi con este poder atraer mas contenido de la api

  //La funcion hara que llamemos imagenes del videojuego, y esta funcion estara en el ngOnInit para que sea lo primero que se muestre
  obtenerImagenes() {
    const id: any = this.juegoId;
    //Esta es una funcion distinta pero traida de /services/juegos que trae imagenes de la api
    this.proveedorService.obtenerImagenes(id).subscribe({
      next: (data: any) => {
        this.listaJuegos = data.results;
      }
    });
  }
  //funcion para guardar imagen seleccionada en una variable, esta funcion es la de los comentarios y se activara al apretar
  //el boton para subir una imagen
  seleccionarImagen(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }
  // ------------------------------------------------------------------------------------------------------------------------
  //funcion para apretar en 'publicar', al hacer esto llamara otra funcion que servira para almacenarlo en firestore y storage
  async enviarComentario() {
    if (!this.comentario.trim() && !this.imagenSeleccionada) {//if que verificara que se haya puesto por lo menos un comentario o una imagen,por ejemplo se lee asi: "si no hay comentario && no hay una imagen seleccionada ejecutar lo que esta dentro del if"
      this.authService.mostrarToast('Porfavor, escribe un comentario o sube una imagen para poder publicar algo', 'danger')
      return;
    }
    //En caso de todo correcto, se activa la animacion de 'cargando.....'
    this.cargando = true;
    //aca es donde usaremos esa funcion subirComentario para almacenar los datos en storage y firestore
    await this.authService.subirComentario(this.juegoId, this.comentario, this.imagenSeleccionada);
    this.comentario = '';//El texto que va en comentario se vacia devuela luego de que se publicara la imagen o comentario
    this.imagenSeleccionada = null;//Se vacia la variable a vacia despues de publicar comentariio o imagen para poder subir otra

    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);//esto hara que se muestre repentinamente en los comentarios, asi no tenemos que cerrar sesion e iniciar sesion para que se actualice
    this.cargando = false;//se reinicia la animacion cargando 
  }
  // ------------------------------------------------------------------------------------------------------------------------------------
}

