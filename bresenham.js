
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
const col = 10;
const grid_size = 32;

/* others */
let dragging_point = null;
let needToDraw = true;

function init() {
	c.addEventListener("mousedown", mouseDownListener, false);
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

	if ( dragging_point.x < 0 ) dragging_point.x = 0;
	if ( dragging_point.y < 0 ) dragging_point.y = 0;
	if ( dragging_point.x > (col - 1)  * grid_size ) dragging_point.x = (col - 1) * grid_size;
	if ( dragging_point.y > (row - 1)  * grid_size ) dragging_point.y = (row - 1) * grid_size;

	doSomething();
	needToDraw = true;
}

function mouseUpListener(evt) {
	window.removeEventListener("mousemove", mouseMoveListener, false);
	window.removeEventListener("mouseup", mouseUpListener, false);
	dragging_point = null;
}

function doSomething() {

}

function drawBackground()
{
	ctx.fillStyle="#fff";
	ctx.fillRect(0, 0, width, height);
}

function drawGrid() {
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
	if (needToDraw)
	{
		drawBackground();
		drawGrid();
		drawPoint();

		needToDraw = false;
	}

	setTimeout(updateBoard, 20);
}

init();
updateBoard();