import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'inicio',
        loadChildren: () => import('../inicio/tab1.module').then(m => m.Tab1PageModule)
      },
      {
        path: 'navegar',
        loadChildren: () => import('../buscador/tab2.module').then(m => m.Tab2PageModule)
      },
      {
        path: 'perfil',
        loadChildren: () => import('../perfil/tab3.module').then(m => m.Tab3PageModule)
      },
      {//Esto de aca redirigira a un tab donde se va a agarrar el id
        path: 'juego/:id',
        loadChildren: () => import('../juegoVista/tab4.module').then(m => m.Tab4PageModule)
      },
      {
        path: 'favoritos',
        loadChildren: () => import('../listaFavoritos/tab5.module').then(m => m.Tab5PageModule)
      },      
      {
        path: '',
        redirectTo: '/apps/inicio',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
