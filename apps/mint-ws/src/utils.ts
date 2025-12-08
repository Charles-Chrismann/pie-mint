export function simplifyGpx(gpxStr: string) {
	return gpxStr.replace(/<extensions>[\s\S]*?<\/extensions>/g, '')
  .replace(/<time>[\s\S]*?<\/time>/g, '');
}