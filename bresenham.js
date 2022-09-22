
/* canvas setting */
const c = document.getElementById("board");
const ctx = c.getContext("2d");
const width = 600;
const height = 600;

/* bresenham setting */
function Point(x, y) {
	this.x = x;
	this.y = y;
}

const point_radius = 6;

Point.prototype.hover = function (cx, cy) {
	return ((cx > this.x - point_radius) && (cx < this.x + point_radius)
		&& (cy > this.y - point_radius) && (cy < this.y + point_radius));
}

const src = new Point(120, 120);
const dst = new Point(200, 200);

const blank = 12;
const row = 18;
const col = 18;
const grid_size = 32;

let grid_2d;

function clearGrid() {
	for (let r = 0; r < row; r++) {
		for (let c = 0; c < col; c++) {
			grid_2d[r][c] = 0;
		}
	}
}

/* others */
let dragging_point = null;
let needToDraw = true;

function init() {
	c.addEventListener("mousedown", mouseDownListener, false);

	grid_2d = new Array(row);
	for (let r = 0; r < row; r++) {
		grid_2d[r] = new Array(col);
	}

	clearGrid();
	ProcessBresenham();
}

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return {
		x: (evt.clientX - rect.left) * (c.width / rect.width) - blank,
		y: (evt.clientY - rect.top) * (c.height / rect.height) - blank
	};
}

function mouseDownListener(evt) {
	const mouse_pos = getMousePos(c, evt);
	if (src.hover(mouse_pos.x, mouse_pos.y)) {
		dragging_point = src;
	}
	else if (dst.hover(mouse_pos.x, mouse_pos.y)) {
		dragging_point = dst;
	}
	else {
		dragging_point = null;
	}

	if (dragging_point) {
		window.addEventListener("mousemove", mouseMoveListener, false);
		window.addEventListener("mouseup", mouseUpListener, false);
	}
}

function mouseMoveListener(evt) {
	if (!dragging_point) return;

	const mouse_pos = getMousePos(c, evt);
	dragging_point.x = mouse_pos.x;
	dragging_point.y = mouse_pos.y;

	if (dragging_point.x < 0) dragging_point.x = 0;
	if (dragging_point.y < 0) dragging_point.y = 0;
	if (dragging_point.x > (col - 1) * grid_size) dragging_point.x = (col - 1) * grid_size;
	if (dragging_point.y > (row - 1) * grid_size) dragging_point.y = (row - 1) * grid_size;

	ProcessBresenham();
	needToDraw = true;
}

function mouseUpListener(evt) {
	window.removeEventListener("mousemove", mouseMoveListener, false);
	window.removeEventListener("mouseup", mouseUpListener, false);
	dragging_point = null;
}

function ProcessBresenham() {
	clearGrid();

	// https://gamedev.stackexchange.com/questions/81267/how-do-i-generalise-bresenhams-line-algorithm-to-floating-point-endpoints
	// https://jsfiddle.net/6x7t4q1o/5

	let grid_src_x = src.x / grid_size;
	let grid_src_y = src.y / grid_size;
	let grid_dst_x = dst.x / grid_size;
	let grid_dst_y = dst.y / grid_size;
	//Grid cells are 1.0 X 1.0.
	let x = Math.floor(grid_src_x);
	let y = Math.floor(grid_src_y);
	let diffX = grid_dst_x - grid_src_x;
	let diffY = grid_dst_y - grid_src_y;
	let stepX = Math.sign(diffX);
	let stepY = Math.sign(diffY);

	//Ray/Slope related maths.
	//Straight distance to the first vertical grid boundary.
	let xOffset = grid_dst_x > grid_src_x ?
		(Math.ceil(grid_src_x) - grid_src_x) :
		(grid_src_x - Math.floor(grid_src_x));
	//Straight distance to the first horizontal grid boundary.
	let yOffset = grid_dst_y > grid_src_y ?
		(Math.ceil(grid_src_y) - grid_src_y) :
		(grid_src_y - Math.floor(grid_src_y));
	//Angle of ray/slope.
	let angle = Math.atan2(-diffY, diffX);
	//NOTE: These can be divide by 0's, but JS just yields Infinity! :)
	//How far to move along the ray to cross the first vertical grid cell boundary.
	let tMaxX = xOffset / Math.cos(angle);
	//How far to move along the ray to cross the first horizontal grid cell boundary.
	let tMaxY = yOffset / Math.sin(angle);
	//How far to move along the ray to move horizontally 1 grid cell.
	let tDeltaX = 1.0 / Math.cos(angle);
	//How far to move along the ray to move vertically 1 grid cell.
	let tDeltaY = 1.0 / Math.sin(angle);

	//Travel one grid cell at a time.
	let manhattanDistance = Math.abs(Math.floor(grid_dst_x) - Math.floor(grid_src_x)) +
		Math.abs(Math.floor(grid_dst_y) - Math.floor(grid_src_y));
	for (let t = 0; t <= manhattanDistance; ++t) {
		grid_2d[y][x] = 1;
		//Only move in either X or Y coordinates, not both.
		if (Math.abs(tMaxX) < Math.abs(tMaxY)) {
			tMaxX += tDeltaX;
			x += stepX;
		} else {
			tMaxY += tDeltaY;
			y += stepY;
		}
	}
}

function drawBackground() {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, width, height);
}

function drawGrid() {
	ctx.fillStyle = "#6975A6";
	for (let r = 0; r < row; r++) {
		for (let c = 0; c < col; c++) {
			if (grid_2d[r][c] == 1)
			{
				ctx.fillRect(blank + c * grid_size, blank + r * grid_size, grid_size, grid_size);
			}
		}
	}

	ctx.strokeStyle = "#333300";
	ctx.fillStyle = "#333300";
	for (let c = 0; c < col; c++) {
		ctx.beginPath();
		ctx.moveTo(blank + c * grid_size, blank);
		ctx.lineTo(blank + c * grid_size, blank + (row - 1) * grid_size);
		ctx.stroke();
	}
	for (let r = 0; r < row; r++) {
		ctx.beginPath();
		ctx.moveTo(blank, blank + r * grid_size);
		ctx.lineTo(blank + (col - 1) * grid_size, blank + r * grid_size);
		ctx.stroke();
	}
}

function drawPoint() {
	ctx.strokeStyle = "#333300";
	ctx.fillStyle = "#333300";

	ctx.beginPath();
	ctx.moveTo(blank + src.x, blank + src.y);
	ctx.lineTo(blank + dst.x, blank + dst.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(blank + src.x, blank + src.y, point_radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(blank + dst.x, blank + dst.y, point_radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

// Canvas Loop
function updateBoard() {
	if (needToDraw) {
		drawBackground();
		drawGrid();
		drawPoint();

		needToDraw = false;
	}

	setTimeout(updateBoard, 20);
}

init();
updateBoard();