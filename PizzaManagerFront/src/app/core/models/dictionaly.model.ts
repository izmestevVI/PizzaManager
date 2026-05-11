import { Observable } from 'rxjs';

export interface IDictionaryApi {
  getCustomers(): Observable<Customer[]>;
  getCouriers(): Observable<Courier[]>;
  getCategories(): Observable<Category[]>;
  getIngredients(): Observable<Ingredient[]>;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  address: string;
}

export interface Courier {
  id: number;
  name: string;
  phone: string;
  status: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Ingredient {
  id: number;
  name: string;
}
