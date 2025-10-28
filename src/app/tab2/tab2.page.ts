import { Component } from '@angular/core';
import { JuegosService } from '../services/juegos'
import { Router } from '@angular/router'
import { Juego} from '../services/juegos';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {

  constructor(private proveedorService: JuegosService, public router: Router) { }

  termino: string = '';
  juegos: any[] = [];
  juegosSugeridos: any[]=[];
  // Esta funcion va a servir para que el buscador reaccione
  // a nuestra busqueda mostrandonos una lista de items
   ngOnInit() {
    this.cargarJuegosSugeridos();
  }
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
   * Cargar juegos sugeridos (3)
   * 
   */
  cargarJuegosSugeridos() {
    this.proveedorService.getJuegosSugeridos(4).subscribe({
      next: (data: any) => {
        this.juegosSugeridos = data.results;
        console.log('Juegos sugeridos cargados:', this.juegosSugeridos);
      },
      error: (error) => {
        console.error('Error cargando juegos sugeridos:', error);
      }
    });
  }
}
