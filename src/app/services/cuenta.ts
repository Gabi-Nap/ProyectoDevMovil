import {  Injectable } from '@angular/core';
import { doc,deleteDoc} from 'firebase/firestore';
import {deleteUser,User } from 'firebase/auth';
import { Firestore } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';


@Injectable({ providedIn: 'root' })
export class CuentaService {
  
  constructor(private auth:Auth, private firestore:Firestore){}
  /**
  @function borrarDatosPropios
  @description Se encarga de eliminar los datos del autenticado del firestore y su lista de favoritos
  @param uid debe ser tipo string
  @returns retorna una promesa
 */
  private async borrarDatosPropios(uid: string) {
    const perfilRef = doc(this.firestore, 'users', uid);
    await deleteDoc(perfilRef).catch(() => {
    });
    const favRef = doc(this.firestore, 'favoritos', uid);
    await deleteDoc(favRef).catch(() => {
    });
  }
  
  /**
  @function borrarAuthUser
  @description Se encarga de eliminar el correo y contraseña de authentication
  @param uid debe ser tipo string
  @returns retorna una promesa
 */
  private async borrarAuthUser(user: User) {
    await deleteUser(user);
  }
  
   /**
  @function eliminarCuentaDefinitivamente
  @description elimina la cuenta llamando las funciones para eliminar los datos
  @param 
  @returns retorna una promesa
 */
  async eliminarCuentaDefinitivamente(): Promise<boolean> {
    const user :any= this.auth.currentUser;
    const uid = user.uid;    
    await this.borrarDatosPropios(uid);    
    await this.borrarAuthUser(user);
    return true;
  }
}