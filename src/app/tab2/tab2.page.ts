import { Component, OnInit } from '@angular/core';
import { JuegosService } from '../services/juegos'
import { Router } from '@angular/router'

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page implements OnInit {

  termino: string = '';
  juegos: any[] = [];
  listaJuegosExitosos: any[] = [];

  constructor(private proveedorService: JuegosService, public router: Router) { }
  
  ngOnInit() {
    this.obtenerJuegos()
  }

  /**
  @function buscarJuego
  @description busca un juego desde el input o buscador
  @param 
  @returns 
 */
  buscarJuego() {
    if (this.termino.trim() === '') {
      this.juegos = [];
      return;
    }
    this.proveedorService.buscarJuegos(this.termino).subscribe((data: any) => {
      this.juegos = data.results;
    });
  }
  
  /**
  @function obtenerJuegos
  @description Llama una lista de juegos principales para que se muestre primero en la pantalla
  @param 
  @returns 
 */
  obtenerJuegos() {
    this.proveedorService.getListaJuegos().subscribe({
      next: (data) => {
        this.listaJuegosExitosos = data.results;
      },
      error: (err) => console.error('Error al obtener juegos:', err)
    });
  }
}
