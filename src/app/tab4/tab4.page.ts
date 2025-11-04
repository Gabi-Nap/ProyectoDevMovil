import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from '../services/juegos';
import { AuthService } from '../auth/authService';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {

  juegoId: any;
  listaJuegos: any[] = [];
  juego: any = null;
  imagenSeleccionada: File | null = null;
  comentarios: any[] = [];
  comentario: string = '';
  cargando = false;
  esFavoritoActual = false;
  cargandoFavorito = false;

  constructor(private route: ActivatedRoute, private proveedorService: JuegosService, private authService: AuthService, private auth: Auth, private firestore: Firestore) { }

  async ngOnInit() {
    try {
      this.juegoId = this.route.snapshot.paramMap.get('id');

      this.proveedorService.getJuegoPorId(this.juegoId).subscribe(async (data) => {
        this.juego = data;
        await this.verificarSiEsFavorito()
      });
      this.obtenerImagenes();
    } catch {
      console.error('error consola');

    };
    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);
  }/**
  @function ionViewWillEnter
  @description Esto funcionara como ngOnInit para actualizar los cambios al volver a la pagina sin necesidad de actualizarla nosotros
  @param
  @returns 
 */
  async ionViewWillEnter() {
    if (this.juego) {
      await this.verificarSiEsFavorito();
    }
  }

  /**
  @function toggleFavorito
  @description Accion para cambiar el estado del boton de favoritos
  @param
  @returns retorna una promesa
  */
  async toggleFavorito() {
    this.cargandoFavorito = true;
    try {
      if (this.esFavoritoActual) {
        await this.authService.quitarDeFavoritos(this.juego.id);
        this.esFavoritoActual = false;
      } else {
        await this.authService.agregarFavoritos(this.juego.id, this.juego.name, this.juego.background_image);
        this.esFavoritoActual = true;
      }
    }
    catch (err) {
    } finally {
      this.cargandoFavorito = false;
    }
  }
  /**
  @function verificarSiEsFavorito
  @description Verifica la existencia del juego en el storage para definir el estado del boton 'añadir favoritos'
  @param
  @returns retorna una promesa
 */
  async verificarSiEsFavorito() {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    const refUsuario = doc(this.firestore, "favoritos", user.uid, "juegos", String(this.juego.id));
    const snap = await getDoc(refUsuario);
    this.esFavoritoActual = snap.exists();
  }

  /**
  @function obtenerImagenes
  @description Aacion para llamar imagenes sobre el juego especifico
  @param
  @returns 
  */
  obtenerImagenes() {
    const id: any = this.juegoId;
    this.proveedorService.obtenerImagenes(id).subscribe({
      next: (data: any) => {
        this.listaJuegos = data.results;
      }
    });
  }
  /**
  @function seleccionarImagen
  @description Accion para poder seleccionar una imagen del dispositivo
  @param  event debe ser tipo any
  @returns 
  */
  seleccionarImagen(event: any) {
    this.imagenSeleccionada = event.target.files[0];
  }

  /**
  @function enviarComentario
  @description Aacion para publicar comentario y subirlo al firestore y la imagen al storage
  @param 
  @returns retorna una promesa 
  */
  async enviarComentario() {
    if (!this.comentario.trim() && !this.imagenSeleccionada) {
      this.authService.mostrarToast('Porfavor, escribe un comentario o sube una imagen para poder publicar algo', 'danger')
      return;
    }
    this.cargando = true;
    await this.authService.subirComentario(this.juegoId, this.comentario, this.imagenSeleccionada);
    this.comentario = '';
    this.imagenSeleccionada = null;

    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);
    this.cargando = false;
  }
}
