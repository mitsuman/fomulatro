import { TileData } from '../types';
import './Tile.css';

interface TileProps {
  data: TileData;
}

export function Tile({ data }: TileProps) {
  return (
    <div className={`tile tile--${data.state}`}>
      {data.char}
    </div>
  );
}
