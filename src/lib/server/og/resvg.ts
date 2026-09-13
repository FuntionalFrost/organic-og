// server/utils/resvg.ts
import { Resvg } from '@resvg/resvg-js';

export async function renderSvgToPng(svgString: string, width = 1200): Promise<Buffer> {
	const resvg = new Resvg(svgString, {
		fitTo: { mode: 'width', value: width }
	});

	return resvg.render().asPng();
}
