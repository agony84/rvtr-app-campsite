import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { delay, map } from 'rxjs/operators';

import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';

import { LodgingService } from '../../../services/lodging/lodging.service';
import { Lodging } from '../../../data/lodging.model';

import { BookingService } from '../../../services/booking/booking.service';
import { Booking } from '../../../data/booking.model';
import { Profile } from '../../../data/profile.model';
import { Stay } from 'src/app/data/stay.model';

@Component({
  selector: 'uic-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent implements OnInit {
  lodgings$: Observable<Lodging[]>;
  bookings$: Observable<Booking[]>;

  @ViewChild('bookingModal') bookingModal: ElementRef;
  bookingForm: FormGroup;

  lodgings: Lodging[];
  booking: Booking;

  /**
   * State used to determine if form was submitted
   */
  submitted: boolean;
  /**
   * State used to determine if awaiting for data from AJAX request
   */
  laoding: boolean;
  searchForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private lodgingService: LodgingService,
    private bookingService: BookingService
  ) { }

  ngOnInit(): void {
    // Set fields for form group
    this.searchForm = this.formBuilder.group({
      location: [''],
      checkIn: [this.formatDate(this.getNewDateFromNowBy(1)), Validators.required],
      checkOut: [this.formatDate(this.getNewDateFromNowBy(2)), Validators.required],
      guests: [1, Validators.required],
    });

    this.newBookingForm();

    this.lodgings$ = this.lodgingService.get();
  }

  createGuestItem(): FormGroup {
    return this.formBuilder.group({
      given: ['', Validators.required],
      family: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['']
    });
  }

  addNextGuestItem(): void {
    // tslint:disable-next-line: no-string-literal
    (this.bookingForm.controls['guests'] as FormArray).push(this.createGuestItem());
  }

  removeGuessItem(ind: number): void {
    // tslint:disable-next-line: no-string-literal
    const bookingFormArr: FormArray = this.bookingForm.controls['guests'] as FormArray;

    // Ensure there's alawys one
    if (bookingFormArr.length <= 0) { return; }

    bookingFormArr.removeAt(ind);
  }

  /**
   * Filter's results recieved from test observable using a given phrase
   * @param phrase String used to filter results
   */
  retreiveLodgingsByPhrase(phrase: string): void {
    // Return all results if string is empty
    if (!phrase.length) {
      this.lodgings$ = this.lodgingService.get();
      return;
    }

    this.lodgings$ = this.lodgingService.get().pipe(
      // return the list of lodgings filtered by the phrase
      map((lodgings) =>
        lodgings.filter((l) =>
          `${l.location.address.street}, ${l.location.address.city}, ${l.location.address.stateProvince}`.includes(
            phrase
          )
        )
      )
    );
  }

  /**
   * convencience getter for easy access to form fields
   */
  get f() {
    return this.searchForm.controls;
  }
  get b_f() {
    return this.bookingForm.controls;
  }

  /**
   * Submits seach data to httpRequest
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.searchForm.invalid) {
      // TODO: display invalidation message to user
      console.error('Invalid form submission');
      return;
    }

    this.retreiveLodgingsByPhrase(this.f.location.value);

    // TODO: submit form data to http request
    console.log('Submitted...');
  }

  private newBookingForm(): void {
    this.bookingForm = this.formBuilder.group({
      guests: this.formBuilder.array([]),
      checkIn: [this.formatDate(this.getNewDateFromNowBy(1)), Validators.required],
      checkOut: [this.formatDate(this.getNewDateFromNowBy(2)), Validators.required]
    });

    const guests = this.f?.guests?.value ? this.f.guests.value : 0;

    for (let i = 0; i < guests; i++) {
      this.addNextGuestItem();
    }
  }

  onBookingFormSubmit(): void {
    // TODO: set booking submitted state
    if (this.bookingForm.invalid) {
      // TODO: display invalidation message to user
      console.error('Invalid booking form');
      return;
    }

    (this.b_f.guests.value as []).forEach((data: any) => {
      const guest = {
        name: {
          given: data.given,
          family: data.family
        },
        email: data.email,
        phone: data.phone
      } as Profile;
      this.booking.guests.push(guest);
    });

    this.booking.stay.checkIn = this.b_f.checkIn.value as Date;
    this.booking.stay.checkOut = this.b_f.checkOut.value as Date;

    // TODO: send data as request
    console.log(this.booking);
  }

  /**
   * Formats the provided date to be used in the date input
   * @param date The `Date` to format
   * @see https://stackoverflow.com/questions/57198151/how-to-set-the-date-in-angular-reactive-forms-using-patchvalue
   */
  private formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  /**
   * Gets the date set to the amount of months specified to jump ahead
   * @param numMonths number of months to jump ahead
   * @param numDays number of days to jump ahead
   * @returns New date set from numMonths months from now and numDays days
   * @see https://stackoverflow.com/questions/499838/javascript-date-next-month
   */
  private getNewDateFromNowBy(numMonths: number, numDays: number = 7): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + numMonths, now.getDate() + numDays);
  }

  // For later.
  public lodgingsRow(lodgings: Lodging[], n: number): Array<Lodging[]> {
    return lodgings.reduce((accumulator, currentLodge, index, array) => {
      if (index % n === 0) {
        const lodgingsSubarry = [];
        for (let i = index; i < index + n; i++)
          lodgingsSubarry.push(array[i]);
        accumulator.push(lodgingsSubarry);
      }
      return accumulator;
    }, []);
  }

  public closeModal(event: MouseEvent): void {
    event?.stopPropagation();
    this.bookingModal.nativeElement.classList.remove('is-active');
  }

  public openModal(event: MouseEvent, lodging?: Lodging): void {
    event?.stopPropagation();

    this.bookingModal.nativeElement.classList.add('is-active');

    this.newBookingForm();

    if (lodging !== null) {
      this.booking = {
        guests: [],
        stay: {} as Stay
      } as Booking;
      this.booking.lodgingId = lodging.id;
    }
  }
}
