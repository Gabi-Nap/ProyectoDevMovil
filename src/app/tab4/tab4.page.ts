import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JuegosService } from '../services/juegos';
import { addDoc, arrayUnion, collection, updateDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { doc, setDoc } from "firebase/firestore";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { AuthService } from '../auth/authService';



@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: false,
})
export class Tab4Page implements OnInit {
  
  juegoId: any;
  listaJuegos: any[] = [];
  
  firestore = inject(Firestore);
  idUsuario: any = '';

  juego: any = null // Esto contendra toda la informacion de un juego llamado por su id
  numFavorito: number = 0;
  favoritos: any[] = [];
  
  


  //el ActivatedRoute nos va a servir para capturar el id del juego 
  //y asi con este poder atraer mas contenido de la api
  constructor(private route: ActivatedRoute, private proveedorService: JuegosService,private authService:AuthService) { }

  //Con este ngOnInit inicializamos directamente el tab o pestaña con contenido
  ngOnInit() {
    //Aca es donde vamos a capturar el id con la siguiente linea y luego lo usaremos para llamar contenido
    this.juegoId = this.route.snapshot.paramMap.get('id');
    //-------------------------------
    if (this.juegoId) {
      // Ejemplo: llamar a la API o servicio para traer los detalles del juego
      this.proveedorService.getJuegoPorId(this.juegoId).subscribe((data) => {
        this.juego = data;

      });
      this.obtenerDatos();
    }

  }

  obtenerDatos() {
    const id: any = this.juegoId;
    this.proveedorService.obtenerImagenes(id).subscribe({
      next: (data: any) => {
        this.listaJuegos = data.results;
      }
    });
  }
  agregarFavoritos(idDelJuego:string, nombreJuego:string){
    this.authService.agregarFavoritos(idDelJuego, nombreJuego)
  }
  //Esta funcion agregara a favoritos los juegos seleccionados tomando como parametros
  //el uid del usuario y el id del juego 
  
}
  
  

  

