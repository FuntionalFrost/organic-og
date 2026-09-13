// src/lib/server/og/fonts.ts
import fs from 'node:fs/promises';
import path from 'node:path';

let fontBold: ArrayBuffer | null = null;
let fontRegular: ArrayBuffer | null = null;

function toArrayBuffer(input: Buffer | Uint8Array | ArrayBuffer | ArrayLike<number>): ArrayBuffer {
	if (input instanceof ArrayBuffer) return input;
	const buffer = Buffer.isBuffer(input) ? input : Buffer.from(input);
	const copy = new Uint8Array(buffer.byteLength);
	copy.set(buffer);
	return copy.buffer;
}

// Pre-load once into memory from local assets or fallback to CDN
export async function getCachedFonts(): Promise<{
	fontBold: ArrayBuffer;
	fontRegular: ArrayBuffer;
}> {
	if (fontBold && fontRegular) {
		return { fontBold, fontRegular };
	}

	// 1. Try Local filesystem
	try {
		const fontsDir = path.resolve(process.cwd(), 'src/lib/server/assets/fonts');
		const [boldFile, regFile] = await Promise.all([
			fs.readFile(path.join(fontsDir, 'Inter-Bold.woff')),
			fs.readFile(path.join(fontsDir, 'Inter-Regular.woff'))
		]);

		fontBold = toArrayBuffer(boldFile);
		fontRegular = toArrayBuffer(regFile);
		return { fontBold, fontRegular };
	} catch {
		// 2. Fallback to remote CDN if not found locally
		try {
			const [boldRes, regRes] = await Promise.all([
				fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-700-normal.woff'),
				fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.woff')
			]);
			fontBold = await boldRes.arrayBuffer();
			fontRegular = await regRes.arrayBuffer();
			return { fontBold, fontRegular };
		} catch (err) {
			console.error('Failed to load fonts for Satori renderer:', err);
			throw err;
		}
	}
}
