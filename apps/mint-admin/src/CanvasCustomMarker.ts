import * as L from "leaflet";

export interface CanvasCustomMarkerOptions extends L.CircleMarkerOptions {
  imageSrc?: string;
  size?: number;
}

export class CanvasCustomMarker extends L.CircleMarker {
  declare protected _renderer: L.Canvas;
  declare protected _point: L.Point;

  private _img?: HTMLImageElement;
  private _size: number;

  constructor(latlng: L.LatLngExpression, options: CanvasCustomMarkerOptions) {
    super(latlng, options);

    this._size = options.size ?? 32;

    if (options.imageSrc) {
      this._img = new Image();
      this._img.src = options.imageSrc;
      this._img.onload = () => this.redraw();
    }
  }

  protected _updatePath() {
		const renderer = this._renderer as any;
		const ctx = renderer._ctx as CanvasRenderingContext2D;
		const p = this._point;

		if (!ctx || !p) return;
		
		ctx.save();

		if (this._img) {
			ctx.drawImage(
				this._img,
				p.x - this._size / 2,
				p.y - this._size / 2,
				this._size,
				this._size
			);
		} else {
			// fallback vers le comportement natif de Leaflet
			const parentUpdatePath = (L.CircleMarker.prototype as any)._updatePath;
			parentUpdatePath.call(this);
		}
	
		ctx.restore();
	}
}
