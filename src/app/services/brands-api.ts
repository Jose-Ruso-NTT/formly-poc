import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandsApi {
  #http = inject(HttpClient);

  #apiUrl = 'http://localhost:3000';
  #brands = 'brands';
  #models = 'models';

  /**
   * Get all car brands
   * @returns List of car brands
   */
  getBrands(): Observable<any[]> {
    const url = `${this.#apiUrl}/${this.#brands}`;
    return this.#http.get<any[]>(url).pipe(
      map((res) => {
        return res.map((brand) => ({
          label: brand,
          value: brand,
        }));
      }),
    );
  }

  /**
   * Get models by car brand
   * @param brandId
   * @returns List of models for the specified brand
   */
  getModelsByBrand(brandId: string): Observable<any[]> {
    const url = `${this.#apiUrl}/${this.#brands}/${brandId}/${this.#models}`;
    return this.#http.get<any[]>(url).pipe(
      map((res) => {
        return res.map((brand) => ({
          label: brand,
          value: brand,
        }));
      }),
    );
  }
}
