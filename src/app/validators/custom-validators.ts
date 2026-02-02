import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static maxDate(date: Date): ValidatorFn {
    return maxDate(date);
  }

  static minDate(date: Date): ValidatorFn {
    return minDate(date);
  }

  static dateBeforeValidator(controlName1: string, controlName2: string): ValidatorFn {
    return dateBeforeValidator(controlName1, controlName2);
  }
}

export function maxDate(max: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = new Date(control.value);

    if (isNaN(value.getTime())) {
      return {
        invalidDate: true,
      };
    }

    if (value > max) {
      return {
        maxDate: {
          max,
          actual: value,
        },
      };
    }

    return null;
  };
}

export function minDate(min: Date): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const value = new Date(control.value);

    if (isNaN(value.getTime())) {
      return {
        invalidDate: true,
      };
    }

    if (value < min) {
      return {
        minDate: {
          min,
          actual: value,
        },
      };
    }

    return null;
  };
}

export function dateBeforeValidator(fromKey: string, toKey: string): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const fromControl = formGroup.get(fromKey);
    const toControl = formGroup.get(toKey);

    if (!fromControl || !toControl) {
      return null;
    }

    const year = fromControl.value;
    const toValue = toControl.value;

    if (!year || !toValue) {
      return null;
    }

    const fromDate = new Date(Number(year), 0, 1);
    const toDate = new Date(toValue);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return null;
    }

    if (fromDate >= toDate) {
      return {
        dateBefore: {
          fromKey,
          toKey,
          from: fromDate,
          to: toDate,
        },
      };
    }

    return null;
  };
}
