import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function categorysValidator(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value && value.length >= min ? null : { minSelected: true };
  };
}

export function ingredientsValidator(min = 1): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (Array.isArray(value) && typeof value[0] === 'boolean') {
      const selectedCount = value.filter(v => v === true).length;
      return selectedCount >= min ? null : { minSelected: true };
    }
    return { minSelected: true };
  };
}

export const variantValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const inStock = group.get('inStock')?.value;
  const size = group.get('size')?.value;
  const weight = group.get('weight')?.value;
  const price = group.get('price')?.value;
  if (inStock) {
    if (!size || !weight || !price) {
      return { requiredFieldsMissing: true };
    }
  }
  return null;
};
