import type { LineString } from "@/declarations"
import { lineString } from "@turf/turf"
import { clsx, type ClassValue } from "clsx"
import { XMLParser } from "fast-xml-parser"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formUpdator(
  currentEntity: Record<string, any>,
  updateForm: Record<string, any>,
  setUpdateForm: React.Dispatch<React.SetStateAction<Record<string, any>>>
) {


  return [
    (
      key: string,
      value: any
    ) => {

      console.log(key, value)

      const updateFormCopy = { ...updateForm }
      if (currentEntity[key] === value) {
        delete updateFormCopy[key]
      } else updateFormCopy[key] = value

      console.log(updateFormCopy)

      setUpdateForm(updateFormCopy)
    }
  ]
}

export interface Position3D {
  lat: number
  lon: number
  alt: number
}

export function getPointsFromGpx(gpxData: Record<string, any>): Position3D[] {
	return (gpxData.gpx.trk.trkseg.trkpt as []).map(p => ({
		alt: Number(p['ele']),
		lat: Number(p['@_lat']),
		lon: Number(p['@_lon']),
	}))
}

export function gpxToLineString(gpx: string) {
  const xmlParser = new XMLParser({ ignoreAttributes: false })
  console.log(gpx)
  const gpxData = xmlParser.parse(gpx)
  const points = getPointsFromGpx(gpxData)
  const line = lineString(points.map(({ lat, lon }) => [lon, lat]))
  return line.geometry as LineString
}

export function uuid() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
