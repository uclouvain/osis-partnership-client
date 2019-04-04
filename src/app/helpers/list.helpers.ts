import { ValueLabel } from "../interfaces/common";
import { Continent, Country } from "../interfaces/configuration";

export /**
 * Returns items list with id and label for each item
 *
 * @param {any[]} items
 */
const getFormattedItemsList = (items: any[]) => items.map(
  (item: string | ValueLabel) => (typeof item === 'string' ? {
    id: item,
    label: item
  } : item))

export /**
 * Returns label of given value from a list of items
 *
 * @param {any[]} items
 * @param {string} value
 * @returns
 */
const getLabel = (items: any[], value: string) => {
  const item = items.find((item: string | ValueLabel) => (
    typeof item === 'string' && item === value ? true
    : typeof item === 'object' && item.id === value ? true
      : false
  ))
  return item
    ? typeof item === 'string' ? item : item.label
    : value
}

interface Level {
  name: string
  value: string
}

export /**
 * Return a valid ValueLabel list. It could have 2 level depending on params
 *
 * @param {any[]} items
 */
const getValueLabelList = (items: any[], level1?: Level, level2?: Level) => {
  // A level is defined, returns list of this level
  if (level1) {
    const level1Index = items.findIndex(item => item.name === level1.value)
    if (level2) {
      const level2Index = items[level1Index][level1.name].findIndex((item: any) => item.name === level2.value)
      // A second level is define, returns list of this second level
      return items[level1Index][level1.name] && items[level1Index][level1.name][level2Index][level2.name]
      ? items[level1Index][level1.name][level2Index][level2.name].map(
          (item: any) => ({
            label: item.name,
            id: item.name
          })
        )
      : []
    }

    return items[level1Index][level1.name]
    ? items[level1Index][level1.name].map(
        (item: any) => ({
          label: item.name,
          id: item.name
        })
      )
    : []
  }

  // No level is defined, returns base list
  return items.map(
    (item: any) => ({
      label: item.name,
      id: item.name
    })
  )
}