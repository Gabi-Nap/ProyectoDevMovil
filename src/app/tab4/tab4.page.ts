import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from '../services/juegos';
import { AuthService } from '../auth/authService';
import { onAuthStateChanged } from 'firebase/auth';

import { Auth } from '@angular/fire/auth';
@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  juegoId: any;
  listaJuegos: any[] = [];
  juego: any = null ;
  imagenSeleccionada: File | null = null;
  comentarios: any[] = [];
  comentario: string = '';
  cargando = false;
  esFavoritoActual = false; 
  cargandoFavorito = false; 
  constructor(private route: ActivatedRoute, private proveedorService: JuegosService, private authService: AuthService,private auth:Auth) { }
  async ngOnInit() {  
    this.juegoId = this.route.snapshot.paramMap.get('id');
    if (this.juegoId) {      
      this.proveedorService.getJuegoPorId(this.juegoId).subscribe((data) => {
        this.juego = data;
      });
      this.obtenerImagenes();
    }    
    this.comentarios = await this.authService.obtenerComentarios(this.juegoId);        
    onAuthStateChanged(this.auth, async (user) => {
      if (!user) {
        this.esFavoritoActual = false;
        return;
      }
      if (this.juego && this.juego.id) {
        this.esFavoritoActual = await this.authService.esFavorito(this.juego.id);     
      }
    });
  }
  
  /**
  @function toggleFavorito
  @description Accion para cambiar el estado del boton de favoritos
  @param
  @returns retorna una promesa
  */
  async toggleFavorito() {
    this.cargandoFavorito = true;//
    try {      
      if (this.esFavoritoActual) {    
        await this.authService.quitarDeFavoritos(this.juego.id, this.juego.name,this.juego.background_image);
        this.esFavoritoActual = false;
      } else {
        await this.authService.agregarFavoritos(this.juego.id, this.juego.name,this.juego.background_image);        
        this.esFavoritoActual = true;
      }
    }
    catch (err) {
    } finally {
      this.cargandoFavorito = false;
    }
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
  // ------------------------------------------------------------------------------------------------------------------------------------
  


}
