/* global Snap */
/*
	Class: Bar

	Opts:
		gt: Gantt object
		task: task object
*/

export default function Bar(gt, task) {

	const self = {};

	function init() {
		set_defaults();
		prepare();
		draw();
		bind();
	}

	function set_defaults() {
		self.action_completed = false;
		self.task = task;
	}

	function prepare() {
		prepare_values();
		prepare_plugins();
	}

	function prepare_values() {
		self.invalid = self.task.invalid;
		self.height = gt.config.bar.height;
		self.x = compute_x();
		self.y = compute_y();
		self.corner_radius = 3;
		self.duration = (self.task._end.diff(self.task._start, 'hours') + 24) / gt.config.step;
		self.width = gt.config.column_width * self.duration;
		self.progress_width = gt.config.column_width * self.duration * (self.task.progress / 100) || 0;
		self.group = gt.canvas.group().addClass('bar-wrapper').addClass(self.task.custom_class || '');
		self.bar_group = gt.canvas.group().addClass('bar-group').appendTo(self.group);
		self.handle_group = gt.canvas.group().addClass('handle-group').appendTo(self.group);
	}

	function prepare_plugins() {
		Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
			Element.prototype.getX = function () {
				return +this.attr('x');
			};
			Element.prototype.getY = function () {
				return +this.attr('y');
			};
			Element.prototype.getWidth = function () {
				return +this.attr('width');
			};
			Element.prototype.getHeight = function () {
				return +this.attr('height');
			};
			Element.prototype.getEndX = function () {
				return this.getX() + this.getWidth();
			};
		});
	}

	function draw() {
		draw_bar();
		draw_progress_bar();
		draw_label();
		draw_resize_handles();
	}

	function draw_bar() {
		self.$bar = gt.canvas.rect(self.x, self.y,
			self.width, self.height,
			self.corner_radius, self.corner_radius)
			.addClass('bar')
			.appendTo(self.bar_group);
		if (self.invalid) {
			self.$bar.addClass('bar-invalid');
		}
	}

	function draw_progress_bar() {
		if (self.invalid) return;
		self.$bar_progress = gt.canvas.rect(self.x, self.y,
			self.progress_width, self.height,
			self.corner_radius, self.corner_radius)
			.addClass('bar-progress')
			.appendTo(self.bar_group);
	}

	function draw_label() {
		gt.canvas.text(self.x + self.width / 2,
			self.y + self.height / 2,
			self.task.name)
			.addClass('bar-label')
			.appendTo(self.bar_group);
		update_label_position();
	}

	function draw_resize_handles() {
		if (self.invalid) return;

		const bar = self.$bar,
			handle_width = 8;

		gt.canvas.rect(bar.getX() + bar.getWidth() - 9, bar.getY() + 1,
			handle_width, self.height - 2, self.corner_radius, self.corner_radius)
			.addClass('handle right')
			.appendTo(self.handle_group);
		gt.canvas.rect(bar.getX() + 1, bar.getY() + 1,
			handle_width, self.height - 2, self.corner_radius, self.corner_radius)
			.addClass('handle left')
			.appendTo(self.handle_group);

		if (self.task.progress && self.task.progress < 100) {
			gt.canvas.polygon(get_progress_polygon_points())
				.addClass('handle progress')
				.appendTo(self.handle_group);
		}
	}

	function get_progress_polygon_points() {
		const bar_progress = self.$bar_progress;
		return [
			bar_progress.getEndX() - 5, bar_progress.getY() + bar_progress.getHeight(),
			bar_progress.getEndX() + 5, bar_progress.getY() + bar_progress.getHeight(),
			bar_progress.getEndX(), bar_progress.getY() + bar_progress.getHeight() - 8.66
		];
	}

	function bind() {
		if (self.invalid) return;
		setup_click_event();
		show_details();
		bind_resize();
		bind_drag();
		bind_resize_progress();
	}

	function show_details() {
		const popover_group = gt.element_groups.details;
		self.details_box = popover_group
			.select(`.details-wrapper[data-task='${self.task.id}']`);

		if (!self.details_box) {
			self.details_box = gt.canvas.group()
				.addClass('details-wrapper hide')
				.attr('data-task', self.task.id)
				.appendTo(popover_group);

			render_details();

			const f = gt.canvas.filter(
				Snap.filter.shadow(0, 1, 1, '#666', 0.6));
			self.details_box.attr({
				filter: f
			});
		}

		self.group.click((e) => {
			if (self.action_completed) {
				// just finished a move action, wait for a few seconds
				return;
			}
			popover_group.selectAll('.details-wrapper')
				.forEach(el => el.addClass('hide'));
			self.details_box.removeClass('hide');
		});
	}

	function render_details() {
		const {x, y} = get_details_position();
		self.details_box.transform(`t${x},${y}`);
		self.details_box.clear();

		const html = get_details_html();
		const foreign_object =
			Snap.parse(`<foreignObject width="5000" height="2000">
				<body xmlns="http://www.w3.org/1999/xhtml">
					${html}
				</body>
				</foreignObject>`);
		self.details_box.append(foreign_object);
	}

	function get_details_html() {

		// custom html in config
		if(gt.config.custom_popup_html) {
			const html = gt.config.custom_popup_html;
			if(typeof html === 'string') {
				return html;
			}
			if(isFunction(html)) {
				return html(task);
			}
		}

		const start_date = self.task._start.format('MMM D');
		const end_date = self.task._end.format('MMM D');
		const heading = `${self.task.name}: ${start_date} - ${end_date}`;

		const line_1 = `Duration: ${self.duration} days`;
		const line_2 = self.task.progress ? `Progress: ${self.task.progress}` : null;

		const html = `
			<div class="details-container">
				<h5>${heading}</h5>
				<p>${line_1}</p>
				${
					line_2 ? `<p>${line_2}</p>` : ''
				}
			</div>
		`;
		return html;
	}

	function get_details_position() {
		return {
			x: self.$bar.getEndX() + 2,
			y: self.$bar.getY() - 10
		};
	}

	function bind_resize() {
		const { left, right } = get_handles();

		left.drag(onmove_left, onstart, onstop_left);
		right.drag(onmove_right, onstart, onstop_right);

		function onmove_right(dx, dy) {
			onmove_handle_right(dx, dy);
		}
		function onstop_right() {
			onstop_handle_right();
		}

		function onmove_left(dx, dy) {
			onmove_handle_left(dx, dy);
		}
		function onstop_left() {
			onstop_handle_left();
		}
	}

	function get_handles() {
		return {
			left: self.handle_group.select('.handle.left'),
			right: self.handle_group.select('.handle.right')
		};
	}

	function bind_drag() {
		self.bar_group.drag(onmove, onstart, onstop);
	}

	function bind_resize_progress() {
		const bar = self.$bar,
			bar_progress = self.$bar_progress,
			handle = self.group.select('.handle.progress');
		handle && handle.drag(on_move, on_start, on_stop);

		function on_move(dx, dy) {
			if (dx > bar_progress.max_dx) {
				dx = bar_progress.max_dx;
			}
			if (dx < bar_progress.min_dx) {
				dx = bar_progress.min_dx;
			}

			bar_progress.attr('width', bar_progress.owidth + dx);
			handle.attr('points', get_progress_polygon_points());
			bar_progress.finaldx = dx;
		}
		function on_stop() {
			if (!bar_progress.finaldx) return;
			progress_changed();
			set_action_completed();
		}
		function on_start() {
			bar_progress.finaldx = 0;
			bar_progress.owidth = bar_progress.getWidth();
			bar_progress.min_dx = -bar_progress.getWidth();
			bar_progress.max_dx = bar.getWidth() - bar_progress.getWidth();
		}
	}

	function onstart() {
		const bar = self.$bar;
		bar.ox = bar.getX();
		bar.oy = bar.getY();
		bar.owidth = bar.getWidth();
		bar.finaldx = 0;
		run_method_for_dependencies('onstart');
	}
	self.onstart = onstart;

	function onmove(dx, dy) {
		const bar = self.$bar;
		bar.finaldx = get_snap_position(dx);
		update_bar_position({x: bar.ox + bar.finaldx});
		run_method_for_dependencies('onmove', [dx, dy]);
	}
	self.onmove = onmove;

	function onstop() {
		const bar = self.$bar;
		if (!bar.finaldx) return;
		date_changed();
		set_action_completed();
		run_method_for_dependencies('onstop');
	}
	self.onstop = onstop;

	function onmove_handle_left(dx, dy) {
		const bar = self.$bar;
		bar.finaldx = get_snap_position(dx);
		update_bar_position({
			x: bar.ox + bar.finaldx,
			width: bar.owidth - bar.finaldx
		});
		run_method_for_dependencies('onmove', [dx, dy]);
	}
	self.onmove_handle_left = onmove_handle_left;

	function onstop_handle_left() {
		const bar = self.$bar;
		if (bar.finaldx) date_changed();
		set_action_completed();
		run_method_for_dependencies('onstop');
	}
	self.onstop_handle_left = onstop_handle_left;

	function run_method_for_dependencies(fn, args) {
		const dm = gt.dependency_map;
		if (dm[self.task.id]) {
			for (let deptask of dm[self.task.id]) {
				const dt = gt.get_bar(deptask);
				dt[fn].apply(dt, args);
			}
		}
	}

	function onmove_handle_right(dx, dy) {
		const bar = self.$bar;
		bar.finaldx = get_snap_position(dx);
		update_bar_position({width: bar.owidth + bar.finaldx});
	}

	function onstop_handle_right() {
		const bar = self.$bar;
		if (bar.finaldx) date_changed();
		set_action_completed();
	}

	function update_bar_position({x = null, width = null}) {
		const bar = self.$bar;
		if (x) {
			// get all x values of parent task
			const xs = task.dependencies.map(dep => {
				return gt.get_bar(dep).$bar.getX();
			});
			// child task must not go before parent
			const valid_x = xs.reduce((prev, curr) => {
				return x >= curr;
			}, x);
			if(!valid_x) {
				width = null;
				return;
			}
			update_attr(bar, 'x', x);
		}
		if (width && width >= gt.config.column_width) {
			update_attr(bar, 'width', width);
		}
		update_label_position();
		update_handle_position();
		update_progressbar_position();
		update_arrow_position();
		update_details_position();
	}

	function setup_click_event() {
		self.group.click(function () {
			if (self.action_completed) {
				// just finished a move action, wait for a few seconds
				return;
			}
			if (self.group.hasClass('active')) {
				gt.trigger_event('click', [self.task]);
			}
			gt.unselect_all();
			self.group.toggleClass('active');
		});
	}

	function date_changed() {
		const { new_start_date, new_end_date } = compute_start_end_date();
		self.task._start = new_start_date;
		self.task._end = new_end_date;
		render_details();
		gt.trigger_event('date_change',
			[self.task, new_start_date, new_end_date]);
	}

	function progress_changed() {
		const new_progress = compute_progress();
		self.task.progress = new_progress;
		render_details();
		gt.trigger_event('progress_change',
			[self.task, new_progress]);
	}

	function set_action_completed() {
		self.action_completed = true;
		setTimeout(() => self.action_completed = false, 2000);
	}

	function compute_start_end_date() {
		const bar = self.$bar;
		const x_in_units = bar.getX() / gt.config.column_width;
		const new_start_date = gt.gantt_start.clone().add(x_in_units * gt.config.step, 'hours');
		const width_in_units = bar.getWidth() / gt.config.column_width;
		const new_end_date = new_start_date.clone().add(width_in_units * gt.config.step, 'hours');
		// lets say duration is 2 days
		// start_date = May 24 00:00:00
		// end_date = May 24 + 2 days = May 26 (incorrect)
		// so subtract 1 second so that
		// end_date = May 25 23:59:59
		new_end_date.add('-1', 'seconds');
		return { new_start_date, new_end_date };
	}

	function compute_progress() {
		const progress = self.$bar_progress.getWidth() / self.$bar.getWidth() * 100;
		return parseInt(progress, 10);
	}

	function compute_x() {
		let x = self.task._start.diff(gt.gantt_start, 'hours') /
			gt.config.step * gt.config.column_width;

		if (gt.view_is('Month')) {
			x = self.task._start.diff(gt.gantt_start, 'days') *
				gt.config.column_width / 30;
		}
		return x;
	}

	function compute_y() {
		return gt.config.header_height + gt.config.padding +
			self.task._index * (self.height + gt.config.padding);
	}

	function get_snap_position(dx) {
		let odx = dx, rem, position;

		if (gt.view_is('Week')) {
			rem = dx % (gt.config.column_width / 7);
			position = odx - rem +
				((rem < gt.config.column_width / 14) ? 0 : gt.config.column_width / 7);
		} else if (gt.view_is('Month')) {
			rem = dx % (gt.config.column_width / 30);
			position = odx - rem +
				((rem < gt.config.column_width / 60) ? 0 : gt.config.column_width / 30);
		} else {
			rem = dx % gt.config.column_width;
			position = odx - rem +
				((rem < gt.config.column_width / 2) ? 0 : gt.config.column_width);
		}
		return position;
	}

	function update_attr(element, attr, value) {
		value = +value;
		if (!isNaN(value)) {
			element.attr(attr, value);
		}
		return element;
	}

	function update_progressbar_position() {
		self.$bar_progress.attr('x', self.$bar.getX());
		self.$bar_progress.attr('width', self.$bar.getWidth() * (self.task.progress / 100));
	}

	function update_label_position() {
		const bar = self.$bar,
			label = self.group.select('.bar-label');
		if (label.getBBox().width > bar.getWidth()) {
			label.addClass('big').attr('x', bar.getX() + bar.getWidth() + 5);
		} else {
			label.removeClass('big').attr('x', bar.getX() + bar.getWidth() / 2);
		}
	}

	function update_handle_position() {
		const bar = self.$bar;
		self.handle_group.select('.handle.left').attr({
			'x': bar.getX() + 1
		});
		self.handle_group.select('.handle.right').attr({
			'x': bar.getEndX() - 9
		});
		const handle = self.group.select('.handle.progress');
		handle && handle.attr('points', get_progress_polygon_points());
	}

	function update_arrow_position() {
		for (let arrow of self.arrows) {
			arrow.update();
		}
	}

	function update_details_position() {
		const {x, y} = get_details_position();
		self.details_box && self.details_box.transform(`t${x},${y}`);
	}

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	init();

	return self;
}
