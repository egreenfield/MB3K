
// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
interface point {
	value:number,
	startTimeInMillis:number;
};

function getSqDist(p1:point, p2:point) {

    var dx = p1.value - p2.value,
        dy = p1.startTimeInMillis - p2.startTimeInMillis;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p:point, p1:point, p2:point) {

    var x = p1.value,
        y = p1.startTimeInMillis,
        dx = p2.value - x,
        dy = p2.startTimeInMillis - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.value - x) * dx + (p.startTimeInMillis - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.value;
            y = p2.startTimeInMillis;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.value - x;
    dy = p.startTimeInMillis - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points:point[], sqTolerance:number) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

// simplification using optimized Douglas-Peucker algorithm with recursion elimination
function simplifyDouglasPeucker(points:point[], sqTolerance:number) {

    var len = points.length,
        MarkerArray = typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
        markers = new MarkerArray(len),
        first = 0,
        last = len - 1,
        stack = [],
        newPoints = [],
        i, maxSqDist, sqDist, index;

    markers[first] = markers[last] = 1;

    while (last) {

        maxSqDist = 0;

        for (i = first + 1; i < last; i++) {
            sqDist = getSqSegDist(points[i], points[first], points[last]);

            if (sqDist > maxSqDist) {
                index = i;
                maxSqDist = sqDist;
            }
        }

        if (maxSqDist > sqTolerance) {
            markers[index] = 1;
            stack.push(first, index, index, last);
        }

        last = stack.pop();
        first = stack.pop();
    }

    for (i = 0; i < len; i++) {
        if (markers[i]) newPoints.push(points[i]);
    }

    return newPoints;
}

// both algorithms combined for awesome performance
export function simplify(points:point[], tolerance:number, highestQuality:boolean) {

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

