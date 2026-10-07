import { defineParams } from '@sveltejs/kit/params';

const matchLegalDoc = (param: string) => {
	return ['privacy', 'terms', 'impressum'].includes(param);
};

export const params = defineParams({
	legalDoc: (param) => (matchLegalDoc(param) ? param : undefined)
});
