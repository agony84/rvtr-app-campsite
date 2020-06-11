import { AppPage } from './app.po';
import { BookingPage } from './booking.po';
import { browser, logging, element, by, Ptor, protractor } from 'protractor';

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
  it('Booking page should have header Booking',()=>{
    booking.navigateToBooking();
    const headerText = element(by.css('h1')).getText();
    expect(headerText).toBeTruthy();
    expect(headerText).toContain('Booking');
  });

  it('should have form with location label', ()=>{
    booking.navigateToBooking();
    const allLabels = element.all(by.css('label')).getText();
    expect(allLabels).toMatch('Location');
    expect(allLabels).toMatch('Check-In / Check-Out');
    expect(allLabels).toMatch('Guests')
  });

  it('should have button with name search', ()=>{
    booking.navigateToBooking();
    const buttonName = element(by.css('button')).getText();
    expect(buttonName).toBe('search')
  });

  it('should have image', ()=>{
    booking.navigateToBooking();
    const image = element(by.css('img'));
    expect(image).toBeTruthy();
    const source = image.getAttribute('src');
    expect(source).toBe('https://bulma.io/images/placeholders/1280x960.png');
  });

  it('should have spotlight', ()=>{
    booking.navigateToBooking();
    const spotlight = element(by.className('title has-text-light is-4')).getText();
    expect(spotlight).toBe('My Lodging');

  });

  it('should contain spotlight text', ()=>{
    // TODO: when search has been implemented text should change based on 
    // location searched. 
    booking.navigateToBooking();
    const spotlightText = element(by.cssContainingText('p',' Lorem ipsum dolor,')).getText();
    expect(spotlightText).toBeTruthy();
    expect(spotlightText).toContain('p',' Lorem ipsum dolor,');
  });

  it('should display one lodging when RI is searched', ()=>{
    // TODO: when bindings are complete adjust test to search for bound objects
    const locationInput = element(by.name('location'));
    const searchBtn = element(by.buttonText('search'));
    locationInput.sendKeys('RI');
    searchBtn.click();
    const availLoc = element.all(by.className('tile is-child')).getText();
    expect(availLoc).toMatch('123 Main St, Providince, RI');
    expect(availLoc).not.toMatch('New York, NY');
  });

  it('should display modal when lodging is clicked',()=>{
    const locationElement = element.all(by.cssContainingText('tile is-child','My Lodging'));
    locationElement.click();
    const modal = element(by.className('modal is-active'));
    expect(modal).toBeTruthy();
    // locationElement.click();
    // //const modal = element(by.className('modal is-active'));
    // expect(element(by.className('modal is-active'))).toBeTruthy();
    // // const closeBtn = modal.element(by.className('delete'));
    // // closeBtn.click();
    // // expect(element(by.className('modal'))).toBeTruthy();

  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(
      jasmine.objectContaining({
        level: logging.Level.SEVERE,
      } as logging.Entry)
    );
  });
});