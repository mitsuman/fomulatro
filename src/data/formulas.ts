const OPS = ['+', '-', '*', '/'] as const;
type Op = (typeof OPS)[number];

/** Mulberry32 seeded PRNG — returns a function that produces [0, 1) floats. */
function makeSeededRand(seed: number): () => number {
  let s = seed;
  return () => {
    s |= 0; s = s + 0x6d2b79f5 | 0;
    let t = Math.imul(s ^ s >>> 15, 1 | s);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 0x100000000;
  };
}

/** Derive a numeric seed from a YYYY-MM-DD string. */
function dateSeed(dateStr: string): number {
  return dateStr.split('').reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) | 0, 0);
}

function todayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function randInt(rand: () => number, min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function randOp(rand: () => number): Op {
  return OPS[Math.floor(rand() * OPS.length)];
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
 * Generate a deterministic daily formula using today's date as seed.
 * All users on the same day get the same formula.
 * Patterns:
 *   Single-op:  A op B = C
 *   Double-op:  A op1 B op2 C = D   (standard JS precedence)
 */
export function pickDailyFormula(): string {
  const rand = makeSeededRand(dateSeed(todayString()));

  for (let attempts = 0; attempts < 5000; attempts++) {
    const twoOps = rand() < 0.4;

    if (!twoOps) {
      const op = randOp(rand);
      const dA = randInt(rand, 1, 3);
      const dB = randInt(rand, 1, 3);
      const a = randInt(rand, 10 ** (dA - 1), 10 ** dA - 1);
      const b = op === '/' ? randInt(rand, 2, 10 ** dB - 1) : randInt(rand, 10 ** (dB - 1), 10 ** dB - 1);
      const expr = `${a}${op}${b}`;
      const c = evalExpr(expr);
      if (c === null) continue;
      const formula = `${expr}=${c}`;
      if (formula.length === 8) return formula;
    } else {
      const op1 = randOp(rand);
      const op2 = randOp(rand);
      const splits: [number, number, number][] = [
        [1, 1, 1],
        [2, 1, 1],
        [1, 2, 1],
        [1, 1, 2],
      ];
      const [dA, dB, dC] = splits[Math.floor(rand() * splits.length)];
      const a = randInt(rand, 10 ** (dA - 1), 10 ** dA - 1);
      const b = op1 === '/' ? randInt(rand, 2, 10 ** dB - 1) : randInt(rand, 10 ** (dB - 1), 10 ** dB - 1);
      const c = op2 === '/' ? randInt(rand, 2, 10 ** dC - 1) : randInt(rand, 10 ** (dC - 1), 10 ** dC - 1);
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

/** Today's date string for display */
export function getTodayString(): string {
  return todayString();
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
