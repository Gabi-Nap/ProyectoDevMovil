import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from '../services/juegos';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { AuthService } from '../auth/authService';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  firestore = inject(Firestore);

  juegoId: any;//id del juego para reedireccionamiento
  listaJuegos: any[] = [];//aca estara la lista de juegos del usuario logueado
  juego: any = null // Esto contendra toda la informacion de un juego llamado por su id
  //seccion comentarios
  imagenSeleccionada: File | null = null;//variable que contendra imagen
  comentarios: any[] = []; //el array que va a contener cada comentario almacenado
  comentario: string = '';//conectado de forma bidireccional al html, si en el input de html escribimos datos, estos automaticamente se añaden a esta variable mediante [(ngModel)]
  cargando = false;
  // ----------------

  //el ActivatedRoute nos va a servir para capturar el id del juego 
  //y asi con este poder atraer mas contenido de la api
  constructor(private route: ActivatedRoute, private proveedorService: JuegosService, private authService: AuthService) { }

  //Con este ngOnInit inicializamos directamente el tab o pestaña con contenido


  //el ngOnInit siempre se encarga de inicializar la pantalla principal con las funciones que esten dentro de esta(osea el ngOnInit)
  async ngOnInit() {
    //Aca es donde vamos a capturar el id con la siguiente linea y luego lo usaremos para llamar contenido
    this.juegoId = this.route.snapshot.paramMap.get('id');
    if (this.juegoId) {
      // Ejemplo: llamar a la API o servicio para traer los detalles del juego
      this.proveedorService.getJuegoPorId(this.juegoId).subscribe((data) => {
        this.juego = data;
      });
      //y aca otra funcion que funcionara para almacenar los datos al array : [listaJuegos]
      this.obtenerDatos();
    }
    //aca asignamos valores al array :[comentarios] para luego desplegarlo en el html
    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);
  }
  obtenerDatos() {
    const id: any = this.juegoId;
    this.proveedorService.obtenerImagenes(id).subscribe({
      next: (data: any) => {
        this.listaJuegos = data.results;
      }
    });
  }
  //funcion para guardar imagen seleccionada en una variable
  seleccionarImagen(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }
  //funcion para luego de apretar boton de enviar un comentario, al hacer esto llamara otra funcion que servira para almacenarlo en firestore y storage
  async enviarComentario() {
    if (!this.comentario.trim() && !this.imagenSeleccionada) return;
    this.cargando = true;
    //aca es donde usaremos esa funcion para almacenar los datos en storage y firestore
    await this.authService.subirComentario(this.juegoId, this.comentario, this.imagenSeleccionada);
    this.comentario = '';
    this.imagenSeleccionada = null;
    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);
    this.cargando = false;
  }
  //funcion de boton para agregar a favoritos los juegos que deseemos
  /*agregarFavoritos(idDelJuego: string, nombreJuego: string) {
    //Aca usaremos la funcion que detallaremos en el authService.....
    this.authService.agregarFavoritos(idDelJuego, nombreJuego)
  }*/

  agregarAFavoritos() {
  if (!this.juego) {
    console.log('No hay datos del juego');
    return;
  }
  this.authService.agregarFavoritos(this.juego);
}
}





