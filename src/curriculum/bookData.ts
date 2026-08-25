import { BOOK_UNITS } from './unitsInfo';
import { PAGES_PART_1 } from './pagesPart1';
import { PAGES_PART_2 } from './pagesPart2';
import { BookPage, UnitInfo, UnitId } from './types';

export const ALL_BOOK_PAGES: BookPage[] = [...PAGES_PART_1, ...PAGES_PART_2];

export { BOOK_UNITS };

export function getPageByNumber(pageNumber: number): BookPage | undefined {
  return ALL_BOOK_PAGES.find(p => p.pageNumber === pageNumber);
}

export function getPagesByUnit(unitId: UnitId): BookPage[] {
  if (unitId === 'intro') {
    return ALL_BOOK_PAGES.filter(p => p.unitId === 'intro');
  }
  return ALL_BOOK_PAGES.filter(p => p.unitId === unitId);
}

export function getUnitById(unitId: UnitId): UnitInfo | undefined {
  return BOOK_UNITS.find(u => u.id === unitId);
}
