const OPS = ['+', '-', '*', '/'] as const;
type Op = (typeof OPS)[number];

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randOp(): Op {
  return OPS[Math.floor(Math.random() * OPS.length)];
}

/** Evaluate a numeric expression string; returns null if result is not a positive integer. */
function evalExpr(expr: string): number | null {
  try {
    const result = Function('"use strict"; return (' + expr + ')')() as number;
    if (!Number.isInteger(result) || result <= 0) return null;
    return result;
  } catch {
    return null;
  }
}

/**
 * Generate a random, valid 8-character math formula.
 * Patterns:
 *   Single-op:  A op B = C
 *   Double-op:  A op1 B op2 C = D   (standard JS precedence)
 */
export function pickRandomFormula(): string {
  for (let attempts = 0; attempts < 5000; attempts++) {
    const twoOps = Math.random() < 0.4;

    if (!twoOps) {
      // ----- Single-op: d(A) + 1 + d(B) + 1 + d(C) = 8  =>  d(A)+d(B)+d(C) = 6 -----
      // Pick digit counts that sum to 6, then let C be determined.
      const op = randOp();
      // Randomly pick digit lengths for A and B (1–4), compute C, filter to d(A)+d(B)+d(C)==6
      const dA = randInt(1, 3);
      const dB = randInt(1, 3);
      const a = randInt(10 ** (dA - 1), 10 ** dA - 1);
      const b = op === '/' ? randInt(2, 10 ** dB - 1) : randInt(10 ** (dB - 1), 10 ** dB - 1);
      const expr = `${a}${op}${b}`;
      const c = evalExpr(expr);
      if (c === null) continue;
      const formula = `${expr}=${c}`;
      if (formula.length === 8) return formula;
    } else {
      // ----- Double-op: d(A)+d(B)+d(C)+d(D) = 5 -----
      // Most common split: all 1-digit operands (1+1+1+2) or one 2-digit operand.
      const op1 = randOp();
      const op2 = randOp();
      // Choose digit distribution randomly from valid splits
      const splits: [number, number, number][] = [
        [1, 1, 1], // D will be 2 digits
        [2, 1, 1], // D will be 1 digit
        [1, 2, 1], // D will be 1 digit
        [1, 1, 2], // D will be 1 digit
      ];
      const [dA, dB, dC] = splits[Math.floor(Math.random() * splits.length)];
      const a = randInt(10 ** (dA - 1), 10 ** dA - 1);
      const b = op1 === '/' ? randInt(2, 10 ** dB - 1) : randInt(10 ** (dB - 1), 10 ** dB - 1);
      const c = op2 === '/' ? randInt(2, 10 ** dC - 1) : randInt(10 ** (dC - 1), 10 ** dC - 1);
      const expr = `${a}${op1}${b}${op2}${c}`;
      const d = evalExpr(expr);
      if (d === null) continue;
      const formula = `${expr}=${d}`;
      if (formula.length === 8) return formula;
    }
  }

  // Guaranteed fallback
  return '10+20=30';
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
