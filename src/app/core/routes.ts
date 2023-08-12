import {ResolveData} from "@angular/router";
import {Type} from "@angular/core";
import {BoardComponent} from "../features/board/board.component";
import {HeaderComponent} from "./header/header.component";
import {FormComponent} from "../features/post/features/form/form.component";

export const ROUTES: Paths = {
  HOME: { path: '', component: BoardComponent },
  HEADER: { path: '', component: HeaderComponent, outlet: 'header' },
  POST: { path: 'post', children: [
      { path: ':id', component: FormComponent }]
  },
}

export type Paths = {
  [key: string]: Path;
}

type Path = Partial<{
    path: string,
    component: Type<any>,
    outlet: string,
    resolve: ResolveData,
    redirectTo: string,
    children: Children[]
  }>

type Children = Path
