import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaz para estructurar los datos del juego (Nombres de las propiedades coinciden con la API de RAWG)
export interface Juego {
  id: any;
  name: string;
  rating: number;
  background_image: string;
  released: string;
  description?: string;
}

// Interfaz para la respuesta de la API.
interface RespuestaApi {
  results: Juego[];
  count: number;
  next: string | null;
}


@Injectable({
  providedIn: 'root'
})

export class JuegosService {
  // Clave api KEY
  private apiKey = `ebcf970455f4455e819b8800ef275506`;
  private apiUrl = `https://api.rawg.io/api/games?key=${this.apiKey}`;
  


  //INYECCION DEL CLIENTE
  constructor(private http: HttpClient) { }
  /**
   * Obtiene juegos populares, opcionalmente filtrados por género.
   * @param genero Nombre del género para filtrar (ej: 'action', 'adventure').
   */
  
  getJuegosPopulares(genero?: string): Observable<RespuestaApi> {
    let url = `${this.apiUrl}&ordering=-rating&page_size=10`;
    if (genero) {
      url += `&genres=${genero.toLowerCase()}`;
    }
    return this.http.get<RespuestaApi>(url);
  }
  //ENCONTRAR JUEGO POR EL ID Y ATRAER SU CONTENIDO
  getJuegoPorId(id: string) {
    return this.http.get(`https://api.rawg.io/api/games/${id}?key=${this.apiKey}`);
  }
  //FUNCION PARA BUSCAR UN JUEGO POR EL INPUT CON EL APIKEY
  buscarJuegos(nombre: string) {
    return this.http.get(`https://api.rawg.io/api/games?key=${this.apiKey}&search=${nombre}`);
  }
  //ESTO ES PARA OBTENER LISTA DE IMAGENES SCREENSHOOT SOBRE EL JUEGO QUE APRETEMOS
  obtenerImagenes(id: string){
    return this.http.get(`https://api.rawg.io/api/games/${id}/screenshots?key=${this.apiKey}`);
    //ejemplo:  https://api.rawg.io/api/games/795632/screenshots?key=ebcf970455f4455e819b8800ef275506
  }
  getListaJuegos(): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/games?key=${this.apiKey}`)
  }
}

