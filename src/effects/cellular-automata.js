
export const cellularAutomata = ({ born, survive, live, dead }) => ({ data }) => {

	return data.duplicate((x, y) => {

		let el = data[ x ][ y ];
		let neighborCount = 0;

		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {

				if (i === 0 && j === 0) {
					continue;
				}

				if (data.get(x + i, y + j) === live) {
					neighborCount++;
				}
			}
		}

		if (neighborCount >= born) {
			return live;
		}

		if (neighborCount >= survive && el === live) {
			return live;
		}

		return dead;
	});
};
