/**
 * @jest-environment node
 */

import { processBudgetItem } from '../../../src/lib/processBudgetItem';

describe('processBudgetItem helper function', () => {
  test('Returns null when inputBudgetItem is not provided', async () => {
    const result = await processBudgetItem();
    expect(result).toBeNull();
  });

  test('Returns original budget object if currency is EUR (nothing to enrich)', async () => {
    const budgetItem = {
      value: 63115,
      currency: 'EUR',
      raw: '63,115.00',
    };
    const result = await processBudgetItem(
      budgetItem,
      '2015-02-02T00:00:00.000Z'
    );
    expect(result).toMatchObject(budgetItem);
  });

  test('Returns original budget object if date is not provided', async () => {
    const budgetItem = {
      value: 63115,
      currency: 'BGN',
      raw: '63,115.00',
    };
    const result = await processBudgetItem(budgetItem);
    expect(result).toMatchObject(budgetItem);
  });

  test('Enriches non-EUR currency budget items when date is provided, but no precision, defaults to year precision', async () => {
    const budgetItem = {
      value: 63115,
      currency: 'BGN',
      raw: '63,115.00',
    };
    const result = await processBudgetItem(
      budgetItem,
      '2015-02-02T00:00:00.000Z'
    );
    // Assert convertion to EUR
    expect(result.currency).toBe('EUR');
    // Assert change in original value
    expect(result.value).not.toBe(budgetItem.value);
    // Assert structure in overall
    expect(result).toMatchSnapshot();
  });

  test('Enrichment scenario, daily precision, exchange rate available', async () => {
    const budgetItem = {
      value: 63115,
      currency: 'BGN',
      raw: '63,115.00',
    };
    const result = await processBudgetItem(
      budgetItem,
      '2015-02-02T00:00:00.000Z',
      'day'
    );
    expect(result).toMatchSnapshot();
  });

  test('Enrichment scenario, daily precision, exchange rate not available, fallback to monthly', async () => {
    const budgetItem = {
      value: 63115,
      currency: 'USD',
      raw: '63,115.00',
    };
    const result = await processBudgetItem(
      budgetItem,
      '2014-12-25T00:00:00.000Z',
      'day'
    );
    expect(result).toMatchSnapshot();
  });

  test('Enrichment scenario, monthly precision', async () => {
    const budgetItem = {
      value: 63115,
      currency: 'BGN',
      raw: '63,115.00',
    };
    const result = await processBudgetItem(
      budgetItem,
      '2014-11-02T00:00:00.000Z',
      'month'
    );
    expect(result).toMatchSnapshot();
  });
});
