import { Component } from '@angular/core';
import { FieldArrayType, FormlyField, FormlyValidationMessage } from '@ngx-formly/core';

@Component({
  selector: 'formly-repeat-section',
  standalone: true,
  imports: [FormlyField, FormlyValidationMessage],
  template: `
    <div class="mb-4 border rounded p-3">
      <!-- Campos -->
      <div class="row">
        @for (field of field.fieldGroup; track $index) {
          @if (props.label) {
            <legend class="mb-2">{{ props.label }} #{{ $index + 1 }}</legend>
          }

          @if (props.description) {
            <p class="text-muted">{{ props.description }}</p>
          }

          <formly-field [field]="field"></formly-field>

          <!-- Botón remove -->
          <div class="d-flex justify-content-end mt-3">
            <button
              type="button"
              class="btn btn-outline-danger"
              (click)="remove($index)"
              aria-label="Remove item"
            >
              Remove
            </button>
          </div>

          <!-- Errores de grupo -->
          @if (showError) {
            <div class="text-danger mt-2">
              <formly-validation-message [field]="field"></formly-validation-message>
            </div>
          }
        }
      </div>
    </div>

    <!-- Add -->
    <div class="mt-3">
      <button type="button" class="btn btn-primary" (click)="addForm()">
        {{ props['addText'] || 'Add' }}
      </button>
    </div>
  `,
})
export class RepeatTypeComponent extends FieldArrayType {
  addForm(): void {
    const formArray = this.formControl;

    if (!formArray) {
      return;
    }

    if (formArray.invalid) {
      // 🔴 Marca TODO como touched
      formArray.markAllAsTouched();
      return;
    }

    // ✅ Solo si es válido se añade
    this.add();
  }
}
