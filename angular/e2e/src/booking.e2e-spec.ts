import { AppPage } from './app.po';
import { BookingPage } from './booking.po';
import { browser, logging, element, by, Ptor, protractor } from 'protractor';
import { SSL_OP_NO_TICKET } from 'constants';

describe('project rvtr-app-campsite', () => {
  let page: AppPage;
  let booking: BookingPage;

  beforeEach(() => {
    page = new AppPage();
    booking = new BookingPage();
  });

  /**
   * Booking e2e
   */
  it('Booking page should have header Booking', () => {
    booking.navigateToBooking();
    const headerText = element(by.css('h1')).getText();
    expect(headerText).toBeTruthy();
    expect(headerText).toContain('Booking');
  });

  it('should have form with location label', (async () => {
    booking.navigateToBooking();
    const allLabels = element.all(by.css('label')).getText();
    expect(allLabels).toMatch('Location');
    expect(allLabels).toMatch('Check-In / Check-Out');
    expect(allLabels).toMatch('Guests');
  }));

  it('should have button with name search', () => {
    booking.navigateToBooking();
    const buttonName = element(by.css('button')).getText();
    expect(buttonName).toBe('search');
  });

  it('should have image', () => {
    booking.navigateToBooking();
    const image = element(by.css('img'));
    expect(image).toBeTruthy();
    const source = image.getAttribute('src');
    expect(source).toBe('https://bulma.io/images/placeholders/1280x960.png');
  });

  it('should have spotlight', () => {
    booking.navigateToBooking();
    const spotlight = element(by.className('title has-text-light is-4')).getText();
    expect(spotlight).toBe('My Lodging');

  });

  it('should contain spotlight text', () => {
    // TODO: when search has been implemented text should change based on
    // location searched.
    booking.navigateToBooking();
    const spotlightText = element.all(by.css('p')).getText();
    expect(spotlightText).toBeTruthy();
    expect(spotlightText).toMatch('Lorem ipsum');
  });

  it('should display one lodging when RI is searched', () => {
    // TODO: when bindings are complete adjust test to search for bound objects
    booking.navigateToBooking();
    const locationInput = element(by.name('location'));
    const searchBtn = element(by.buttonText('search'));
    locationInput.sendKeys('RI');
    searchBtn.click();
    const availLoc = element.all(by.className('tile is-child')).getText();
    expect(availLoc).toMatch('123 Main St, Providince, RI');
    expect(availLoc).not.toMatch('New York, NY');
  });

  /**
   * Booking-modal tests
   */
  it('should display modal when lodging is clicked', () => {
    booking.navigateToBooking();
    const locationElement = element(by.cssContainingText('.title', 'Great Lodge'));
    expect(locationElement.getText()).toContain('Great Lodge');
    locationElement.click();
    const modal = element(by.className('modal-card-title'));
    expect(modal.getText()).toMatch('Great Lodge');
    expect(modal.isDisplayed()).toBeTruthy();

  });

  it('should close the modal when "x" button or "cancel" button are clicked', () => {
    booking.navigateToBooking();
    const locationElement = element(by.cssContainingText('.title', 'Great Lodge'));
    expect(locationElement.getText()).toContain('Great Lodge');
    locationElement.click();
    const modal = element(by.className('modal-card-title'));
    expect(modal.isDisplayed()).toBe(true);
    const xBtn = element(by.className('delete'));
    xBtn.click();
    expect(modal.isDisplayed()).toBe(false);
    locationElement.click();
    expect(modal.isDisplayed()).toBe(true);
    const cancelBtn = element(by.buttonText('Cancel'));
    cancelBtn.click();
    expect(modal.isDisplayed()).toBe(false);
  });

  it('modal should contain one card by default', () => {
    booking.navigateToBooking();
    const locationElement = element(by.cssContainingText('.title', 'Great Lodge'));
    expect(locationElement.getText()).toContain('Great Lodge');
    locationElement.click();
    const modalCard = element.all(by.className('card ng-untouched ng-pristine ng-invalid'));
    expect(modalCard.count()).toBe(1);
  });

  it('modal should add one card when + button is clicked', () => {
    booking.navigateToBooking();
    const locationElement = element(by.cssContainingText('.title', 'Great Lodge'));
    expect(locationElement.getText()).toContain('Great Lodge');
    locationElement.click();
    let modalCard = element.all(by.className('card ng-untouched ng-pristine ng-invalid'));
    expect(modalCard.count()).toBe(1);
    const plusBtn = element(by.className('fas fa-plus'));
    plusBtn.click();
    modalCard = element.all(by.className('card ng-untouched ng-pristine ng-invalid'));
    expect(modalCard.count()).toBe(2);
  });

  it('modal should remove card when Remove button is clicked', () => {
    booking.navigateToBooking();
    const locationElement = element(by.cssContainingText('.title', 'Great Lodge'));
    expect(locationElement.getText()).toContain('Great Lodge');
    locationElement.click();
    let modalCard = element.all(by.className('card ng-untouched ng-pristine ng-invalid'));
    expect(modalCard.count()).toBe(1);
    const removeBtn = element(by.buttonText('Remove'));
    removeBtn.click();
    modalCard = element.all(by.className('card ng-untouched ng-pristine ng-invalid'));
    expect(modalCard.count()).toBe(0);
  });

});
