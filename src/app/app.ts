import { Component } from '@angular/core';
import { CarForm } from './car-form/car-form';

@Component({
  selector: 'app-root',
  imports: [CarForm],
  template: ` <app-car-form /> `,
})
export class App {}
