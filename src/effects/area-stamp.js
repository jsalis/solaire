
import { isFunction } from '../utils/common';

export const areaStamp = ({ target, replace, area, step = 1, attempts = 1 }) => ({ data, random }) => {

	let range = area.max - area.min;
	let canStamp = (x, y, width, height) => {
		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				if (!inRange(data, x + i, y + j) || data.get(x + i, y + j) !== target) {
					return false;
				}
			}
		}
		return true;
	};

	while (attempts > 0) {

		let x = Math.floor(random() * (data.size() - 1) / step) * step + 1;
		let y = Math.floor(random() * (data.size() - 1) / step) * step + 1;
		let width = Math.floor(random() * (range - 1) / step) * step + area.min;
		let height = Math.floor(random() * (range - 1) / step) * step + area.min;

		if (!canStamp(x, y, width, height)) {
			attempts--;
			continue;
		}

		let val = isFunction(replace) ? replace() : replace;

		for (let i = 0; i < height; i++) {
			for (let j = 0; j < width; j++) {
				data.set(x + i, y + j, val);
			}
		}
	}
};

function inRange(data, x, y) {
	return x >= 0 && x < data.size() && y >= 0 && y < data.size();
}
