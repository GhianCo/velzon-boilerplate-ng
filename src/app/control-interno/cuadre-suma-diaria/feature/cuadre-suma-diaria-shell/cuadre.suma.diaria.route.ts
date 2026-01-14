import {Routes} from "@angular/router";
import {CuadreSumaDiariaPage} from "./cuadre.suma.diaria.page";
import {
  CuadreSumaDiariaList
} from "@app/control-interno/cuadre-suma-diaria/feature/cuadre-suma-diaria-list/cuadre.suma.diaria.list";
import {
  CuadreSumaDiariaListResolver
} from "@app/control-interno/cuadre-suma-diaria/feature/cuadre-suma-diaria-list/cuadre.suma.diaria.list.resolver";
import {
  CuadreSumaDiariaNew
} from "@app/control-interno/cuadre-suma-diaria/feature/cuadre-suma-diaria-new/cuadre.suma.diaria.new";
import {
  CuadreSumaDiariaNewResolver
} from "@app/control-interno/cuadre-suma-diaria/feature/cuadre-suma-diaria-new/cuadre.suma.diaria.new.resolver";
import {
  CuadreSumaDiariaVisualizar
} from "@app/control-interno/cuadre-suma-diaria/feature/cuadre-suma-diaria-visualizar/cuadre.suma.diaria.visualizar";

export default [
  {
    path: '',
    component: CuadreSumaDiariaPage,
    children: [
      {
        path: '',
        component: CuadreSumaDiariaList,
        resolve: {
          data: CuadreSumaDiariaListResolver,
        },
      },
      {
        path: "nuevo",
        component: CuadreSumaDiariaNew,
        resolve: {
          data: CuadreSumaDiariaNewResolver,
        },
      },
      {
        path: "visualizar/:id",
        component: CuadreSumaDiariaVisualizar,
      },
    ]
  }
] as Routes;
