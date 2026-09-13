import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return ['privacy', 'terms', 'refunds', 'impressum'].includes(param);
};
