import * as L from "leaflet";

interface CanvasLayerOptions extends L.LayerOptions {
  renderer: L.Canvas;
}

export class CanvasLayer extends L.Layer {
  declare options: CanvasLayerOptions;
  declare _renderer: L.Canvas;
  declare _map: L.Map;

  constructor(options: CanvasLayerOptions) {
    super(options);
  }

  onAdd(map: L.Map) {
    this._map = map;
    this._renderer = this.options.renderer;
    (this._renderer as any)._layers[L.stamp(this)] = this;
    this.redraw();
    return this;
  }

  onRemove() {
    delete (this._renderer as any)._layers[L.stamp(this)];
    (this._renderer as any)._redraw();
    return this;
  }

  redraw() {
    (this._renderer as any)._redraw();
  }

  _update() {
    const ctx = (this._renderer as any)._ctx as CanvasRenderingContext2D;

    ctx.fillStyle = "red";
    ctx.fillRect(10, 10, 50, 50);
  }
}

