
import {type Vec2} from './Vec2';

type TripletOrientation = 'CLOCKWISE' | 'COUNTER-CLOCKWISE' | 'COLLINEAR';

// Adapted from: geeksforgeeks.org/check-if-two-given-line-segments-intersect
// Key concepts:
// - Orientation: 3 points can be oriented clockwise, counterclockwise, or collinearly
// - 2 line segments can only intersect if:
//   - General case: (p1, q1, p2) & (p1, q1 q2) have different orientations, &
//                   (p2, q2, p1) & (p2, q2, q1) have different orientations.
//   - Special case:
//     - (p1, q1, p2), (p1, q1, q2), (p2, q2, p1), and (p2, q2, q1) are ALL collinear
//     - the x-projections of (p1, q1) and (p2, q2) intersect
//     - the y-projections of (p1, q1) and (p2, q2) intersect
/**
 * q & p are line segments defined by the points (p1, q1) and (p2, q2) respectively.
 */
export function doLinesIntersect(p1: Vec2, q1: Vec2, p2: Vec2, q2: Vec2): boolean {
	const o1 = orientation(p1, q1, p2);
	const o2 = orientation(p1, q1, q2);
	const o3 = orientation(p2, q2, p1);
	const o4 = orientation(p2, q2, q1);

	// General case
	if (o1 !== o2 && o3 !== o4) {
		return true;
	}

	// NOTE: Not currently implementing check for collinearity,
	// NOTE: because it adds a lot of complexity & isn't relevant to my use case
	// NOTE: (drawing a line across the edges I want to remove)
	return false;
}

// Find the orientation of ordered triplet of points p, q, r.
function orientation(p: Vec2, q: Vec2, r: Vec2): TripletOrientation {
	const numericResult = ((q.y - p.y) * (r.x - q.x)) - ((q.x - p.x) * (r.y - q.y));

	if (numericResult === 0) {
		return 'COLLINEAR';
	}

	return numericResult > 0 ? 'CLOCKWISE' : 'COUNTER-CLOCKWISE';
}
