# Changelog

## 3.1.0 (IN PROGRESS)

### Features / Enhancements

- Increase tests coverage (#47)

## 3.0.0 (2023-06-28)

### Breaking changes

- Requires Grafana 9 and Grafana 10

### Features / Enhancements

- Refactor Types and Fields Editor (#37)
- Update tests with testing-library/react (#40)
- Update to Grafana 10.0.0 (#41, #46)
- Migrate to Plugin Tools 1.5.2 (#42)
- Update to Node 18 and npm (#42)
- Add E2E Cypress testing (#43)
- Add JavaScript Values Editor (#44)
- Remove Grafana 8.5 support (#46)

## 2.2.0 (2023-03-27)

### Features / Enhancements

- Update CI and Release workflows (#33)
- Update to Grafana 9.4.7 (#34)
- Update README with Documentation (#35)
- Add Scoped Variables for Variables replacement (#35)

## 2.1.0 (2022-12-29)

### Breaking changes

Refactoring may introduce breaking changes. Please test before upgrading in Production.

### Features / Enhancements

- Update CI to upload signed artifacts (#23)
- Add "Static data source for Grafana | Mimic any data source | Tutorial and examples" video in README (#23)
- Update to Grafana 9.3.2 (#24)
- Refactoring and improving Test Coverage for data source (#25)
- Update Field and Values Editors to labels and fields structure (#27)
- Remove Frame Reducer to simplify code (#28)
- Refactoring frame, field utilities (#29)
- Add Date Time Picker, Number and Text Area Inputs (#30)

## 2.0.0 (2022-11-01)

### Features / Enhancements

- Maintained by Volkov Labs (#19)
- Updated based on Volkov Labs Panel Template (#19)
- Update CI to Node 16 and Synchronize with Release workflow (#20)
- Update to Grafana 9.2.2 (#21)
- Refactor Components and update Theme (#22)

## 1.4.4 (2022-08-28)

### Features / Enhancements

- Update to Grafana 9.

## 1.4.3 (2021-09-03)

### Features / Enhancements

- Update dependencies

### Bug fixes

- Fix an issue where an fields and rows are added twice in development

## 1.4.2 (2021-07-08)

### Features / Enhancements

- Update metadata, docs, and dependencies

### Bug fixes

- Frame changes aren't being synced correctly

## 1.4.1 (2021-06-12)

### Features / Enhancements

- Minor docs and metadata updates
- Changed from useState to useReducer for manipulating form model
- Replace custom input component with Input from @grafana/ui

## 1.4.0 (2021-06-10)

### Features / Enhancements

- Add support for annotations
- Add button for duplicating value rows
- Add option to set preferred visualisation type for Explore

## 1.3.1 (2021-01-29)

### Bug fixes

- Set reference id on data frames

## 1.3.0 (2021-01-29)

### Features / Enhancements

- Update to new form styles. Bumps the minimum required Grafana version to 7.3.

## 1.2.1 (2020-11-27)

### Features / Enhancements

- Updated `@grafana` dependencies from `^7.0.0` to `^7.3.0`
- Improved release process using the new [GitHub workflows](https://github.com/grafana/plugin-workflows) for Grafana plugins
