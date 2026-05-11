import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CreatePizza, IPizzaApi, PizzaResponce } from '../models/pizza.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PizzaApi implements IPizzaApi {
  private apiUrl = '/api/pizzas';
  private readonly _httpClient = inject(HttpClient);

  getPizzas(): Observable<PizzaResponce[]> {
    return this._httpClient.get<PizzaResponce[]>(this.apiUrl);
  }

  getPizzaById(id: number): Observable<PizzaResponce> {
    return this._httpClient.get<PizzaResponce>(`${this.apiUrl}/${id}`);
  }

  addPizza(payload: CreatePizza): Observable<PizzaResponce> {
    return this._httpClient.post<PizzaResponce>(this.apiUrl, payload);
  }

  updatePizza(payload: CreatePizza): Observable<void> {
    return this._httpClient.put<void>(this.apiUrl, payload);
  }

  deletePizza(id: number): Observable<void> {
    return this._httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
