import {Offer} from '../api/types';

export type FeedRow =
  | {type: 'offers'; key: string; offers: Offer[]}
  | {type: 'mascot'; key: string; message: string};

// The mascot pops up between every few rows of the two-column feed.
const MASCOT_EVERY_ROWS = 3;

export const buildFeedRows = (offers: Offer[], slogans: string[]) => {
  const rows: FeedRow[] = [];
  for (let i = 0; i < offers.length; i += 2) {
    const rowIndex = i / 2;
    if (rowIndex > 0 && rowIndex % MASCOT_EVERY_ROWS === 0 && slogans.length) {
      const sloganIndex = (rowIndex / MASCOT_EVERY_ROWS - 1) % slogans.length;
      rows.push({
        type: 'mascot',
        key: `mascot-${rowIndex}`,
        message: slogans[sloganIndex],
      });
    }
    rows.push({
      type: 'offers',
      key: `offers-${offers[i].id}`,
      offers: offers.slice(i, i + 2),
    });
  }
  return rows;
};

export const matchesQuery = (offer: Offer, query: string) => {
  const q = query.trim().toLowerCase();
  if (!q) {
    return true;
  }
  return [offer.offerDescription, offer.storeName, offer.storeType]
    .filter(Boolean)
    .some(field => (field as string).toLowerCase().includes(q));
};
