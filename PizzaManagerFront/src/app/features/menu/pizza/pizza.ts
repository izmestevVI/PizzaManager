import { Component, computed, DestroyRef, effect, inject, input, OnInit, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, ChevronDown, Pen, Image, Save, ArrowLeft, Pizza } from 'lucide-angular';
import { Category, Ingredient } from '../../../core/models/dictionaly.model';
import { CreatePizza, PizzaResponce, PizzaSize, PizzaVariant } from '../../../core/models/pizza.model';
import { DictionaryFacadeService } from '../../../core/services/dictionary.facade.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { InputComponent } from "../../../shared/ui-kit/input/input";
import { TextareaComponent } from "../../../shared/ui-kit/textarea/textarea";
import { ToggleComponent } from "../../../shared/ui-kit/toggle/toggle";
import { MultiSelectComponent } from "../../../shared/ui-kit/multi-select/multi-select";
import { SelectOption } from '../../../shared/ui-kit/base/base-select-control';
import { map, startWith } from 'rxjs';
import { CheckboxComponent } from "../../../shared/ui-kit/checkbox/checkbox";
import { PizzaFacadeService } from '../../../core/services/pizza.facade.service';
import { Router, RouterLink } from "@angular/router";
import { PizzaForm, PizzaVariantForm, pizzaWeightBySize } from './pizza.model';
import { categorysValidator, ingredientsValidator, variantValidator } from './pizza.validators';
import { ButtonComponent } from "../../../shared/ui-kit/button/button";

@Component({
  selector: 'app-pizza',
  imports: [ReactiveFormsModule, LucideAngularModule, InputComponent, TextareaComponent, ToggleComponent, MultiSelectComponent, CheckboxComponent, RouterLink, ButtonComponent],
  templateUrl: './pizza.html',
  styleUrl: './pizza.css',
})
export class PizzaComponent implements OnInit {
  ChevronDown = ChevronDown;
  Pen = Pen;
  Pizza = Pizza;
  Image = Image;
  Save = Save;
  ArrowLeft = ArrowLeft;
  id = input<string>();
  private destroyRef = inject(DestroyRef);
  router = inject(Router)
  pizzaService = inject(PizzaFacadeService);
  dictionaryService = inject(DictionaryFacadeService);
  categorys = toSignal(this.dictionaryService.getCategories().pipe(
    map(categories => categories.map(c => (<SelectOption<Category>>{ label: c.name, value: c })))
  ));
  ingredients = signal<Ingredient[] | null>(null)
  isEdit = signal<boolean>(false)

  pizzaForm = new FormGroup<PizzaForm>({
    name: new FormControl<string | null>(null, [Validators.required]),
    description: new FormControl<string | null>(null, [Validators.required]),
    categorys: new FormControl<Category[] | null>(null, [categorysValidator(1)]),
    ingredients: new FormArray<FormControl<boolean | null>>([], [ingredientsValidator(1)]),
    variants: new FormArray<FormGroup<PizzaVariantForm>>([])
  })

  readonly isFormInvalid = toSignal(
    this.pizzaForm.statusChanges.pipe(
      startWith(this.pizzaForm.status),
      map(status => status === 'INVALID')
    ),
    { initialValue: this.pizzaForm.invalid }
  );

  header = computed(() => {
    return this.isEdit() ? 'Редактирование' : 'Новая пицца'
  })
  nameSaveButton = computed(() => {
    return this.isEdit() ? 'Сохранить изменения' : 'Сохранить'
  })
  pizza = signal<PizzaResponce | null>(null);

  constructor() {
    this._addIngredientControl();
    this._addVariantsToFormArray()
    this._whachCategoriesPatch()
    this._whachIngredientsPatch()
    this._whachVariantsPatch()
  }

  ngOnInit(): void {
    const id = Number(this.id())
    if (id && !isNaN(id)) {
      this.pizzaService.getPizzaById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(pizza => {
          this.pizzaForm.patchValue({
            name: pizza.name,
            description: pizza.description,
          });
          this.isEdit.set(true)
          this.pizza.set(pizza)
        })
    }
  }

  private _whachCategoriesPatch() {
    effect(() => {
      const categories = this.categorys()
      const pizza = this.pizza()
      if (categories?.length && pizza) {
        const cats: Category[] = []
        pizza.categories.forEach(category => {
          const cat = categories.find(c => c.label === category)
          if (cat) {
            cats.push(cat.value)
          }
        })
        if (cats.length) {
          this.pizzaForm.controls.categorys.patchValue(cats)
        }
      }
    })
  }

  private _whachIngredientsPatch() {
    effect(() => {
      const ingredients = this.ingredients()
      const pizza = this.pizza()
      if (ingredients?.length && pizza) {
        pizza.ingredients.forEach(ingredient => {
          const indexIngredientControl = ingredients.findIndex(item => item.name === ingredient);
          if (indexIngredientControl !== -1) {
            this.pizzaForm.controls.ingredients.at(indexIngredientControl).patchValue(true)
          }
        })
      }
    })
  }

  private _whachVariantsPatch() {
    effect(() => {
      const pizza = this.pizza()
      if (pizza) {
        pizza.variants.forEach(variant => {
          const variantControl = this.pizzaForm.controls.variants.controls.find(control => control.controls.size.value === variant.size)
          if (variantControl) {
            variantControl.patchValue({ weight: variant.weight, price: variant.price, inStock: variant.inStock })
          }
        })
      }
    })
  }

  private _addVariantsToFormArray(): void {
    (<PizzaSize[]>['S', 'M', 'L']).forEach(pizzaSize => {
      const wight = pizzaWeightBySize[pizzaSize]
      const pizzaVariantForm = new FormGroup<PizzaVariantForm>({
        size: new FormControl<PizzaSize | null>(pizzaSize),
        weight: new FormControl<number | null>(wight),
        price: new FormControl<number | null>(null),
        inStock: new FormControl<boolean | null>(true)
      }, { validators: [variantValidator] })
      this.pizzaForm.controls.variants.push(pizzaVariantForm)
    })
  }

  private _addIngredientControl() {
    this.dictionaryService.getIngredients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(ingredients => {
        (this.pizzaForm.controls.ingredients as FormArray).clear();
        ingredients.forEach(() => {
          const control = new FormControl<boolean | null>(false);
          (this.pizzaForm.controls.ingredients as FormArray).push(control);
        });
        this.ingredients.set(ingredients);
      })
  }

  addOrUpdatePizza(): void {
    if (this.pizzaForm.valid) {
      const { name, description, categorys, variants, ingredients } = this.pizzaForm.value;
      const variantsPizza = variants?.map(v => (<PizzaVariant>{
        size: v.size ?? 'S',
        weight: v.weight ?? 0,
        price: v.price ?? 0,
        inStock: v.inStock ?? false
      }))
      const categoryIds = categorys?.map(c => c.id);
      const ingredientIds = ingredients
        ?.map((selected, index) => selected ? this.ingredients()?.[index].id : null)
        .filter(ingredient => typeof ingredient === 'number')

      if (categoryIds && ingredientIds && variantsPizza && name && description) {
        const payload: CreatePizza = {
          name,
          description,
          image: 'pizza.jpg',
          categoryIds,
          ingredientIds,
          variants: variantsPizza
        };
        this.isEdit() ? this._updatePizza(payload) : this._addPizza(payload)
      }
    }
  }

  private _addPizza(payload: CreatePizza): void {
    this.pizzaService.addPizza(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/menu']);
      });
  }

  private _updatePizza(payload: CreatePizza): void {
    this.pizzaService.updatePizza(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.router.navigate(['/menu']);
      });
  }
}
