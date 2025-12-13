import { LineString } from "geojson";
import { Position3D, Position3DWithTimestamp } from "./declarations"

export function getPointsFromGpx(gpxData: Record<string, any>): {
	alt: number,
	lat: number,
	lon: number,
}[] {
	return (gpxData.gpx.trk.trkseg.trkpt as []).map(p => ({
		alt: Number(p['ele']),
		lat: Number(p['@_lat']),
		lon: Number(p['@_lon']),
	}))
}

export function randomGaussian(min = 6, max = 21, mean = 10, stdDev = 2.97) {
  // Box–Muller transform
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();

  let num = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  // Ajuster avec μ et σ
  num = num * stdDev + mean;

  // Forcer dans [min, max]
  return Math.min(max, Math.max(min, num));
}

export function getBornPoints(positions: Position3D[], distance: number) {
  const index = Math.round(distance)
  return [positions[index - 1], positions[index]]
}

export function getDistanceBetweenPoints(p1: Position3D, p2: Position3D) {
  const R = 6371000;
  
  const lat1 = p1.lat * Math.PI / 180;
  const lon1 = p1.lon * Math.PI / 180;
  const lat2 = p2.lat * Math.PI / 180;
  const lon2 = p2.lon * Math.PI / 180;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d2D = R * c; // distance au sol

  const dz = (p2.alt ?? 0) - (p1.alt ?? 0);

  return Math.sqrt(d2D * d2D + dz * dz);
}

export function getPointsTotalDistance(points: Position3D[]) {
  return points.reduce((prev, _, i) => {
    if(i === points.length - 1) return prev
    const currentPoint = points[i]
    const nextPoint = points[i + 1]
    return prev + getDistanceBetweenPoints(currentPoint, nextPoint)
  }, 0)
}

export function interpolatePoint(A: Position3D, B: Position3D, distanceFromA: number) {
  // Calcul de la distance 2D entre A et B (Haversine simplifié)
  const R = 6371000; // rayon Terre en m
  const toRad = x => x * Math.PI / 180;
  
  const lat1 = toRad(A.lat);
  const lon1 = toRad(A.lon);
  const lat2 = toRad(B.lat);
  const lon2 = toRad(B.lon);

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(dLon/2)**2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const totalDist = R * c;

  // Fraction du segment parcourue
  const t = distanceFromA / totalDist;

  // Interpolation linéaire (approximation très correcte pour petit segment)
  const lat = A.lat + (B.lat - A.lat) * t;
  const lon = A.lon + (B.lon - A.lon) * t;

  // Interpolation de l'altitude si disponible
  let alt;
  if (A.alt != null && B.alt != null) {
    alt = A.alt + (B.alt - A.alt) * t;
  }

  return { lat, lon, alt };
}

export function gpxPointsToEquidistantPoints(points: Position3D[], distanceBetweenPoints = 1) {
  const equidistantPoints: Position3D[] = [points[0]]
  let remainingDistanceToCoverFromLast = 0
  for(let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i]
    const nextPoint = points[i + 1]

    if(currentPoint.lat === nextPoint.lat && currentPoint.lon === nextPoint.lon) continue

    if(remainingDistanceToCoverFromLast) {
      const point = interpolatePoint(currentPoint, nextPoint, 1 - remainingDistanceToCoverFromLast)
      equidistantPoints.push(point)
    }

    let startingPoint = equidistantPoints.at(-1)!
    
    let remainingDistanceToCover = getDistanceBetweenPoints(startingPoint, nextPoint)
    while (remainingDistanceToCover > 1) {
      let oneMeterPoint = interpolatePoint(startingPoint, nextPoint, 1)
    
      startingPoint = oneMeterPoint
      equidistantPoints.push(oneMeterPoint)
      remainingDistanceToCover -= 1
    }
    
    remainingDistanceToCoverFromLast = remainingDistanceToCover
  }

  if(remainingDistanceToCoverFromLast) {
    equidistantPoints.push(points.at(-1)!)
  }

  return equidistantPoints
}

export function encodePositionBuffer(position: Position3D) {
  const buf = Buffer.alloc(12);

  buf.writeInt32LE(Math.round(position.lat * 1e6), 0);
  buf.writeInt32LE(Math.round(position.lon * 1e6), 4);
  buf.writeInt32LE(Math.round(position.alt * 1e2), 8);

  return buf;
}


export function decodePositionBuffer(buf: Buffer): Position3D {
  return {
    lat: buf.readInt32LE(0) / 1e6,
    lon: buf.readInt32LE(4) / 1e6,
    alt: buf.readInt32LE(8) / 1e2,
  };
}

export function encodeRacePositionsBuffer(positions: Position3D[]) {
  const { length } = positions
  const buf = Buffer.alloc(length * 12);
  for(let i = 0; i < length; i++) {
    const position = positions[i]
    const offset = i * 12
    buf.writeInt32LE(Math.round(position.lat * 1e6), offset);
    buf.writeInt32LE(Math.round(position.lon * 1e6), offset + 4);
    buf.writeInt32LE(Math.round(position.alt * 1e2), offset + 8);
  }

  return buf
}

export function decodeRacePositionsBuffer(buf: Buffer): Position3D[] {
  const positions: Position3D[] = [];
  const count = buf.byteLength / 12;

  for (let i = 0; i < count; i++) {
    const offset = i * 12;

    positions.push({
      lat: buf.readInt32LE(offset) / 1e6,
      lon: buf.readInt32LE(offset + 4) / 1e6,
      alt: buf.readInt32LE(offset + 8) / 1e2,
    });
  }

  return positions;
}


import { lineString, along, length, lineSegment, distance } from '@turf/turf';

/**
 * Trouve le segment de la LineString où un point à une distance donnée tombe.
 * @param {LineString} line - La LineString Turf
 * @param {number} targetDistance - Distance depuis le début (en km)
 * @returns {{ start: Position, end: Position, index: number, point: Feature<Point> }}
 */
export function getSegmentAtDistance(line: LineString, targetDistance: number) {
  const segments = lineSegment(line); // Retourne un FeatureCollection de segments
  let cumulative = 0;

  for (let i = 0; i < segments.features.length; i++) {
    const segment = segments.features[i];
    const segLen = length(segment, { units: 'kilometers' });

    if (targetDistance <= cumulative + segLen) {
      const point = along(line, targetDistance, { units: 'kilometers' });
      return {
        index: i,
        start: segment.geometry.coordinates[0],
        end: segment.geometry.coordinates[1],
        point
      };
    }

    cumulative += segLen;
  }

  // Si tu dépasses la ligne (bravo Usain Bolt)
  const last = segments.features[segments.features.length - 1];
  return {
    index: segments.features.length - 1,
    start: last.geometry.coordinates[0],
    end: last.geometry.coordinates[1],
    point: along(line, targetDistance, { units: 'kilometers' })
  };
}
