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
  
  // ⭐️ Variable para rastrear qué chip está seleccionado (usado para el color en HTML)
  filtroActivo: string = 'Todos';

  // ⭐️ Lista de chips: 'nombre' es para mostrar, 'slug' es para la API de RAWG
  categorias = [
    { nombre: 'Todos', slug: '' }, // Slug vacío para no filtrar
    { nombre: 'Acción', slug: 'action' },
    { nombre: 'Aventura', slug: 'adventure' },
    { nombre: 'RPG', slug: 'role-playing-games' },
    { nombre: 'Deportes', slug: 'sports' },
    { nombre: 'Estrategia', slug: 'strategy' },
    { nombre: 'Shooter', slug: 'shooter' },
  ];

  // Inyectamos el JuegosService
  constructor(private juegosService: JuegosService) {}

  // Se ejecuta una vez que el componente se inicializa
  ngOnInit() {
    // Carga inicial sin filtro
    this.cargarJuegos(); 
  }

  /**
   * Maneja el click en un chip de categoría.
   * Llama a cargarJuegos con el slug del filtro.
   */
  filtrarPorCategoria(slug: string, nombre: string) {
    // 1. Marca el chip como activo
    this.filtroActivo = nombre; 
    
    // 2. Llama a la función de carga con el nuevo filtro
    this.cargarJuegos(slug);
  }

  /**
   * Carga los juegos, ahora con un parámetro opcional de género.
   * @param generoSlug El slug del género a filtrar. Por defecto es vacío ('').
   */
  cargarJuegos(generoSlug: string = ''){
    this.isLoading = true;
    
    // ⭐️ Pasamos el slug de género al servicio
    this.juegosService.getJuegosPopulares(generoSlug).subscribe({
      next: (Response) => {
        this.juegos = Response.results;
        console.log(`Juegos cargados para ${generoSlug || 'Todos'}:`, this.juegos.length);
      },
      error: (err) => {
        console.error("Error al cargar los juegos desde la API:", err);
        this.juegos = []; // Vaciar la lista si hay error
        this.isLoading = false; 
      },
      complete: () => {
        this.isLoading = false; 
      }
    });
  }
}
