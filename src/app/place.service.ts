import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import Place from './model/place';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import FormattedPlace from './model/formattedplace';
import { FormGroup, Validators, FormControl } from '@angular/forms';

const groupBy = (data, keyFn) => data.reduce((agg, item) => {
  const group = keyFn(item);
  agg[group] = [...(agg[group] || []), item];
  return agg;
}, {});

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  places: IPlaceService = {};

  constructor(private http: HttpClient) { }

  loadPlace(city: string, name: string) {
    if (this.places[name] && this.places[name].search === city) {
      return;
    }

    const body = new HttpParams()
      .set('key', 'ImBuildingASearchBar')
      .set('locale', 'fr')
      .set('term', city);
    this.http.post<FormattedPlace>('https://interview.sobus.fr:8080/autocomplete', body)
    .pipe(
      map(data => groupBy(data, (item: Place) => item.c))
    ).subscribe(
      res => {
        this.places[name] = {
          search: city,
          countrys: Object.keys(res),
          places: res
        };
      }
    )
  }
}

interface IPlaceService {
  [key: string]: {
    search: string,
    countrys: string[],
    places: FormattedPlace
  };
}
