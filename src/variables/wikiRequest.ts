const apiPath = 'https://nomanssky.fandom.com/api.php';
const civilized = 'Eisvana';
const query = {
  action: 'cargoquery',
  format: 'json',
  origin: '*',
  limit: '500',
  tables: 'Bases',
  fields: ['Name', 'CensusPlayer', 'CensusRenewal'],
  where: `CensusShow IS NOT NULL AND Civilized="${civilized}"`,
  order_by: 'CensusRenewal',
};

export const censusQuery = `${apiPath}?${Object.entries(query)
  .map((param) => param.join('='))
  .join('&')}`;
