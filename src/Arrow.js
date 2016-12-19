/* global Snap */
/*
	Class: Arrow
	from_task ---> to_task

	Opts:
		gantt (Gantt object)
		from_task (Bar object)
		to_task (Bar object)
*/

export default function Arrow(gt, from_task, to_task) {

	const self = {};

	function init() {
		self.from_task = from_task;
		self.to_task = to_task;
		prepare();
		draw();
	}

	function prepare() {

		self.start_x = from_task.$bar.getX() + from_task.$bar.getWidth() / 2;

		const condition = () =>
			to_task.$bar.getX() < self.start_x + gt.config.padding &&
				self.start_x > from_task.$bar.getX() + gt.config.padding;

		while(condition()) {
			self.start_x -= 10;
		}

		self.start_y = gt.config.header_height + gt.config.bar.height +
			(gt.config.padding + gt.config.bar.height) * from_task.task._index +
			gt.config.padding;

		self.end_x = to_task.$bar.getX() - gt.config.padding / 2;
		self.end_y = gt.config.header_height + gt.config.bar.height / 2 +
			(gt.config.padding + gt.config.bar.height) * to_task.task._index +
			gt.config.padding;

		const from_is_below_to = (from_task.task._index > to_task.task._index);
		self.curve = gt.config.arrow.curve;
		self.clockwise = from_is_below_to ? 1 : 0;
		self.curve_y = from_is_below_to ? -self.curve : self.curve;
		self.offset = from_is_below_to ?
			self.end_y + gt.config.arrow.curve :
			self.end_y - gt.config.arrow.curve;

		self.path =
			Snap.format('M {start_x} {start_y} V {offset} ' +
				'a {curve} {curve} 0 0 {clockwise} {curve} {curve_y} ' +
				'L {end_x} {end_y} m -5 -5 l 5 5 l -5 5',
				{
					start_x: self.start_x,
					start_y: self.start_y,
					end_x: self.end_x,
					end_y: self.end_y,
					offset: self.offset,
					curve: self.curve,
					clockwise: self.clockwise,
					curve_y: self.curve_y
				});

		if(to_task.$bar.getX() < from_task.$bar.getX() + gt.config.padding) {
			self.path =
				Snap.format('M {start_x} {start_y} v {down_1} ' +
				'a {curve} {curve} 0 0 1 -{curve} {curve} H {left} ' +
				'a {curve} {curve} 0 0 {clockwise} -{curve} {curve_y} V {down_2} ' +
				'a {curve} {curve} 0 0 {clockwise} {curve} {curve_y} ' +
				'L {end_x} {end_y} m -5 -5 l 5 5 l -5 5',
					{
						start_x: self.start_x,
						start_y: self.start_y,
						end_x: self.end_x,
						end_y: self.end_y,
						down_1: gt.config.padding / 2 - self.curve,
						down_2: to_task.$bar.getY() + to_task.$bar.getHeight() / 2 - self.curve_y,
						left: to_task.$bar.getX() - gt.config.padding,
						offset: self.offset,
						curve: self.curve,
						clockwise: self.clockwise,
						curve_y: self.curve_y
					});
		}
	}

	function draw() {
		self.element = gt.canvas.path(self.path)
			.attr('data-from', self.from_task.task.id)
			.attr('data-to', self.to_task.task.id);
	}

	function update() { // eslint-disable-line
		prepare();
		self.element.attr('d', self.path);
	}
	self.update = update;

	init();

	return self;
}
