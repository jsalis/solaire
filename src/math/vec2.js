
export const clone = ({ x, y }) => ({ x, y });

export const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y });

export const equals = (a, b) => (a.x === b.x && a.y === b.y);

export const intersects = (v, a, b) => (v.x >= a.x && v.x <= b.x && v.y >= a.y && v.y <= b.y);
