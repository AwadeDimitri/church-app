export interface CategoryColor {
  bg: string;
  text: string;
}

const PALETTE: Record<string, CategoryColor> = {
  red:    { bg: 'bg-church-red-light',  text: 'text-church-red' },
  blue:   { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  green:  { bg: 'bg-church-green/10',   text: 'text-church-green' },
  gold:   { bg: 'bg-church-gold-light', text: 'text-church-gold' },
  purple: { bg: 'bg-church-blue-light', text: 'text-church-blue' },
  gray:   { bg: 'bg-church-text/5',     text: 'text-church-text-secondary' },
};

const FALLBACK: CategoryColor = PALETTE['gray']!;

export function categoryColor(key: string | null | undefined): CategoryColor {
  if (!key) return FALLBACK;
  return PALETTE[key] ?? FALLBACK;
}
