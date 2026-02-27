// List of valid 8-character math formulas
// Format: operand operator operand = result
// All formulas have exactly 8 characters
export const FORMULAS: string[] = [
  '10+20=30',
  '11*3=33',
  '50-23=27',
  '9*8=72',
  '36/4=9',
  '45-9=36',
  '7*11=77',
  '8*9=72',
  '4+5=9',
  '64/8=8',
  '3*25=75',
  '6*12=72',
  '11+11=22',
  '99-67=32',
  '56/7=8',
  '48/6=8',
  '5*15=75',
  '32+44=76',
  '60-35=25',
  '7+13=20',
  '14*5=70',
  '18/3=6',
  '25+39=64',
  '81/9=9',
  '4*22=88',
  '6*13=78',
  '77-29=48',
  '12+55=67',
  '40/8=5',
  '3*28=84',
];

export function pickDailyFormula(): string {
  const today = new Date();
  const start = new Date(2026, 0, 1);
  const dayIndex =
    Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) %
    FORMULAS.length;
  return FORMULAS[Math.abs(dayIndex)];
}

export function isValidFormula(input: string): boolean {
  // Check if the formula is mathematically valid
  try {
    if (!input.includes('=')) return false;
    const parts = input.split('=');
    if (parts.length !== 2) return false;
    const [lhs, rhs] = parts;
    // eslint-disable-next-line no-eval
    const result = Function('"use strict"; return (' + lhs + ')')();
    return Number(result) === Number(rhs);
  } catch {
    return false;
  }
}
