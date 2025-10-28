import { Component } from '@angular/core';
import { JuegosService } from '../services/juegos'
import { Router } from '@angular/router'

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
  // Esta funcion va a servir para que el buscador reaccione
  // a nuestra busqueda mostrandonos una lista de items
  buscarJuego() {
    if (this.termino.trim() === '') {
      this.juegos = [];
      return;
    }    
    this.proveedorService.buscarJuegos(this.termino).subscribe((data: any) => {
      this.juegos = data.results;
    });
  }
}
