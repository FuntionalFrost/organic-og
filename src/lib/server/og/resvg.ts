// src/lib/server/og/resvg.ts
import path from 'node:path';
import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';

let cachedFontFiles: string[] | null = null;

function getFontFiles(): string[] {
	if (cachedFontFiles !== null) return cachedFontFiles;

	const candidateDirs = [
		path.resolve(process.cwd(), 'src/lib/server/assets/fonts'),
		path.resolve(process.cwd(), 'build/server/assets/fonts'),
		path.resolve(process.cwd(), 'assets/fonts')
	];

	for (const dir of candidateDirs) {
		const bold = path.join(dir, 'Inter-Bold.ttf');
		const reg = path.join(dir, 'Inter-Regular.ttf');
		if (fs.existsSync(bold) && fs.existsSync(reg)) {
			cachedFontFiles = [bold, reg];
			return cachedFontFiles;
		}
	}

	cachedFontFiles = [];
	return cachedFontFiles;
}

export async function renderSvgToPng(svgString: string, width = 1200): Promise<Buffer> {
	const fontFiles = getFontFiles();

	const resvg = new Resvg(svgString, {
		fitTo: { mode: 'width', value: width },
		font: {
			fontFiles: fontFiles.length > 0 ? fontFiles : undefined,
			loadSystemFonts: fontFiles.length === 0,
			defaultFontFamily: 'Inter'
		}
	});

	return resvg.render().asPng();
}
