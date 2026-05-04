import { inject, Injectable, signal } from "@angular/core";
import { CreatePizza, IPizzaApi, PizzaResponce } from "../models/pizza.model";
import { Observable } from "rxjs";
import { PizzaApi } from "./pizza.api";

@Injectable({
  providedIn: 'root'
})
export class PizzaFacadeService {
  dataPizzaService = inject<IPizzaApi>(PizzaApi)

  private readonly _isRefreshOrders = signal<string>('');
  isRefreshOrders = this._isRefreshOrders.asReadonly();

  getPizzas(): Observable<PizzaResponce[]> {
    return this.dataPizzaService.getPizzas()
  }

  getPizzaById(id: number): Observable<PizzaResponce> {
    return this.dataPizzaService.getPizzaById(id)
  }

  deletePizza(id: number): Observable<void> {
    return this.dataPizzaService.deletePizza(id)
  }

  refreshOrders() {
    this._isRefreshOrders.set(new Date().toISOString());
  }

  addPizza(payload: CreatePizza): Observable<PizzaResponce> {
    return this.dataPizzaService.addPizza(payload);
  }

  updatePizza(payload: CreatePizza): Observable<void> {
    return this.dataPizzaService.updatePizza(payload);
  }
}