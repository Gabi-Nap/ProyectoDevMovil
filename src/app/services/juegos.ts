import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Juego {

  id: any;
  name: string;
  rating: number;
  background_image: string;
  released: string;
  description?: string;
}
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
  constructor(private http: HttpClient) { }
   /**
  @function getJuegosPopulares
  @description Se encarga de traer juegos de la api
  @param genero tipo string
  @returns retorna un observable
 */
  getJuegosPopulares(genero?: string): Observable<RespuestaApi> {
    let url = `${this.apiUrl}&ordering=-rating&page_size=20`;
    if (genero) {
      url += `&genres=${genero.toLowerCase()}`;
    }
    return this.http.get<RespuestaApi>(url);
  }

  /**
  @function getJuegoPorId
  @description recibe datos de un juego especifico de la api
  @param id tipo string
  @returns retorna un observable
 */
  getJuegoPorId(id: string) {
    return this.http.get(`https://api.rawg.io/api/games/${id}?key=${this.apiKey}`);
  }

  /**
  @function buscarJuegos
  @description funcion desplegable de juegos mediante un input en el buscador
  @param nombre tipo string
  @returns retorna un observable
 */
  buscarJuegos(nombre: string) {
    return this.http.get(`https://api.rawg.io/api/games?key=${this.apiKey}&search=${nombre}`);
  }

  /**
  @function obtenerImagenes
  @description recibe una lista de imagenes de un juego en especifico
  @param id tipo strinig
  @returns retorna un observable
 */
  obtenerImagenes(id: string){
    return this.http.get(`https://api.rawg.io/api/games/${id}/screenshots?key=${this.apiKey}`);
  }
  
  /**
  @function getListaJuegos
  @description reciibe una lista de juegos principales de la api
  @param 
  @returns retorna un observable
 */
  getListaJuegos(): Observable<any> {
    return this.http.get(`https://api.rawg.io/api/games?key=${this.apiKey}`)
  }
}

