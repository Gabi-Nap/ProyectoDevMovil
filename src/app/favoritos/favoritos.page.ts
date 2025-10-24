import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/authService';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
  standalone:false
})
export class FavoritosPage implements OnInit {

  constructor(private authService:AuthService) { }
  
  favoritos: any[] = [];


  ngOnInit() {
    this.verFavoritos();
  }
  
  async verFavoritos() {
    this.favoritos = await this.authService.obtenerFavoritos();
  }
  eliminarJuego(juego:string){
    this.authService.eliminarJuego(juego);
  }


}
