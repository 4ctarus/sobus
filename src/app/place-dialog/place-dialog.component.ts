import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import Place from '../model/place';
import { Subscription, timer } from 'rxjs';
import { PlaceService } from '../place.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-place-dialog',
  templateUrl: './place-dialog.component.html',
  styleUrls: ['./place-dialog.component.scss']
})
export class PlaceDialogComponent implements OnInit {
  cityInput: string;
  changeTimer: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      fragment: string,
      fg: FormGroup
    },
    private dialogRef: MatDialogRef<PlaceDialogComponent>,
    public placeService: PlaceService) { }

  ngOnInit() {
    if (this.data.fg.value[this.data.fragment]) {
      this.cityInput = this.data.fg.value[this.data.fragment].n;
    }
  }

  cityInputChange(val: string) {
    if (this.changeTimer) {
      this.changeTimer.unsubscribe();
    }
    if (val.length >= 2) {
      this.changeTimer = timer(300).subscribe(t => {
        this.placeService.loadPlace(val, this.data.fragment);
      });
    }
  }

  closeDialog() {
    this.dialogRef.close('');
  }

  onSubmit(place: Place = null) {
    if (this.placeService.places[this.data.fragment]) {
      const value = {};
      const country = this.placeService.places[this.data.fragment].countrys;
      const places = this.placeService.places[this.data.fragment].places[country[0]];
      value[this.data.fragment] = place || places[0];
      this.data.fg.patchValue(value);
      this.dialogRef.close('');
    }
  }
}
