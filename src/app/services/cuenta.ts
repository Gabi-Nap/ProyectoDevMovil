import { Injectable } from '@angular/core';
import {getFirestore,collection,query,where,getDocs,writeBatch,doc,deleteDoc,updateDoc,} from 'firebase/firestore';
import {getAuth,deleteUser,User } from 'firebase/auth';

@Injectable({ providedIn: 'root' })
export class CuentaService {
  private firestore = getFirestore();
  private auth = getAuth();
  /**
   * Paso 2: Borrar documentos del usuario en tus colecciones
   * - perfil en "users/{uid}"
   * - favoritos en "favoritos/{uid}"
   * Si tenés más colecciones personales, las borrás acá.
   */
  //Esta funcion sirve para borrar nuestros datos al eliminar la cuenta, sera llamada en la pagina de perfiil
  private async borrarDatosPropios(uid: string) {
    // borrar perfil
    const perfilRef = doc(this.firestore, 'users', uid);
    await deleteDoc(perfilRef).catch(() => {
      // si no existe, no pasa nada
    });
    // borrar favoritos
    const favRef = doc(this.firestore, 'favoritos', uid);
    await deleteDoc(favRef).catch(() => {
      // si no existe, no pasa nada
    });
  }
  //Funcion para Eliminar el usuario en Authentication, que es otra zona de firebase
  private async borrarAuthUser(user: User) {
    await deleteUser(user);
  }
  //Método público: borra todo.
  //Devuelve true si salió bien, si no tira error. 
  async eliminarCuentaDefinitivamente(): Promise<boolean> {
    const user :any= this.auth.currentUser;
    const uid = user.uid;
    //borrar datos propios en Firestore llamando la funcion de arriba
    await this.borrarDatosPropios(uid);
    //eliminar usuario de auth llamando la funcion de arriba
    await this.borrarAuthUser(user);
    return true;
  }
}