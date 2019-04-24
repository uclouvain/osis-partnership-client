import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getTitleText() {
    return element(by.css('app-root h1')).getText() as Promise<string>;
  }

  get student() {
    return element(by.css('input#Student'));
  }

  get staff() {
    return element(by.css('input#Staff'));
  }

  get erasmus() {
    return element(by.css('input#Erasmus'));
  }

  getTotalCount() {
    return element(by.css('.page-count')).getText() as Promise<string>;
  }
}
