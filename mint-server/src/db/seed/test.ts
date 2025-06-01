import { XMLParser } from "fast-xml-parser";
import * as fs from 'fs/promises'

function getPointsFromGpx(gpxData: Record<string, any>) {
  return (gpxData.gpx.trk.trkseg.trkpt as []).map(p => ({
    alt: String(p['ele']),
    lat: p['@_lat'],
    lon: p['@_lon'],
  }))
}

async function main() {
  const gpxStr = await fs.readFile('./src/db/seed/gpxs/lut-2025-37km.gpx')
  const parser = new XMLParser({
    ignoreAttributes: false
  })
  const gpxData = parser.parse(gpxStr)
  const points = getPointsFromGpx(gpxData)
  console.log(points.filter(t => t.alt && t.lat && t.lon))
  // console.log(gpxData)
}

main()