import { Component, OnInit } from '@angular/core';
import { JuegosService } from '../services/juegos';
import { Juego } from '../services/juegos';
import { AuthService } from '../auth/authService';
import { Router } from '@angular/router';

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
    { nombre: 'Shooter', slug: 'shooter' },
  ];

  /**
   * @constructor
   * @description
   * Inyecta los servicios necesarios para obtener los juegos desde la API, manejar la autenticación y controlar la navegación.
   *
   * @param {JuegosService} juegosService - Servicio encargado de realizar las peticiones HTTP para obtener los juegos.
   * @param {AuthService} authService - Servicio de autenticación de usuarios.
   * @param {Router} router - Servicio de enrutamiento para navegar entre páginas.
   */

  constructor(
    private juegosService: JuegosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarJuegos();
  }

  /**
   * @function filtrarPorCategoria
   * @description
   * Cambia el filtro activo según la categoría seleccionada por el usuario y recarga la lista de juegos
   * utilizando el slug correspondiente.
   *
   * @param {string} slug - Identificador de la categoría utilizado por la API.
   * @param {string} nombre - Nombre visible de la categoría seleccionada.
   * @return {void}
   */

  filtrarPorCategoria(slug: string, nombre: string) {
    this.filtroActivo = nombre;

    this.cargarJuegos(slug);
  }

  /**
   * @function cargarJuegos
   * @description
   * Carga los juegos desde la API según la categoría seleccionada (si se pasa un `slug`),
   * o carga todos los juegos por defecto.
   * Muestra el estado de carga mientras espera la respuesta de la API.
   *
   * @param {string} [generoSlug=''] - Slug del género para filtrar los juegos (opcional).
   * @return {void}
   */

  cargarJuegos(generoSlug: string = '') {
    this.isLoading = true;

    this.juegosService.getJuegosPopulares(generoSlug).subscribe({
      next: (Response) => {
        this.juegos = Response.results;
        console.log(
          `Juegos cargados para ${generoSlug || 'Todos'}:`,
          this.juegos.length
        );
      },
      error: (err) => {
        console.error('Error al cargar los juegos desde la API:', err);
        this.juegos = [];
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }
}
