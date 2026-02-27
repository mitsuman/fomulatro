import { TileData, FORMULA_LENGTH } from '../types';
import { Tile } from './Tile';
import './Row.css';

interface RowProps {
  tiles: TileData[];
  isCurrentRow?: boolean;
}

export function Row({ tiles, isCurrentRow = false }: RowProps) {
  const paddedTiles: TileData[] = Array.from({ length: FORMULA_LENGTH }, (_, i) =>
    tiles[i] ?? { char: '', state: 'empty' }
  );

  return (
    <div className={`row${isCurrentRow ? ' row--current' : ''}`}>
      {paddedTiles.map((tile, i) => (
        <Tile key={i} data={tile} />
      ))}
    </div>
  );
}
