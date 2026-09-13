// server/utils/satori.ts
import satori from 'satori';

export async function renderSatori(
	vnode: Parameters<typeof satori>[0],
	options: Parameters<typeof satori>[1]
): Promise<string> {
	return satori(vnode, options);
}
