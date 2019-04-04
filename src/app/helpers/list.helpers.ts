import { ValueLabel } from '../interfaces/common';
import { Continent, Country } from '../interfaces/configuration';

/**
 * Returns items list with id and label for each item
 * from a list of string or ValueLabel
 */
export const getFormattedItemsList = (items: any[]) => items.map(
  (item: string | ValueLabel) => (typeof item === 'string' ? {
    id: item,
    label: item
  } : item));

/**
 * Returns items list with id and label for each item
 * from a list of string or Country
 */
export const getFormattedCountryList = (items: any[]) => items.map(
  (item: string | Country) => (typeof item === 'string' ? {
    id: item,
    label: item
  } : {
    label: item.name,
    id: item.name
  }));

/**
 * Returns label of given value from a list of items
 */
export const getLabel = (items: any[], value: string) => {
  const currentItem = items.find((item: string | ValueLabel) => (
    typeof item === 'string' && item === value ? true
    : typeof item === 'object' && item.id === value ? true
      : false
  ));
  return currentItem
    ? typeof currentItem === 'string' ? currentItem : currentItem.label
    : value;
};

interface Level {
  name: string;
  value: string;
}

/**
 * Return a valid ValueLabel list. It could have 2 level depending on params
 */
export const getValueLabelList = (items: any[], level1?: Level, level2?: Level) => {
  // A level is defined, returns list of this level
  if (level1) {
    const level1Index = items.findIndex(item => item.name === level1.value);
    if (level2) {
      const level2Index = items[level1Index][level1.name].findIndex((item: any) => item.name === level2.value);
      // A second level is define, returns list of this second level
      return items[level1Index][level1.name] && items[level1Index][level1.name][level2Index][level2.name]
      ? getFormattedCountryList(items[level1Index][level1.name][level2Index][level2.name])
      : [];
    }

    return items[level1Index][level1.name]
    ? getFormattedCountryList(items[level1Index][level1.name])
    : [];
  }

  // No level is defined, returns base list
  return getFormattedCountryList(items);
};
