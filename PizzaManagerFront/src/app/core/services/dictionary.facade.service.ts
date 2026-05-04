import { inject, Injectable } from "@angular/core";
import { DictionaryApi } from "./dictionary.api";
import { Category, Courier, Customer, IDictionaryApi, Ingredient } from "../models/dictionaly.model";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DictionaryFacadeService {
    dictionaryApi = inject<IDictionaryApi>(DictionaryApi);

    getCustomers(): Observable<Customer[]> {
        return this.dictionaryApi.getCustomers();
    }

    getCouriers(): Observable<Courier[]> {
        return this.dictionaryApi.getCouriers();
    }

    getCategories(): Observable<Category[]> {
        return this.dictionaryApi.getCategories();
    }

    getIngredients(): Observable<Ingredient[]> {
        return this.dictionaryApi.getIngredients();
    }
}