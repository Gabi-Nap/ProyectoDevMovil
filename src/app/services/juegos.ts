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
  

  getJuegosPopulares(genero?: string): Observable<RespuestaApi> {
    let url = `${this.apiUrl}&ordering=-rating&page_size=10`;
    if (genero) {
      url += `&genres=${genero.toLowerCase()}`;
    }
    console.log('Llamando a la API de juegos:', url);
    return this.http.get<RespuestaApi>(url);
  }
  


  getJuegoPorId(id: string) {
    return this.http.get(`https://api.rawg.io/api/games/${id}?key=${this.apiKey}`);
  }
  


  buscarJuegos(nombre: string) {
    return this.http.get(`https://api.rawg.io/api/games?key=${this.apiKey}&search=${nombre}`);
  }
 

  
  obtenerImagenes(id: string){
    return this.http.get(`https://api.rawg.io/api/games/${id}/screenshots?key=${this.apiKey}`);
    //ejemplo:  https://api.rawg.io/api/games/795632/screenshots?key=ebcf970455f4455e819b8800ef275506
  }
}

