// All formulas are exactly 8 characters long
export const FORMULAS: string[] = [
  // AA+BB=CC / AA-BB=CC
  '10+20=30',
  '11+11=22',
  '13+24=37',
  '18+46=64',
  '25+39=64',
  '27+54=81',
  '32+44=76',
  '43+28=71',
  '45+32=77',
  '50-23=27',
  '55+34=89',
  '60-35=25',
  '62-37=25',
  '74-36=38',
  '77-29=48',
  '85-46=39',
  '86-57=29',
  '96-48=48',
  '99-67=32',
  '12+55=67',
  // AAA/B=CC
  '108/4=27',
  '126/6=21',
  '144/8=18',
  '144/9=16',
  '168/7=24',
  '175/7=25',
  '192/6=32',
  '256/8=32',
  // A*BB=CCC
  '2*99=198',
  '3*66=198',
  '3*72=216',
  '4*48=192',
  '4*54=216',
  '5*45=225',
  '6*32=192',
  '6*39=234',
  '7*32=224',
  '8*28=224',
  '9*27=243',
  // AA*B=CCC
  '24*9=216',
  '25*4=100',
  '28*8=224',
  '35*6=210',
  '36*6=216',
  '42*6=252',
  '45*5=225',
  '54*5=270',
];

export function pickRandomFormula(): string {
  const index = Math.floor(Math.random() * FORMULAS.length);
  return FORMULAS[index];
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
