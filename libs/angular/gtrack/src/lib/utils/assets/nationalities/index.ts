import _nationalities from './countries.json';

export const nationalities = _nationalities.map(val => ({ label: val.nationality, value: val.alpha_2_code }));
