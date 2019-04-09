import { Component, OnInit, HostListener } from '@angular/core';
import { MatIconRegistry, DateAdapter, MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import { filter } from 'rxjs/operators';
import { PlaceDialogComponent } from './place-dialog/place-dialog.component';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { Location } from '@angular/common';
import { PlaceService } from './place.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  today = new Date();
  searchFG = new FormGroup({
    when: new FormControl(this.today, Validators.required),
    who: new FormControl(1, [Validators.required, Validators.min(1)]),
  });
  onProcess = false;
  isMobile = window.innerWidth <= 500;
  resizeTimer;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (this.resizeTimer) {
      this.resizeTimer.unsubscribe();
    }
    this.resizeTimer = timer(500).subscribe(t => {
      this.isMobile = event.target.innerWidth <= 720;
    });
  }

  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private dateAdapter: DateAdapter<Date>,
    private dialog: MatDialog,
    private router: Router,
    private location: Location,
    public placeService: PlaceService) {
    iconRegistry.addSvgIcon(
      'calendar',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/calendar.svg'));
    iconRegistry.addSvgIcon(
      'compass',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/compass.svg'));
    iconRegistry.addSvgIcon(
      'search',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/search.svg'));
    iconRegistry.addSvgIcon(
      'user',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/user.svg'));
    iconRegistry.addSvgIcon(
      'users',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/users.svg'));
    iconRegistry.addSvgIcon(
      'back',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/back.svg'));
    iconRegistry.addSvgIcon(
      'plus',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/plus.svg'));
    iconRegistry.addSvgIcon(
      'minus',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/minus.svg'));
    iconRegistry.addSvgIcon(
      'compare',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icon/compare.svg'));

    // set first day of week
    this.dateAdapter.setLocale('fr-FR');
    this.dateAdapter.getFirstDayOfWeek = () => 1;
    // subscribe to route change
    router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart)
    ).subscribe((res: NavigationStart) => {
      const fragment = res.url.substring(2);
      if (fragment && this.isMobile) {
        const dialogRef = this.dialog.open(PlaceDialogComponent, {
          height: '100%',
          width: '100vw',
          maxWidth: '100vw',
          panelClass: 'place-dialog',
          closeOnNavigation: true,
          data: {
            fragment: fragment,
            fg: this.searchFG
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result !== undefined) {
            this.location.back();
          }
        });
      }
    });
  }

  ngOnInit() { }

  removePassenger() {
    const passenger = this.searchFG.get('who').value;
    if (passenger > 1) {
      this.searchFG.patchValue({
        who: passenger - 1
      });
    }
  }
  addPassenger() {
    const passenger = this.searchFG.get('who').value;
    this.searchFG.patchValue({
      who: passenger + 1
    });
  }

  swapCity() {
    this.searchFG.patchValue({
      from: this.searchFG.controls['to'].value,
      to: this.searchFG.controls['from'].value
    });
    const temp = this.placeService.places['from'];
    this.placeService.places['from'] = this.placeService.places['to'];
    this.placeService.places['to'] = temp;
  }

  onSubmit() {
    console.log(this.searchFG.value);
    this.onProcess = true;
    timer(1200).subscribe().add(() => {
      this.onProcess = false;
    });
  }
}
