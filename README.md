# OsisPartnershipClient

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.7.

## Environments

Copy `environments/environment.example.ts` to `environments/environment.ts` and set up your local api url and token.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Cypress](https://docs.cypress.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Configuration by data-attributes

| Attribute             | Type              | Controls                                                                                     |
|-----------------------|-------------------|----------------------------------------------------------------------------------------------|
| data-main-color       | hexadecimal color | Set the main color for the markers, needs the '#' prefix                                     |
| data-height           | number            | The height (in px) of the map, do not add the 'px' suffix                                    |
| data-ucl-entity       | uuid              | Forces the ucl entity to be shown (with children entities)                                   |
| data-partnership-type | enum              | One of GENERAL,MOBILITY,COURSE,DOCTORATE,PROJECT. Forces the type of partnership to be shown |
| data-enable-export    | boolean           | Show export button (set to 'true' to enable)                                                 |
| data-show-diploma-filter| boolean         | Show diploma filter (set to 'true' to show)                                                  |
