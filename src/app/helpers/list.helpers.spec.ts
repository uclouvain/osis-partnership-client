import {
  getLabel,
  getFormattedItemsList,
  getValueLabelList
} from './list.helpers';

describe('getFormattedItemsList', () => {
  it('should returns list unchanged if already well formatted', () => {
    const input = [
      { id: 'id_b', label: 'B' },
      { id: 'id_c', label: 'C' },
    ];
    const output = [
      { id: 'id_b', label: 'B' },
      { id: 'id_c', label: 'C' },
    ];
    expect(getFormattedItemsList(output)).toEqual(output);
  });

  it('should returns a list with only objects', () => {
    const input = [
      'A',
      { id: 'id_b', label: 'B' },
      { id: 'id_c', label: 'C' },
    ];
    const output = [
      { id: 'A', label: 'A' },
      { id: 'id_b', label: 'B' },
      { id: 'id_c', label: 'C' },
    ];
    expect(getFormattedItemsList(output)).toEqual(output);
  });
});

describe('getLabel', () => {
  it('should returns label of given id', () => {
    const items = [
      { id: 'id_a', label: 'A' },
      { id: 'id_b', label: 'B' },
      { id: 'id_c', label: 'C' },
    ];
    expect(getLabel(items, 'id_a')).toEqual('A');
  });
});

describe('getValueLabelList', () => {
  it('should returns a list of ValueLabel in a simple object', () => {
    const input = [
      { name: 'A', countries: [] },
      { name: 'B', countries: [] },
    ];
    const output = [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' }
    ];
    expect(getValueLabelList(input)).toEqual(output);
  });

  it('should returns a list of ValueLabel of level 1', () => {
    const input = [
      { name: 'A', countries: [
        { name: 'A1' },
        { name: 'A2' }
      ] },
      { name: 'B', countries: [
        { name: 'B1' },
        { name: 'B2' }
      ] },
    ];
    const output = [
      { id: 'B1', label: 'B1' },
      { id: 'B2', label: 'B2' }
    ];
    const level1 = {
      name: 'countries',
      value: 'B'
    };
    expect(getValueLabelList(input, level1)).toEqual(output);
  });

  it('should returns a list of ValueLabel of level 2', () => {
    const input = [
      { name: 'A', countries: [
        { name: 'A1' },
        { name: 'A2' }
      ] },
      { name: 'B', countries: [
        {
          name: 'B1',
          cities: [
            { name: 'C1' },
            { name: 'C2' }
          ]
        },
        {
          name: 'B2',
          cities: [
            { name: 'D1' },
            { name: 'D2' }
          ]
        },
      ] },
    ];
    const output = [
      { id: 'C1', label: 'C1' },
      { id: 'C2', label: 'C2' }
    ];

    const level1 = {
      name: 'countries',
      value: 'B'
    };
    const level2 = {
      name: 'cities',
      value: 'B1'
    };
    expect(getValueLabelList(input, level1, level2)).toEqual(output);
  });
});
