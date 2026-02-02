import { formatDate } from '@angular/common';
import { ConfigOption, FormlyFieldConfig } from '@ngx-formly/core';
import { RepeatTypeComponent } from './repeat-section/repeat-section';

export const formlyConfigOption: ConfigOption = {
  types: [{ name: 'repeat', component: RepeatTypeComponent }],
  validationMessages: [
    {
      name: 'required',
      message: (_error, field) => `${field.props?.label} field is required`,
    },
    {
      name: 'min',
      message: (error) => `The minimum allowed value is ${error.min}`,
    },
    {
      name: 'max',
      message: (error) => `The maximum allowed value is ${error.max}`,
    },
    {
      name: 'pattern',
      message: 'Invalid format',
    },
    {
      name: 'invalidDate',
      message: (_error, field) => `${field.props?.label ?? field.key} has an invalid date`,
    },
    {
      name: 'minDate',
      message: (error, field) =>
        `${field.props?.label ?? field.key} must be after ${formatDate(error.min, 'dd-MM-yyyy', 'en-GB')}`,
    },
    {
      name: 'maxDate',
      message: (error, field) =>
        `${field.props?.label ?? field.key} must be before ${formatDate(error.max, 'dd-MM-yyyy', 'en-GB')}`,
    },
    {
      name: 'dateBefore',
      message: (error, field) => {
        const fromLabel = getLabel(field, error.fromKey);
        const toLabel = getLabel(field, error.toKey);

        return `${fromLabel} must be before ${toLabel}`;
      },
    },
  ],
};

function getLabel(field: FormlyFieldConfig, key: string): string {
  const target = field.fieldGroup?.find((f) => f.key === key);

  return target?.props?.label ?? key;
}
