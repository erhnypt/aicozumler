export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 60);
}

export const sectorList = [
  { key: 'dentist', label: 'Diş Hekimi', sub: 'dent' },
  { key: 'beauty', label: 'Güzellik', sub: 'beauty' },
  { key: 'restaurant', label: 'Restoran', sub: 'rest' },
  { key: 'fitness', label: 'Fitness', sub: 'fit' },
  { key: 'retail', label: 'Perakende', sub: 'retail' }
] as const;

export type SectorKey = typeof sectorList[number]['key'];

export function sectorSubdomain(sector: string): string {
  const found = sectorList.find(s => s.key === sector);
  return found ? found.sub : 'app';
}
