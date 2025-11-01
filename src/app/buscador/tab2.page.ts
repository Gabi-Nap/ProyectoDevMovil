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

  constructor(private proveedorService: JuegosService, public router: Router) { }

  termino: string = '';
  juegos: any[] = [];
  listaJuegosExitosos: any[] = [];

  // Esta funcion va a servir para que el buscador reaccione a nuestra busqueda mostrandonos una lista de items
  buscarJuego() {
    if (this.termino.trim() === '') {
      this.juegos = [];
      return;
    }    
    this.proveedorService.buscarJuegos(this.termino).subscribe((data: any) => {
      this.juegos = data.results;
    });
  }
  //En ngOnInit lo que este dentro de ella, se acciona de inmediato en la app, mostrandonos lista de juegos en la app
  ngOnInit() {
    this.obtenerJuegos()
    
  }
  //Esta funcion servira para traer una lista de juegos en el tab, que se mostraran afuera del buscador de input
  obtenerJuegos(){
    //llamamos funcion de 'proveedorService' para reutilizarla y traer datos de la api
    this.proveedorService.getListaJuegos().subscribe({
      next: (data) => {
        this.listaJuegosExitosos = data.results; // la API de RAWG devuelve los juegos dentro de "results"
        console.log(this.listaJuegosExitosos);
      },
      error: (err) => console.error('Error al obtener juegos:', err)
    });
  }
}
