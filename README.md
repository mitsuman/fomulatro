# Fomulatro

A Wordle-like puzzle game where you guess a hidden **math formula** in 6 tries.

## How to Play

- Each guess must be a valid math equation (e.g. `10+20=30`)
- All formulas are exactly **8 characters** long
- After each guess, tiles change color:
  - 🟩 **Green** — correct character in the correct position
  - 🟨 **Yellow** — correct character, wrong position
  - ⬛ **Gray** — character not in the formula
- A new formula is available each day

## Allowed Characters

Digits `0-9`, operators `+ - * /`, and `=`

## Tech Stack

- [Vite](https://vitejs.dev/) + [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)

## Development

```bash
npm install
npm run dev       # start dev server at http://localhost:5173
npm run build     # production build
npm run preview   # preview production build
```
