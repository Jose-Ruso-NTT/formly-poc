import { Component, inject } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { distinctUntilChanged, of, startWith, switchMap, tap } from 'rxjs';
import { BrandsApi } from '../services/brands-api';
import { CustomValidators } from '../validators/custom-validators';

const LICENSE_PLACE_REGEX = /^\d{4}\s?[B-DF-HJ-NP-TV-Z]{3}$/;
const MAX_MANUFACTURE_DATE = new Date().getFullYear();
const MIN_MANUFACTURE_YEAR = 1900;
const MAX_REGISTRATION_DATE = new Date();
const MIN_REGISTRATION_DATE = new Date('1900-01-01');
const MIN_MILEAGE = 0;
const MIN_PRICE = 1;

interface CreateCar {
  brand: string;
  model: string;
  carDetails: CarDetails[];
}

interface CarDetails {
  registrationDate: string;
  mileage: number | null;
  currency: string;
  price: number | null;
  manufactureYear: number | null;
  availability: boolean;
  licensePlate: string;
}

const DEFAULT_CAR_DETAIL: CarDetails = {
  registrationDate: '',
  mileage: null,
  currency: '',
  price: null,
  manufactureYear: null,
  availability: false,
  licensePlate: '',
};

function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule, FormlyForm],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit(model)" class="container border rounded mt-3 p-3">
      <formly-form [form]="form" [fields]="fields" [model]="model" class="row"></formly-form>

      <button type="submit" class="btn btn-primary mt-3">Save car</button>
    </form>
  `,
})
export class CarForm {
  readonly #api = inject(BrandsApi);

  constructor() {
    const res = {
      brand: 'Toyota',
      model: 'Corolla',
      id: '1183764f-b4a5-447d-bd94-500721d0cd97',
      total: 2,
      carDetails: [
        {
          availability: true,
          currency: 'USD',
          licensePlate: '1111 BBB',
          manufactureYear: 2026,
          mileage: 30000,
          price: 25000,
          registrationDate: '2026-02-02T15:09:06.278Z',
        },
        {
          availability: false,
          currency: 'EUR',
          licensePlate: '2222 CCC',
          manufactureYear: 2026,
          mileage: 0,
          price: 40000,
          registrationDate: '2026-02-02T15:09:06.278Z',
        },
      ],
    };

    this.model = {
      ...res,
      carDetails: res.carDetails.map((detail) => ({
        ...detail,
        registrationDate: formatDateToISO(new Date(detail.registrationDate)),
      })),
    };
  }

  readonly form = new FormGroup({});
  model: CreateCar = {
    brand: '',
    model: '',
    carDetails: [DEFAULT_CAR_DETAIL],
  };

  readonly carDetailFields: FormlyFieldConfig[] = [
    {
      key: 'registrationDate',
      type: 'input',
      className: 'col-md-6',
      props: {
        type: 'date',
        label: 'Registration date',
        required: true,
        attributes: {
          max: formatDateToISO(new Date()),
          min: '1900-01-01',
        },
      },
      validators: {
        validation: [
          CustomValidators.maxDate(MAX_REGISTRATION_DATE),
          CustomValidators.minDate(MIN_REGISTRATION_DATE),
        ],
      },
    },
    {
      key: 'manufactureYear',
      type: 'input',
      className: 'col-md-6',
      props: {
        type: 'number',
        label: 'Manufacture year',
        required: true,
        min: MIN_MANUFACTURE_YEAR,
        max: MAX_MANUFACTURE_DATE,
      },
    },
    {
      key: 'mileage',
      type: 'input',
      className: 'col-md-6',
      props: {
        type: 'number',
        label: 'Mileage',
        required: true,
        min: MIN_MILEAGE,
      },
    },
    {
      key: 'currency',
      type: 'select',
      className: 'col-md-6',
      props: {
        label: 'Currency',
        required: true,
        options: [
          { label: 'EUR', value: 'EUR' },
          { label: 'USD', value: 'USD' },
        ],
      },
    },
    {
      key: 'price',
      type: 'input',
      className: 'col-md-6',
      props: {
        type: 'number',
        label: 'Price',
        required: true,
        min: MIN_PRICE,
      },
    },
    {
      key: 'licensePlate',
      type: 'input',
      className: 'col-md-6',
      props: {
        label: 'License plate',
        required: true,
        pattern: LICENSE_PLACE_REGEX,
      },
    },
    {
      key: 'availability',
      type: 'checkbox',
      className: 'col-md-6',
      props: {
        label: 'Available',
      },
    },
  ];

  readonly fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'brand',
          type: 'select',
          className: 'col-md-6',
          props: {
            label: 'Brand',
            required: true,
            options: this.#api.getBrands(),
          },
        },
        {
          key: 'model',
          type: 'select',
          className: 'col-md-6',
          props: {
            label: 'Model',
            required: true,
            options: [],
          },
          hooks: {
            onInit: (field) => {
              const userControl = field.form!.get('brand');

              if (!userControl) {
                return;
              }

              field.props!.options = userControl.valueChanges.pipe(
                startWith(userControl.value),
                distinctUntilChanged(),
                tap((brand) => {
                  if (!brand) {
                    field.formControl?.disable();
                    field.formControl?.reset();
                  } else {
                    field.formControl?.enable();
                  }
                }),
                switchMap((brand) => (brand ? this.#api.getModelsByBrand(brand) : of([]))),
              );
            },
          },
        },
      ],
    },
    // ===== FormArray =====
    {
      key: 'carDetails',
      type: 'repeat',
      props: {
        label: 'Car details',
        addText: 'Add car detail',
      },
      fieldArray: {
        validators: {
          validation: [CustomValidators.dateBeforeValidator('manufactureYear', 'registrationDate')],
        },
        fieldGroupClassName: 'row',
        fieldGroup: this.carDetailFields,
      },
    },
  ];

  onSubmit(model: CreateCar) {
    console.log(model);
    console.log(this.form.getRawValue());
  }
}
