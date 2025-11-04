import { Component, OnInit } from '@angular/core';
import { JuegosService } from '../services/juegos';
import { Juego } from '../services/juegos';
import { doc, getDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {

  juegos: Juego[] = [];
  isLoading: boolean = true;
  idUsuario: string ='';
  filtroActivo: string = 'Todos';
  fotoPerfil: string | null = null;
  categorias = [
    { nombre: 'Todos', slug: '' },
    { nombre: 'Acción', slug: 'action' },
    { nombre: 'Aventura', slug: 'adventure' },
    { nombre: 'RPG', slug: 'role-playing-games' },
    { nombre: 'Deportes', slug: 'sports' },
    { nombre: 'Estrategia', slug: 'strategy' },
    { nombre: 'Shooter', slug: 'shooter' }
  ];

  constructor(private juegosService: JuegosService,private auth:Auth, private firestore:Firestore) { }
  
  ngOnInit() {
    this.tomarIdUsuario();
    this.cargarJuegos(); 
    this.cargarFotoIcono(this.idUsuario)
  }
  /**
  @function ionViewWillEnter
  @description Esto funcionara como ngOnInit para actualizar los cambios al volver a la pagina sin necesidad de actualizarla nosotros
  @param
  @returns 
 */
  async ionViewWillEnter() {
    this.cargarFotoIcono(this.idUsuario)
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
  /**
  @function cargarFotoIcono
  @description Llama la imagen guardada del storage y la guarda en variable para mostrarla en html
  @param uid debe ser tipo string
  @returns 
 */
  async cargarFotoIcono(uid: string) {
      const docRef = doc(this.firestore, 'usuarios', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        this.fotoPerfil = data['fotoURL'] || 'assets/icon/hombre-avatar.png';
      }
    }
    /**
  @function tomarIdUsuario
  @description guarda el uid del usuario en variable para utilizarlo 
  @param
  @returns 
 */    
  tomarIdUsuario(){
      const user = this.auth.currentUser
      this.idUsuario = user?.uid ?? '';
    }
}
