import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display page title', () => {
    page.navigateTo();
    expect(page.getTitleText()).toEqual('OSIS Partnerships');
  });

  it('should display Student selected checkbox', () => {
    expect(page.student.isSelected()).toBe(true);
  });

  it('should display Staff not selected checkbox', () => {
    expect(page.staff.isSelected()).toBe(false);
  });

  it('should display Erasmus checkbox', () => {
    expect(page.erasmus.isSelected()).toBe(false);
  });

  it('should display 25 total', () => {
    expect(page.getTotalCount()).toEqual('25 total');
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
