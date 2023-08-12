import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ROUTES} from "./core/routes";

const routes: Routes = [
  ROUTES['HOME'],
  ROUTES['HEADER'],
  ROUTES['POST']
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
