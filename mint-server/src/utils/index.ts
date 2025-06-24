import { eq } from "drizzle-orm"
import { db } from "../db"
import { track_points_table, track_segments_table, tracks_table } from "../db/schema"

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



export async function getSubEventTrack(subEventId: number) {
  const track = (await db
    .select()
    .from(tracks_table)
    .where(eq(tracks_table.id, subEventId)).limit(1))[0]

  const [points, segments] = await Promise.all([
    db
      .select(
        {
          id: track_points_table.id,
          lat: track_points_table.lat,
          lng: track_points_table.lng,
          is_first_point: track_points_table.is_first_point,
          is_last_point: track_points_table.is_last_point,
          track_id: track_points_table.track_id,
        }
      )
      .from(track_points_table)
      .where(eq(track_points_table.track_id, track.id)),

    db
      .select(
        {
          start_position_id: track_segments_table.start_position_id,
          end_position_id: track_segments_table.end_position_id,
        }
      )
      .from(track_segments_table)
      .where(eq(track_segments_table.track_id, track.id))

  ])


  const pointsToReturn: typeof points = []
  const firstPoint = points.find(p => p.is_first_point)!

  pointsToReturn.push(firstPoint)

  let nextPointId = segments.find(s => s.start_position_id === firstPoint!.id)!.end_position_id
  let nextPoint = points.find(p => p.id === nextPointId)

  while (nextPoint) {
    pointsToReturn.push(nextPoint)

    const nextSegment = segments.find(s => s.start_position_id === nextPoint!.id)
    if (!nextSegment) break;
    let nextPointId = nextSegment.end_position_id
    nextPoint = points.find(p => p.id === nextPointId)
  }

  return pointsToReturn
}