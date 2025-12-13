import { Position3D } from "src/classes/declarations";
import { FlatPosition } from "src/declarations";

export function getPointsFromGpx(gpxData: Record<string, any>): Position3D[] {
	return (gpxData.gpx.trk.trkseg.trkpt as []).map(p => ({
		alt: Number(p['ele']),
		lat: Number(p['@_lat']),
		lon: Number(p['@_lon']),
	}))
}

export function chunkify<T>(array: T[], chunkSize = 256): T[][] {
  if (!Array.isArray(array)) throw new TypeError('Le premier argument doit être un tableau');
  if (typeof chunkSize !== 'number' || chunkSize <= 0) throw new RangeError('chunkSize doit être un entier strictement positif');

  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export function createGPXString(points: FlatPosition[]) {
	let str = `<?xml version="1.0" encoding="UTF-8"?><gpx version="1.1" creator="Mint" xmlns="http://www.topografix.com/GPX/1/1"><trk><trkseg>`

	for(let point of points) {
		const alt = point[2]
		const ele = alt !== null ? `<ele>${alt}</ele>` : ``
		const time = new Date(point[0])
		str += `<trkpt lat="${point[2]}" lon="${point[1]}">${ele}<time>${time.toISOString()}</time></trkpt>`
	}

	str += `</trkseg></trk></gpx>`

	return str
}
