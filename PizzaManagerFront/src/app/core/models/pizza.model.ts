import { Observable } from 'rxjs';

export interface IPizzaApi {
  getPizzas(): Observable<PizzaResponce[]>;
  getPizzaById(id: number): Observable<PizzaResponce>;
  addPizza(payload: CreatePizza): Observable<PizzaResponce>;
  updatePizza(payload: CreatePizza): Observable<void>;
  deletePizza(id: number): Observable<void>;
}

export type PizzaSize = 'S' | 'M' | 'L';

export interface PizzaVariant {
  size: PizzaSize;
  weight: number;
  price: number;
  inStock: boolean;
}

export interface PizzaBase {
  name: string;
  description: string;
  image: string;
  variants: PizzaVariant[];
}

export interface PizzaResponce extends PizzaBase {
  id: number;
  categories: string[];
  ingredients: string[];
}

export interface CreatePizza extends PizzaBase {
  categoryIds: number[];
  ingredientIds: number[];
}
