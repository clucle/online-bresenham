
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

const src = new Point(120, 120);
const dst = new Point(200, 200);

const blank = 12;
const row = 18;
const col = 10;
const grid_size = 32;

function init() {
}

function runPhysics() {

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

	const radius = 6;

	ctx.beginPath();
	ctx.moveTo(blank + src.x, blank + src.y);
	ctx.lineTo(blank + dst.x, blank + dst.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(blank + src.x, blank + src.y, radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.arc(blank + dst.x, blank + dst.y, radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

// Canvas Loop
function updateBoard() {
	drawGrid();
	drawPoint();

	setTimeout(updateBoard, 20);
}

init();
updateBoard();