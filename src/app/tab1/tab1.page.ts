import { Component, OnInit } from '@angular/core';
import { JuegosService } from '../services/juegos';
import { Juego } from '../services/juegos';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  juegos: Juego[] = [];
  isLoading: boolean = true;
  filtroActivo: string = 'Todos';
  categorias = [
    { nombre: 'Todos', slug: '' },
    { nombre: 'Acción', slug: 'action' },
    { nombre: 'Aventura', slug: 'adventure' },
    { nombre: 'RPG', slug: 'role-playing-games' },
    { nombre: 'Deportes', slug: 'sports' },
    { nombre: 'Estrategia', slug: 'strategy' },
    { nombre: 'Shooter', slug: 'shooter' }
  ];
  constructor(private juegosService: JuegosService) { }
  ngOnInit() {
    this.cargarJuegos();
  }

  /**
  @function filtrarPorCategoria
  @description filtra por lista de categorias el llamado de juegos de la api
  @param slug tipo string
  @param nombre tipo string
  @returns 
 */
  filtrarPorCategoria(slug: string, nombre: string) {
    this.filtroActivo = nombre;
    this.cargarJuegos(slug);
  }
  
  /**
  @function cargarJuegos
  @description carga los juegos desde la api
  @param generoSlug tipo string
  @returns 
 */
  cargarJuegos(generoSlug: string = '') {
    this.isLoading = true;
    this.juegosService.getJuegosPopulares(generoSlug).subscribe({
      next: (Response) => {
        this.juegos = Response.results;        
      },
      error: (err) => {        
        this.juegos = [];
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
