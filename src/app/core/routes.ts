import {ResolveData, Routes} from "@angular/router";
import {Type} from "@angular/core";
import {BoardComponent} from "../features/board/board.component";
import {HeaderComponent} from "./header/header.component";

export const ROUTES: Paths = {
  HOME: { path: '', component: BoardComponent },
  HEADER: { path: '', component: HeaderComponent, outlet: 'header' }
}

type Paths = {
  [key: string]: Partial<{
    path: string,
    component: Type<any>,
    outlet: string,
    resolve: ResolveData,
    redirectTo: string,
  }>
}
