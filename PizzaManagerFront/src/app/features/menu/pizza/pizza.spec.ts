import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { provideRouter, Router } from '@angular/router';
import { signal, Signal } from '@angular/core';
import { of, Subject } from 'rxjs';

import { PizzaComponent } from './pizza';
import { PizzaFacadeService } from '../../../core/services/pizza.facade.service';
import { DictionaryFacadeService } from '../../../core/services/dictionary.facade.service';
import { categorysValidator, ingredientsValidator, variantValidator } from './pizza.validators';
import { pizzaWeightBySize } from './pizza.model';

// ---------------------------------------------------------------------------
// Helpers / stubs
// ---------------------------------------------------------------------------

const mockIngredients = [
  { id: 1, name: 'Пепперони' },
  { id: 2, name: 'Моцарелла' },
  { id: 3, name: 'Томатный соус' },
];

const mockCategories = [
  { id: 10, name: 'Классика' },
  { id: 11, name: 'Острая' },
];

const mockPizza = {
  id: 42,
  name: 'Пепперони',
  description: 'Острая колбаска',
  categories: ['Классика'],
  ingredients: ['Пепперони', 'Моцарелла'],
  variants: [
    { size: 'S', weight: 280, price: 599, inStock: true },
    { size: 'M', weight: 350, price: 799, inStock: false },
    { size: 'L', weight: 420, price: 999, inStock: true },
  ],
};

function buildMockDictionaryService() {
  return {
    getCategories: vi.fn(() =>
      of(mockCategories)
    ),
    getIngredients: vi.fn(() => of(mockIngredients)),
  };
}

function buildMockPizzaService() {
  return {
    getPizzaById: vi.fn(() => of(mockPizza)),
    addPizza: vi.fn(() => of({})),
    updatePizza: vi.fn(() => of({})),
  };
}



// ---------------------------------------------------------------------------
// Validator unit tests (pure functions – no Angular TestBed needed)
// ---------------------------------------------------------------------------

describe('categorysValidator', () => {
  it('returns null when the minimum number of categories is selected', () => {
    const ctrl = new FormControl([mockCategories[0]]);
    const validator = categorysValidator(1);
    expect(validator(ctrl)).toBeNull();
  });

  it('returns error when no category is selected', () => {
    const ctrl = new FormControl(null);
    const validator = categorysValidator(1);
    expect(validator(ctrl)).toEqual({ minSelected: true });
  });

  it('returns error when selected count is below minimum', () => {
    const ctrl = new FormControl([mockCategories[0]]);
    const validator = categorysValidator(2);
    expect(validator(ctrl)).toEqual({ minSelected: true });
  });
});

describe('ingredientsValidator', () => {
  it('returns null when at least one ingredient is selected', () => {
    const ctrl = new FormControl([true, false, false]);
    const validator = ingredientsValidator(1);
    expect(validator(ctrl)).toBeNull();
  });

  it('returns error when no ingredient is selected', () => {
    const ctrl = new FormControl([false, false, false]);
    const validator = ingredientsValidator(1);
    expect(validator(ctrl)).toEqual({ minSelected: true });
  });

  it('returns error when value is not a boolean array', () => {
    const ctrl = new FormControl(null);
    const validator = ingredientsValidator(1);
    expect(validator(ctrl)).toEqual({ minSelected: true });
  });

  it('respects custom minimum', () => {
    const ctrl = new FormControl([true, false, false]);
    const validator = ingredientsValidator(2);
    expect(validator(ctrl)).toEqual({ minSelected: true });
  });
});

describe('variantValidator', () => {
  function buildGroup(inStock: boolean, size: string | null, weight: number | null, price: number | null) {
    return new (class {
      get(key: string) {
        const map: Record<string, { value: unknown }> = {
          inStock: { value: inStock },
          size: { value: size },
          weight: { value: weight },
          price: { value: price },
        };
        return map[key];
      }
    })() as any;
  }

  it('returns null when variant is not in stock (validation skipped)', () => {
    const group = buildGroup(false, null, null, null);
    expect(variantValidator(group)).toBeNull();
  });

  it('returns null when variant is in stock and all fields are filled', () => {
    const group = buildGroup(true, 'S', 280, 599);
    expect(variantValidator(group)).toBeNull();
  });

  it('returns error when variant is in stock but price is missing', () => {
    const group = buildGroup(true, 'S', 280, null);
    expect(variantValidator(group)).toEqual({ requiredFieldsMissing: true });
  });

  it('returns error when variant is in stock but weight is missing', () => {
    const group = buildGroup(true, 'M', null, 799);
    expect(variantValidator(group)).toEqual({ requiredFieldsMissing: true });
  });
});

// ---------------------------------------------------------------------------
// pizzaWeightBySize model constant
// ---------------------------------------------------------------------------

describe('pizzaWeightBySize', () => {
  it('contains correct default weights for all sizes', () => {
    expect(pizzaWeightBySize['S']).toBe(280);
    expect(pizzaWeightBySize['M']).toBe(350);
    expect(pizzaWeightBySize['L']).toBe(420);
  });
});

// ---------------------------------------------------------------------------
// PizzaComponent integration tests (TestBed)
// ---------------------------------------------------------------------------

async function createComponent(idValue?: string) {
  const dictionaryService = buildMockDictionaryService();
  const pizzaService = buildMockPizzaService();

  await TestBed.configureTestingModule({
    imports: [PizzaComponent, ReactiveFormsModule],
    providers: [
      { provide: DictionaryFacadeService, useValue: dictionaryService },
      { provide: PizzaFacadeService, useValue: pizzaService },
      provideRouter([]),
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(PizzaComponent);
  const component = fixture.componentRef.instance;

  // Spy on the real Router instance provided by provideRouter
  const router = TestBed.inject(Router);
  vi.spyOn(router, 'navigate').mockResolvedValue(true);

  // Set input signal if id is provided
  if (idValue !== undefined) {
    fixture.componentRef.setInput('id', idValue);
  }

  fixture.detectChanges();

  return { fixture, component, dictionaryService, pizzaService, router };
}

describe('PizzaComponent – form structure', () => {
  it('builds a form with the expected controls', async () => {
    const { component } = await createComponent();
    const { name, description, categorys, ingredients, variants } = component.pizzaForm.controls;

    expect(name).toBeDefined();
    expect(description).toBeDefined();
    expect(categorys).toBeDefined();
    expect(ingredients).toBeDefined();
    expect(variants).toBeDefined();
  });

  it('creates one variant FormGroup per pizza size (S, M, L)', async () => {
    const { component } = await createComponent();
    const variantControls = component.pizzaForm.controls.variants.controls;

    expect(variantControls).toHaveLength(3);
    expect(variantControls.map(c => c.controls.size.value)).toEqual(['S', 'M', 'L']);
  });

  it('pre-fills variant weights from pizzaWeightBySize', async () => {
    const { component } = await createComponent();
    const [s, m, l] = component.pizzaForm.controls.variants.controls;

    expect(s.controls.weight.value).toBe(280);
    expect(m.controls.weight.value).toBe(350);
    expect(l.controls.weight.value).toBe(420);
  });

  it('creates one boolean FormControl per ingredient', async () => {
    const { component } = await createComponent();
    // mockIngredients has 3 items
    expect(component.pizzaForm.controls.ingredients.controls).toHaveLength(3);
  });

  it('initialises all ingredient controls to false', async () => {
    const { component } = await createComponent();
    component.pizzaForm.controls.ingredients.controls.forEach(ctrl => {
      expect(ctrl.value).toBe(false);
    });
  });
});

describe('PizzaComponent – computed signals', () => {
  it('header() returns "Новая пицца" when not in edit mode', async () => {
    const { component } = await createComponent();
    expect(component.header()).toBe('Новая пицца');
  });

  it('nameSaveButton() returns "Сохранить" when not in edit mode', async () => {
    const { component } = await createComponent();
    expect(component.nameSaveButton()).toBe('Сохранить');
  });
});

describe('PizzaComponent – form validation', () => {
  it('isFormInvalid() returns true when form is empty', async () => {
    const { component } = await createComponent();
    expect(component.isFormInvalid()).toBe(true);
  });

  it('isFormInvalid() returns false after filling required fields', async () => {
    const { component } = await createComponent();
    const form = component.pizzaForm;

    form.controls.name.setValue('Маргарита');
    form.controls.description.setValue('Классическая');
    form.controls.categorys.setValue([mockCategories[0]]);
    // select one ingredient
    form.controls.ingredients.controls[0].setValue(true);
    // fill S variant (inStock = true by default, weight already set, just add price)
    form.controls.variants.controls[0].controls.price.setValue(499);
    // turn off M and L so their missing price doesn't matter
    form.controls.variants.controls[1].controls.inStock.setValue(false);
    form.controls.variants.controls[2].controls.inStock.setValue(false);

    form.updateValueAndValidity();
    expect(component.isFormInvalid()).toBe(false);
  });
});

describe('PizzaComponent – addOrUpdatePizza (create mode)', () => {
  /*it('calls pizzaService.addPizza with the correct payload', async () => {
    const { component, pizzaService, router } = await createComponent();
    const form = component.pizzaForm;

    form.controls.name.setValue('Маргарита');
    form.controls.description.setValue('Классика томата');
    form.controls.categorys.setValue([mockCategories[0]]);
    form.controls.ingredients.controls[0].setValue(true);
    form.controls.variants.controls[0].controls.price.setValue(399);
    form.controls.variants.controls[1].controls.inStock.setValue(false);
    form.controls.variants.controls[2].controls.inStock.setValue(false);

    component.addOrUpdatePizza();

    expect(pizzaService.addPizza).toHaveBeenCalledOnce();
    const payload = pizzaService.addPizza.mock.calls[0][0];
    expect(payload.name).toBe('Маргарита');
    expect(payload.description).toBe('Классика томата');
    expect(payload.categoryIds).toEqual([10]);
    expect(payload.ingredientIds).toContain(1);
    expect(Array.isArray(payload.variants)).toBe(true);
  });*/

  it('navigates to /menu after successful creation', async () => {
    const { component, pizzaService, router } = await createComponent();
    const form = component.pizzaForm;

    form.controls.name.setValue('Тест');
    form.controls.description.setValue('Описание');
    form.controls.categorys.setValue([mockCategories[1]]);
    form.controls.ingredients.controls[1].setValue(true);
    form.controls.variants.controls[0].controls.price.setValue(299);
    form.controls.variants.controls[1].controls.inStock.setValue(false);
    form.controls.variants.controls[2].controls.inStock.setValue(false);

    component.addOrUpdatePizza();

    expect(router.navigate).toHaveBeenCalledWith(['/menu']);
  });

  it('does NOT call addPizza when form is invalid', async () => {
    const { component, pizzaService } = await createComponent();
    component.addOrUpdatePizza();
    expect(pizzaService.addPizza).not.toHaveBeenCalled();
  });
});

describe('PizzaComponent – edit mode (with id)', () => {
  it('calls getPizzaById with the numeric id', async () => {
    const { pizzaService } = await createComponent('42');
    expect(pizzaService.getPizzaById).toHaveBeenCalledWith(42);
  });

  it('patches name and description from the server response', async () => {
    const { component } = await createComponent('42');
    expect(component.pizzaForm.controls.name.value).toBe('Пепперони');
    expect(component.pizzaForm.controls.description.value).toBe('Острая колбаска');
  });

  it('sets isEdit to true', async () => {
    const { component } = await createComponent('42');
    expect(component.isEdit()).toBe(true);
  });

  it('header() returns "Редактирование" in edit mode', async () => {
    const { component } = await createComponent('42');
    expect(component.header()).toBe('Редактирование');
  });

  it('nameSaveButton() returns "Сохранить изменения" in edit mode', async () => {
    const { component } = await createComponent('42');
    expect(component.nameSaveButton()).toBe('Сохранить изменения');
  });

  it('calls pizzaService.updatePizza (not addPizza) on save', async () => {
    const { component, pizzaService } = await createComponent('42');
    const form = component.pizzaForm;

    // Patch remaining required fields not covered by the mock response
    form.controls.categorys.setValue([mockCategories[0]]);
    form.controls.ingredients.controls[0].setValue(true);
    form.controls.variants.controls[0].controls.price.setValue(599);
    form.controls.variants.controls[1].controls.inStock.setValue(false);
    form.controls.variants.controls[2].controls.price.setValue(999);

    component.addOrUpdatePizza();

    expect(pizzaService.updatePizza).toHaveBeenCalledOnce();
    expect(pizzaService.addPizza).not.toHaveBeenCalled();
  });

  it('does NOT call getPizzaById when id is not a number', async () => {
    const { pizzaService } = await createComponent('abc');
    expect(pizzaService.getPizzaById).not.toHaveBeenCalled();
  });

  it('does NOT call getPizzaById when no id is provided', async () => {
    const { pizzaService } = await createComponent();
    expect(pizzaService.getPizzaById).not.toHaveBeenCalled();
  });
});

describe('PizzaComponent – DictionaryFacadeService integration', () => {
  it('calls getIngredients on init', async () => {
    const { dictionaryService } = await createComponent();
    expect(dictionaryService.getIngredients).toHaveBeenCalled();
  });

  it('calls getCategories on init', async () => {
    const { dictionaryService } = await createComponent();
    expect(dictionaryService.getCategories).toHaveBeenCalled();
  });

  it('exposes loaded ingredients via ingredients signal', async () => {
    const { component } = await createComponent();
    expect(component.ingredients()).toHaveLength(mockIngredients.length);
    expect(component.ingredients()?.[0].name).toBe('Пепперони');
  });
});