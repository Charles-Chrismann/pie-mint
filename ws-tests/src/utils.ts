export function getPointsFromGpx(gpxData: Record<string, any>): {
  alt: number,
  lat: number,
  lng: number,
}[] {
  return (gpxData.gpx.trk.trkseg.trkpt as []).map(p => ({
    alt: Number(p['ele']),
    lat: Number(p['@_lat']),
    lng: Number(p['@_lon']),
  }))
}