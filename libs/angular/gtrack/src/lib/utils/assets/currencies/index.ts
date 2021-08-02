export const currencies = [
  { label: 'HUF', value: 'HUF' },
  { label: 'EUR', value: 'EUR' },
  { label: 'USD', value: 'USD' },
  { label: 'CHF', value: 'CHF' },
];

export const cryptoCurrencies = [
  { label: 'Bitcoin', value: 'BTC' },
  { label: 'Ethereum', value: 'ETH' },
  { label: 'IOTA', value: 'IOTA' },
];

export const currencyFormats = [
  {
    currency: 'HUF',
    displayFormat: '0.0-2',
    inputFormat: { prefix: '', suffix: ' HUF', thousands: ',', decimal: '.', precision: 2, align: 'left' },
  },
  {
    currency: 'EUR',
    displayFormat: '0.0-2',
    inputFormat: { prefix: '€ ', thousands: ',', decimal: '.', precision: 2, align: 'left' },
  },
  {
    currency: 'USD',
    displayFormat: '0.0-2',
    inputFormat: { prefix: '$ ', thousands: ',', decimal: '.', precision: 2, align: 'left' },
  },
  {
    currency: 'CHF',
    displayFormat: '0.0-2',
    inputFormat: { prefix: '', suffix: ' CHF', thousands: ',', decimal: '.', precision: 2, align: 'left' },
  },
  {
    currency: 'BTC',
    displayFormat: '0.0-8',
    inputFormat: { prefix: 'BTC ', thousands: ',', decimal: '.', precision: 8, align: 'left' },
  },
  {
    currency: 'ETH',
    displayFormat: '0.0-5',
    inputFormat: { prefix: '', thousands: ',', suffix: ' ETH', decimal: '.', precision: 5, align: 'left' },
  },
];
