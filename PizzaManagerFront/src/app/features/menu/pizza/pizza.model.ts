import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PizzaSize } from '../../../core/models/pizza.model';
import { Category } from '../../../core/models/dictionaly.model';

export interface PizzaVariantForm {
  size: FormControl<PizzaSize | null>;
  weight: FormControl<number | null>;
  price: FormControl<number | null>;
  inStock: FormControl<boolean | null>;
}
export interface PizzaForm {
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  categorys: FormControl<Category[] | null>;
  ingredients: FormArray<FormControl<boolean | null>>;
  variants: FormArray<FormGroup<PizzaVariantForm>>;
}

export const pizzaWeightBySize: Record<PizzaSize, number> = {
  S: 280,
  M: 350,
  L: 420,
};
