
import { isDefined } from '../utils';

export const majorityRules = () => ({ data }) => {

	return data.duplicate((x, y) => {

		let neighborCount = {};

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {

				let el = data.get(x + i, y + j);

				if (!isDefined(el)) {
					continue;
				}

				if (!neighborCount[ el ]) {
					neighborCount[ el ] = 0;
				}

				neighborCount[ el ]++;
			}
		}

		let majority = 0;
		let majorityKey;

		for (let [ key, count ] of Object.entries(neighborCount)) {
			if (count > majority) {
				majority = count;
				majorityKey = key;
			}
		}

		return Number(majorityKey);
	});
};
