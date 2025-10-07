import { Component } from '@angular/core';
import { Juego, JuegosService } from '../services/juegos';
@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: false,
})
export class Tab2Page {
  terminoBusqueda: string = '';
  resultados: Juego[] = [];
  loading: boolean = false;
  mensaje: string = 'Escriba para buscar';

  constructor(private juegosService: JuegosService) { }

  getJuegos() {
    if (!this.terminoBusqueda) {
      this.resultados = [];
      this.mensaje = 'Escriba para buscar';
      return;
    }

    this.loading = true;
    this.mensaje = 'Buscando...';

    this.juegosService.getJuegos(this.terminoBusqueda).subscribe({
      next: (respuesta) => {
        this.resultados = respuesta.results;
        this.loading = false;

        if (this.resultados.length === 0) {
          this.mensaje = 'No se encontraron resultados';
        }
        else {
          this.mensaje = '';
        }
      },
      error: (error) => {
        console.error('Error al buscar juegos:', error.mensaje);
        this.loading = false;
        this.mensaje = 'Error al buscar. Intente nuevamente.';
        this.resultados = [];
      }
    })
  }
  limpiarBusqueda() {
    this.terminoBusqueda = '';
    this.resultados = [];
    this.mensaje = 'Escriba para buscar';
    this.loading = false;
  }
}
