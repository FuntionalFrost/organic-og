import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return ['privacy', 'terms', 'impressum'].includes(param);
};
