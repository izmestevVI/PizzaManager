import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Category, Courier, Customer, IDictionaryApi, Ingredient } from "../models/dictionaly.model";

@Injectable({
  providedIn: 'root'
})
export class DictionaryApi implements IDictionaryApi {
    private apiUrl = '/api/dictionary';
    private readonly _httpClient = inject(HttpClient);

    getCustomers(): Observable<Customer[]> {
        return this._httpClient.get<Customer[]>(`${this.apiUrl}/customers`);
    }

    getCouriers(): Observable<Courier[]> {
        return this._httpClient.get<Courier[]>(`${this.apiUrl}/couriers`);
    }

    getCategories(): Observable<Category[]> {
        return this._httpClient.get<Category[]>(`${this.apiUrl}/categories`);
    }

    getIngredients(): Observable<Ingredient[]> {
        return this._httpClient.get<Ingredient[]>(`${this.apiUrl}/ingredients`);
    }
}