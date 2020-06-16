import { TestBed } from '@angular/core/testing';

import { ValidationService } from './validation.service';
import { AbstractControl } from '@angular/forms';
import { invalid } from '@angular/compiler/src/render3/view/util';

describe('ValidationService', () => {
  let service: ValidationService;
  let controlFake: Partial<AbstractControl>;
  beforeEach(() => {
    controlFake = {value: 'value'};
    TestBed.configureTestingModule({
      providers: [ValidationService,
        {provide: AbstractControl, useValue: controlFake as AbstractControl}],
    });
    service = TestBed.inject(ValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get validator error message Required', () => {
    const message: any = ValidationService.getValidatorErrorMessage('required');
    expect(message).toBe('Required.');
  });

  it('should get validator error message invalidRentals', () => {
    const message: any = ValidationService.getValidatorErrorMessage('invalidRentals');
    expect(message).toBe('One rental required.');
  });

  it('should get validator error message invalidGuests', () => {
    const message: any = ValidationService.getValidatorErrorMessage('invalidGuests');
    expect(message).toBe('One guest required.');
  });

  it('should get validator error message email', () => {
    const message: any = ValidationService.getValidatorErrorMessage('email');
    expect(message).toBe('Invalid email format.');
  });

  it('should return null for rentalsValidator', () => {
    const result: any = ValidationService.rentalsValidator(controlFake as AbstractControl);
    expect(result).toBeNull();
  });
  it('should return null for guestsValidator', () => {
    const result: any = ValidationService.guestsValidator(controlFake as AbstractControl);
    expect(result).toBeNull();
  });

});
