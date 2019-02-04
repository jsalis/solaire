
import { isDefined } from '../utils/common';
import { Direction } from '../direction';

export const majorityRules = () => ({ data }) => {

	return data.map((el, x, y) => {

		let neighborCount = {};

		Object.values(Direction.NEIGHBORS).forEach(dir => {

			let el = data.get(x + dir.x, y + dir.y);

			if (!isDefined(el)) {
				return;
			}

			if (!neighborCount[ el ]) {
				neighborCount[ el ] = 0;
			}

			neighborCount[ el ]++;
		});

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
