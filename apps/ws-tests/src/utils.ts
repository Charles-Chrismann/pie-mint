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