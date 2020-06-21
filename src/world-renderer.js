
import { Direction } from './direction';

export const WorldRenderer = {

	/**
	 * Creates a new world renderer object.
	 *
	 * @param   {World}  world
	 * @param   {Object} config
	 * @returns {Object}
	 */
	create(world, { size, colors }) {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		const unit = size / world.regionSize;

		canvas.width = size * 3;
		canvas.height = size * 3;

		return {
			el() {
				return canvas;
			},

			render() {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				Object.values(Direction.NEIGHBORS).forEach(dir => {
					let x = world.position.x + dir.x;
					let y = world.position.y + dir.y;
					let region = world.getRegion({ x, y });

					if (!region) {
						return;
					}

					let origin = {
						x: (dir.x + 1) * size,
						y: (dir.y + 1) * size
					};

					region.data.each((el, x, y) => {
						let pos = {
							x: origin.x + (x * unit),
							y: origin.y + (y * unit)
						};

						ctx.fillStyle = colors[ el ];
						ctx.fillRect(pos.x, pos.y, unit, unit);
					});
				});
			}
		};
	}
};
