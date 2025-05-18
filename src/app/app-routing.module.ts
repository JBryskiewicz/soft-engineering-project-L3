import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from './components/login/login-page.component';
import {ListViewComponent} from './components/dashboard/list-view/list-view.component';
import {ListViewShipsComponent} from './components/dashboard/list-view-ships/list-view-ships.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: ListViewComponent,
  children: [
    { path: 'ships', component: ListViewShipsComponent }
  ]},
  // { path: 'dashboard', component: ListViewShipsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
