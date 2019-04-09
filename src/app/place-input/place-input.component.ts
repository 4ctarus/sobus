import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { PlaceService } from '../place.service';
import Place from '../model/place';

@Component({
  selector: 'app-place-input',
  templateUrl: './place-input.component.html',
  styleUrls: ['./place-input.component.scss']
})
export class PlaceInputComponent implements OnInit {
  private _isMobile: boolean;
  @Input() fg: FormGroup;
  @Input() placeholder: string;
  @Input() name: string;
  @Input() set isMobile(isMobile: boolean) {
    if (isMobile !== this._isMobile) {
      this._isMobile = isMobile;
    }
  }
  get isMobile(): boolean { return this._isMobile; }
  nTimer: Subscription;

  constructor(private router: Router, public placeService: PlaceService) { }

  ngOnInit() {
    this.fg.addControl(this.name, new FormControl(null, [Validators.required, this.isPlace]));
    this.fg.get(this.name).valueChanges.subscribe((val: string) => {
      if (this.nTimer) {
        this.nTimer.unsubscribe();
      }
      if (val && val.length >= 2) {
        this.nTimer = timer(300).subscribe(t => {
          this.placeService.loadPlace(val, this.name);
        });
      }
    });
  }

  isPlace(c: FormControl) {
    if (typeof c.value === 'object') {
      return null;
    }
    return { from: true };
  }

  openPlaceDialog() {
    if (!this.isMobile) {
      return;
    }
    this.router.navigate([''], { fragment: this.name });
  }

  displayFn(place?: Place): string | undefined {
    return place ? place.n : undefined;
  }
}
