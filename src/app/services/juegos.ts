import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Interfaz para estructurar los datos del juego (Nombres de las propiedades coinciden con la API de RAWG)
export interface Juego {
  id: number;
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
  private apiKey = `ebcf970455f4455e819b8800ef275506`;
  private apiUrl = `https://api.rawg.io/api/games?key=${this.apiKey}`;


// Inyectamos el cliente HTTP
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
  console.log('Llamando a la API de juegos:', url);
    return this.http.get<RespuestaApi>(url);
}

/**
 * @function getJuegos
 * @param termino Término de búsqueda para filtrar juegos.
 * @returns retorna un Observable con los resultados de la búsqueda.
 */
getJuegos(termino: string): Observable<RespuestaApi> {  
  const url = `${this.apiUrl}&search=${termino}&page_size=10`;
  return this.http.get<RespuestaApi>(url);
}
}
