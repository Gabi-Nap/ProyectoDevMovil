import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {JuegosService} from '../services/juegos';


@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
juego: any = null;
juegoId: any;
listaJuegos: any[] = [];
favoritos: any[] = [];

  //el ActivatedRoute nos va a servir para capturar el id del juego 
  //y asi con este poder atraer mas contenido de la api
  constructor(private route: ActivatedRoute, private proveedorService: JuegosService ) { }

  //Con este ngOnInit inicializamos directamente el tab o pestaña con contenido
  ngOnInit() {
    //Aca es donde vamos a capturar el id con la siguiente linea y luego lo usaremos para llamar contenido
    this.juegoId = this.route.snapshot.paramMap.get('id');
    //-------------------------------
    if (this.juegoId) {
      // Ejemplo: llamar a la API o servicio para traer los detalles del juego
      this.proveedorService.getJuegoPorId(this.juegoId).subscribe((data) => {
        this.juego = data;
        
      });
      this.obtenerDatos();
    }
    
  }

  obtenerDatos() {
    const id: any = this.juegoId;
    this.proveedorService.obtenerImagenes(id).subscribe({
      next: (data: any) => {
        this.listaJuegos = data.results;        
      }
    });
  }
  esFavorito(juego: any): boolean {
    return this.favoritos.some(f => f.id === juego.id);
  }
  }
