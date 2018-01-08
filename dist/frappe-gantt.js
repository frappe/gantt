(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Gantt", [], factory);
	else if(typeof exports === 'object')
		exports["Gantt"] = factory();
	else
		root["Gantt"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Gantt;
	
	__webpack_require__(1);
	
	var _Bar = __webpack_require__(5);
	
	var _Bar2 = _interopRequireDefault(_Bar);
	
	var _Arrow = __webpack_require__(6);
	
	var _Arrow2 = _interopRequireDefault(_Arrow);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function Gantt(element, tasks) {
		var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
	
	
		var self = {};
	
		function init() {
			set_defaults();
	
			// expose methods
			self.change_view_mode = change_view_mode;
			self.unselect_all = unselect_all;
			self.view_is = view_is;
			self.get_bar = get_bar;
			self.trigger_event = trigger_event;
			self.refresh = refresh;
	
			// initialize with default view mode
			change_view_mode(self.config.view_mode);
		}
	
		function set_defaults() {
	
			var merge = __webpack_require__(7);
	
			var defaults = {
				header_height: 50,
				column_width: 30,
				step: 24,
				view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
				bar: {
					height: 20,
					corner_radius: 3
				},
				arrow: {
					curve: 5
				},
				padding: 18,
				view_mode: 'Day',
				date_format: 'YYYY-MM-DD',
				custom_popup_html: null
			};
			self.config = merge(defaults, config);
	
			reset_variables(tasks);
		}
	
		function reset_variables(tasks) {
			if (typeof element === 'string') {
				self.element = document.querySelector(element);
			} else if (element instanceof SVGElement) {
				self.element = element;
			} else if (element instanceof HTMLElement) {
				self.element = element.querySelector('svg');
			} else {
				throw new TypeError('Frappé Gantt only supports usage of a string CSS selector,' + ' HTML DOM element or SVG DOM element for the \'element\' parameter');
			}
	
			self._tasks = tasks;
	
			self._bars = [];
			self._arrows = [];
			self.element_groups = {};
		}
	
		function refresh(updated_tasks) {
			reset_variables(updated_tasks);
			change_view_mode(self.config.view_mode);
		}
	
		function change_view_mode(mode) {
			set_scale(mode);
			prepare();
			render();
			// fire viewmode_change event
			trigger_event('view_change', [mode]);
		}
	
		function prepare() {
			prepare_tasks();
			prepare_dependencies();
			prepare_dates();
			prepare_canvas();
		}
	
		function prepare_tasks() {
	
			// prepare tasks
			self.tasks = self._tasks.map(function (task, i) {
	
				// momentify
				task._start = moment(task.start, self.config.date_format);
				task._end = moment(task.end, self.config.date_format);
	
				// make task invalid if duration too large
				if (task._end.diff(task._start, 'years') > 10) {
					task.end = null;
				}
	
				// cache index
				task._index = i;
	
				// invalid dates
				if (!task.start && !task.end) {
					task._start = moment().startOf('day');
					task._end = moment().startOf('day').add(2, 'days');
				}
				if (!task.start && task.end) {
					task._start = task._end.clone().add(-2, 'days');
				}
				if (task.start && !task.end) {
					task._end = task._start.clone().add(2, 'days');
				}
	
				// invalid flag
				if (!task.start || !task.end) {
					task.invalid = true;
				}
	
				// dependencies
				if (typeof task.dependencies === 'string' || !task.dependencies) {
					var deps = [];
					if (task.dependencies) {
						deps = task.dependencies.split(',').map(function (d) {
							return d.trim();
						}).filter(function (d) {
							return d;
						});
					}
					task.dependencies = deps;
				}
	
				// uids
				if (!task.id) {
					task.id = generate_id(task);
				}
	
				return task;
			});
		}
	
		function prepare_dependencies() {
	
			self.dependency_map = {};
			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;
	
			try {
				for (var _iterator = self.tasks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var t = _step.value;
					var _iteratorNormalCompletion2 = true;
					var _didIteratorError2 = false;
					var _iteratorError2 = undefined;
	
					try {
						for (var _iterator2 = t.dependencies[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
							var d = _step2.value;
	
							self.dependency_map[d] = self.dependency_map[d] || [];
							self.dependency_map[d].push(t.id);
						}
					} catch (err) {
						_didIteratorError2 = true;
						_iteratorError2 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion2 && _iterator2.return) {
								_iterator2.return();
							}
						} finally {
							if (_didIteratorError2) {
								throw _iteratorError2;
							}
						}
					}
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		}
	
		function prepare_dates() {
	
			self.gantt_start = self.gantt_end = null;
			var _iteratorNormalCompletion3 = true;
			var _didIteratorError3 = false;
			var _iteratorError3 = undefined;
	
			try {
				for (var _iterator3 = self.tasks[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
					var task = _step3.value;
	
					// set global start and end date
					if (!self.gantt_start || task._start < self.gantt_start) {
						self.gantt_start = task._start;
					}
					if (!self.gantt_end || task._end > self.gantt_end) {
						self.gantt_end = task._end;
					}
				}
			} catch (err) {
				_didIteratorError3 = true;
				_iteratorError3 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion3 && _iterator3.return) {
						_iterator3.return();
					}
				} finally {
					if (_didIteratorError3) {
						throw _iteratorError3;
					}
				}
			}
	
			set_gantt_dates();
			setup_dates();
		}
	
		function prepare_canvas() {
			if (self.canvas) return;
			self.canvas = Snap(self.element).addClass('gantt');
		}
	
		function render() {
			clear();
			setup_groups();
			make_grid();
			make_dates();
			make_bars();
			make_arrows();
			map_arrows_on_bars();
			set_width();
			set_scroll_position();
			bind_grid_click();
		}
	
		function clear() {
			self.canvas.clear();
			self._bars = [];
			self._arrows = [];
		}
	
		function set_gantt_dates() {
	
			if (view_is(['Quarter Day', 'Half Day'])) {
				self.gantt_start = self.gantt_start.clone().subtract(7, 'day');
				self.gantt_end = self.gantt_end.clone().add(7, 'day');
			} else if (view_is('Month')) {
				self.gantt_start = self.gantt_start.clone().startOf('year');
				self.gantt_end = self.gantt_end.clone().endOf('month').add(1, 'year');
			} else {
				self.gantt_start = self.gantt_start.clone().startOf('month').subtract(1, 'month');
				self.gantt_end = self.gantt_end.clone().endOf('month').add(1, 'month');
			}
		}
	
		function setup_dates() {
	
			self.dates = [];
			var cur_date = null;
	
			while (cur_date === null || cur_date < self.gantt_end) {
				if (!cur_date) {
					cur_date = self.gantt_start.clone();
				} else {
					cur_date = view_is('Month') ? cur_date.clone().add(1, 'month') : cur_date.clone().add(self.config.step, 'hours');
				}
				self.dates.push(cur_date);
			}
		}
	
		function setup_groups() {
	
			var groups = ['grid', 'date', 'arrow', 'progress', 'bar', 'details'];
			// make group layers
			var _iteratorNormalCompletion4 = true;
			var _didIteratorError4 = false;
			var _iteratorError4 = undefined;
	
			try {
				for (var _iterator4 = groups[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
					var group = _step4.value;
	
					self.element_groups[group] = self.canvas.group().attr({ 'id': group });
				}
			} catch (err) {
				_didIteratorError4 = true;
				_iteratorError4 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion4 && _iterator4.return) {
						_iterator4.return();
					}
				} finally {
					if (_didIteratorError4) {
						throw _iteratorError4;
					}
				}
			}
		}
	
		function set_scale(scale) {
			self.config.view_mode = scale;
	
			if (scale === 'Day') {
				self.config.step = 24;
				self.config.column_width = 38;
			} else if (scale === 'Half Day') {
				self.config.step = 24 / 2;
				self.config.column_width = 38;
			} else if (scale === 'Quarter Day') {
				self.config.step = 24 / 4;
				self.config.column_width = 38;
			} else if (scale === 'Week') {
				self.config.step = 24 * 7;
				self.config.column_width = 140;
			} else if (scale === 'Month') {
				self.config.step = 24 * 30;
				self.config.column_width = 120;
			}
		}
	
		function set_width() {
			var cur_width = self.canvas.node.getBoundingClientRect().width;
			var actual_width = self.canvas.select('#grid .grid-row').attr('width');
			if (cur_width < actual_width) {
				self.canvas.attr('width', actual_width);
			}
		}
	
		function set_scroll_position() {
			var parent_element = self.element.parentElement;
	
			if (!parent_element) return;
	
			var scroll_pos = get_min_date().diff(self.gantt_start, 'hours') / self.config.step * self.config.column_width - self.config.column_width;
			parent_element.scrollLeft = scroll_pos;
		}
	
		function get_min_date() {
			var task = self.tasks.reduce(function (acc, curr) {
				return curr._start.isSameOrBefore(acc._start) ? curr : acc;
			});
			return task._start;
		}
	
		function make_grid() {
			make_grid_background();
			make_grid_rows();
			make_grid_header();
			make_grid_ticks();
			make_grid_highlights();
		}
	
		function make_grid_background() {
	
			var grid_width = self.dates.length * self.config.column_width,
			    grid_height = self.config.header_height + self.config.padding + (self.config.bar.height + self.config.padding) * self.tasks.length;
	
			self.canvas.rect(0, 0, grid_width, grid_height).addClass('grid-background').appendTo(self.element_groups.grid);
	
			self.canvas.attr({
				height: grid_height + self.config.padding + 100,
				width: '100%'
			});
		}
	
		function make_grid_header() {
			var header_width = self.dates.length * self.config.column_width,
			    header_height = self.config.header_height + 10;
			self.canvas.rect(0, 0, header_width, header_height).addClass('grid-header').appendTo(self.element_groups.grid);
		}
	
		function make_grid_rows() {
	
			var rows = self.canvas.group().appendTo(self.element_groups.grid),
			    lines = self.canvas.group().appendTo(self.element_groups.grid),
			    row_width = self.dates.length * self.config.column_width,
			    row_height = self.config.bar.height + self.config.padding;
	
			var row_y = self.config.header_height + self.config.padding / 2;
	
			var _iteratorNormalCompletion5 = true;
			var _didIteratorError5 = false;
			var _iteratorError5 = undefined;
	
			try {
				for (var _iterator5 = self.tasks[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
					var task = _step5.value;
					// eslint-disable-line
					self.canvas.rect(0, row_y, row_width, row_height).addClass('grid-row').appendTo(rows);
	
					self.canvas.line(0, row_y + row_height, row_width, row_y + row_height).addClass('row-line').appendTo(lines);
	
					row_y += self.config.bar.height + self.config.padding;
				}
			} catch (err) {
				_didIteratorError5 = true;
				_iteratorError5 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion5 && _iterator5.return) {
						_iterator5.return();
					}
				} finally {
					if (_didIteratorError5) {
						throw _iteratorError5;
					}
				}
			}
		}
	
		function make_grid_ticks() {
			var tick_x = 0,
			    tick_y = self.config.header_height + self.config.padding / 2,
			    tick_height = (self.config.bar.height + self.config.padding) * self.tasks.length;
	
			var _iteratorNormalCompletion6 = true;
			var _didIteratorError6 = false;
			var _iteratorError6 = undefined;
	
			try {
				for (var _iterator6 = self.dates[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
					var date = _step6.value;
	
					var tick_class = 'tick';
					// thick tick for monday
					if (view_is('Day') && date.day() === 1) {
						tick_class += ' thick';
					}
					// thick tick for first week
					if (view_is('Week') && date.date() >= 1 && date.date() < 8) {
						tick_class += ' thick';
					}
					// thick ticks for quarters
					if (view_is('Month') && date.month() % 3 === 0) {
						tick_class += ' thick';
					}
	
					self.canvas.path(Snap.format('M {x} {y} v {height}', {
						x: tick_x,
						y: tick_y,
						height: tick_height
					})).addClass(tick_class).appendTo(self.element_groups.grid);
	
					if (view_is('Month')) {
						tick_x += date.daysInMonth() * self.config.column_width / 30;
					} else {
						tick_x += self.config.column_width;
					}
				}
			} catch (err) {
				_didIteratorError6 = true;
				_iteratorError6 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion6 && _iterator6.return) {
						_iterator6.return();
					}
				} finally {
					if (_didIteratorError6) {
						throw _iteratorError6;
					}
				}
			}
		}
	
		function make_grid_highlights() {
	
			// highlight today's date
			if (view_is('Day')) {
				var x = moment().startOf('day').diff(self.gantt_start, 'hours') / self.config.step * self.config.column_width;
				var y = 0;
				var width = self.config.column_width;
				var height = (self.config.bar.height + self.config.padding) * self.tasks.length + self.config.header_height + self.config.padding / 2;
	
				self.canvas.rect(x, y, width, height).addClass('today-highlight').appendTo(self.element_groups.grid);
			}
		}
	
		function make_dates() {
			var _iteratorNormalCompletion7 = true;
			var _didIteratorError7 = false;
			var _iteratorError7 = undefined;
	
			try {
	
				for (var _iterator7 = get_dates_to_draw()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
					var date = _step7.value;
	
					self.canvas.text(date.lower_x, date.lower_y, date.lower_text).addClass('lower-text').appendTo(self.element_groups.date);
	
					if (date.upper_text) {
						var $upper_text = self.canvas.text(date.upper_x, date.upper_y, date.upper_text).addClass('upper-text').appendTo(self.element_groups.date);
	
						// remove out-of-bound dates
						if ($upper_text.getBBox().x2 > self.element_groups.grid.getBBox().width) {
							$upper_text.remove();
						}
					}
				}
			} catch (err) {
				_didIteratorError7 = true;
				_iteratorError7 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion7 && _iterator7.return) {
						_iterator7.return();
					}
				} finally {
					if (_didIteratorError7) {
						throw _iteratorError7;
					}
				}
			}
		}
	
		function get_dates_to_draw() {
			var last_date = null;
			var dates = self.dates.map(function (date, i) {
				var d = get_date_info(date, last_date, i);
				last_date = date;
				return d;
			});
			return dates;
		}
	
		function get_date_info(date, last_date, i) {
			if (!last_date) {
				last_date = date.clone().add(1, 'year');
			}
			var date_text = {
				'Quarter Day_lower': date.format('HH'),
				'Half Day_lower': date.format('HH'),
				'Day_lower': date.date() !== last_date.date() ? date.format('D') : '',
				'Week_lower': date.month() !== last_date.month() ? date.format('D MMM') : date.format('D'),
				'Month_lower': date.format('MMMM'),
				'Quarter Day_upper': date.date() !== last_date.date() ? date.format('D MMM') : '',
				'Half Day_upper': date.date() !== last_date.date() ? date.month() !== last_date.month() ? date.format('D MMM') : date.format('D') : '',
				'Day_upper': date.month() !== last_date.month() ? date.format('MMMM') : '',
				'Week_upper': date.month() !== last_date.month() ? date.format('MMMM') : '',
				'Month_upper': date.year() !== last_date.year() ? date.format('YYYY') : ''
			};
	
			var base_pos = {
				x: i * self.config.column_width,
				lower_y: self.config.header_height,
				upper_y: self.config.header_height - 25
			};
	
			var x_pos = {
				'Quarter Day_lower': self.config.column_width * 4 / 2,
				'Quarter Day_upper': 0,
				'Half Day_lower': self.config.column_width * 2 / 2,
				'Half Day_upper': 0,
				'Day_lower': self.config.column_width / 2,
				'Day_upper': self.config.column_width * 30 / 2,
				'Week_lower': 0,
				'Week_upper': self.config.column_width * 4 / 2,
				'Month_lower': self.config.column_width / 2,
				'Month_upper': self.config.column_width * 12 / 2
			};
	
			return {
				upper_text: date_text[self.config.view_mode + '_upper'],
				lower_text: date_text[self.config.view_mode + '_lower'],
				upper_x: base_pos.x + x_pos[self.config.view_mode + '_upper'],
				upper_y: base_pos.upper_y,
				lower_x: base_pos.x + x_pos[self.config.view_mode + '_lower'],
				lower_y: base_pos.lower_y
			};
		}
	
		function make_arrows() {
			self._arrows = [];
			var _iteratorNormalCompletion8 = true;
			var _didIteratorError8 = false;
			var _iteratorError8 = undefined;
	
			try {
				var _loop = function _loop() {
					var task = _step8.value;
	
					var arrows = [];
					arrows = task.dependencies.map(function (dep) {
						var dependency = get_task(dep);
						if (!dependency) return;
	
						var arrow = (0, _Arrow2.default)(self, // gt
						self._bars[dependency._index], // from_task
						self._bars[task._index] // to_task
						);
						self.element_groups.arrow.add(arrow.element);
						return arrow; // eslint-disable-line
					}).filter(function (arr) {
						return arr;
					}); // filter falsy values
					self._arrows = self._arrows.concat(arrows);
				};
	
				for (var _iterator8 = self.tasks[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
					_loop();
				}
			} catch (err) {
				_didIteratorError8 = true;
				_iteratorError8 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion8 && _iterator8.return) {
						_iterator8.return();
					}
				} finally {
					if (_didIteratorError8) {
						throw _iteratorError8;
					}
				}
			}
		}
	
		function make_bars() {
	
			self._bars = self.tasks.map(function (task) {
				var bar = (0, _Bar2.default)(self, task);
				self.element_groups.bar.add(bar.group);
				return bar;
			});
		}
	
		function map_arrows_on_bars() {
			var _iteratorNormalCompletion9 = true;
			var _didIteratorError9 = false;
			var _iteratorError9 = undefined;
	
			try {
				var _loop2 = function _loop2() {
					var bar = _step9.value;
	
					bar.arrows = self._arrows.filter(function (arrow) {
						return arrow.from_task.task.id === bar.task.id || arrow.to_task.task.id === bar.task.id;
					});
				};
	
				for (var _iterator9 = self._bars[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
					_loop2();
				}
			} catch (err) {
				_didIteratorError9 = true;
				_iteratorError9 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion9 && _iterator9.return) {
						_iterator9.return();
					}
				} finally {
					if (_didIteratorError9) {
						throw _iteratorError9;
					}
				}
			}
		}
	
		function bind_grid_click() {
			self.element_groups.grid.click(function () {
				unselect_all();
				self.element_groups.details.selectAll('.details-wrapper').forEach(function (el) {
					return el.addClass('hide');
				});
			});
		}
	
		function unselect_all() {
			self.canvas.selectAll('.bar-wrapper').forEach(function (el) {
				el.removeClass('active');
			});
		}
	
		function view_is(modes) {
			if (typeof modes === 'string') {
				return self.config.view_mode === modes;
			} else if (Array.isArray(modes)) {
				var _iteratorNormalCompletion10 = true;
				var _didIteratorError10 = false;
				var _iteratorError10 = undefined;
	
				try {
					for (var _iterator10 = modes[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
						var mode = _step10.value;
	
						if (self.config.view_mode === mode) return true;
					}
				} catch (err) {
					_didIteratorError10 = true;
					_iteratorError10 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion10 && _iterator10.return) {
							_iterator10.return();
						}
					} finally {
						if (_didIteratorError10) {
							throw _iteratorError10;
						}
					}
				}
	
				return false;
			}
		}
	
		function get_task(id) {
			return self.tasks.find(function (task) {
				return task.id === id;
			});
		}
	
		function get_bar(id) {
			return self._bars.find(function (bar) {
				return bar.task.id === id;
			});
		}
	
		function generate_id(task) {
			return task.name + '_' + Math.random().toString(36).slice(2, 12);
		}
	
		function trigger_event(event, args) {
			if (self.config['on_' + event]) {
				self.config['on_' + event].apply(null, args);
			}
		}
	
		init();
	
		return self;
	} /* global moment, Snap */
	/**
	 * Gantt:
	 * 	element: querySelector string, HTML DOM or SVG DOM element, required
	 * 	tasks: array of tasks, required
	 *   task: { id, name, start, end, progress, dependencies, custom_class }
	 * 	config: configuration options, optional
	 */
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/sass-loader/index.js?sourceMap!./gantt.scss", function() {
				var newContent = require("!!../node_modules/css-loader/index.js?sourceMap!../node_modules/sass-loader/index.js?sourceMap!./gantt.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports
	
	
	// module
	exports.push([module.id, ".gantt .grid-background {\n  fill: none; }\n\n.gantt .grid-header {\n  fill: #ffffff;\n  stroke: #e0e0e0;\n  stroke-width: 1.4; }\n\n.gantt .grid-row {\n  fill: #ffffff; }\n\n.gantt .grid-row:nth-child(even) {\n  fill: #f5f5f5; }\n\n.gantt .row-line {\n  stroke: #ebeff2; }\n\n.gantt .tick {\n  stroke: #e0e0e0;\n  stroke-width: 0.2; }\n  .gantt .tick.thick {\n    stroke-width: 0.4; }\n\n.gantt .today-highlight {\n  fill: #fcf8e3;\n  opacity: 0.5; }\n\n.gantt #arrow {\n  fill: none;\n  stroke: #666;\n  stroke-width: 1.4; }\n\n.gantt .bar {\n  fill: #b8c2cc;\n  stroke: #8D99A6;\n  stroke-width: 0;\n  transition: stroke-width .3s ease; }\n\n.gantt .bar-progress {\n  fill: #a3a3ff; }\n\n.gantt .bar-invalid {\n  fill: transparent;\n  stroke: #8D99A6;\n  stroke-width: 1;\n  stroke-dasharray: 5; }\n  .gantt .bar-invalid ~ .bar-label {\n    fill: #555; }\n\n.gantt .bar-label {\n  fill: #fff;\n  dominant-baseline: central;\n  text-anchor: middle;\n  font-size: 12px;\n  font-weight: lighter; }\n  .gantt .bar-label.big {\n    fill: #555;\n    text-anchor: start; }\n\n.gantt .handle {\n  fill: #ddd;\n  cursor: ew-resize;\n  opacity: 0;\n  visibility: hidden;\n  transition: opacity .3s ease; }\n\n.gantt .bar-wrapper {\n  cursor: pointer; }\n  .gantt .bar-wrapper:hover .bar {\n    stroke-width: 2; }\n  .gantt .bar-wrapper:hover .handle {\n    visibility: visible;\n    opacity: 1; }\n  .gantt .bar-wrapper.active .bar {\n    stroke-width: 2; }\n\n.gantt .lower-text, .gantt .upper-text {\n  font-size: 12px;\n  text-anchor: middle; }\n\n.gantt .upper-text {\n  fill: #555; }\n\n.gantt .lower-text {\n  fill: #333; }\n\n.gantt #details .details-container {\n  background: #fff;\n  display: inline-block;\n  padding: 12px; }\n  .gantt #details .details-container h5, .gantt #details .details-container p {\n    margin: 0; }\n  .gantt #details .details-container h5 {\n    font-size: 12px;\n    font-weight: bold;\n    margin-bottom: 10px;\n    color: #555; }\n  .gantt #details .details-container p {\n    font-size: 12px;\n    margin-bottom: 6px;\n    color: #666; }\n  .gantt #details .details-container p:last-child {\n    margin-bottom: 0; }\n\n.gantt .hide {\n  display: none; }\n", "", {"version":3,"sources":["/Users/kas/Dropbox/gantt/src/src/gantt.scss"],"names":[],"mappings":"AAYA;EAGE,WAAU,EACV;;AAJF;EAME,cAAa;EACb,gBAjBoB;EAkBpB,kBAAiB,EACjB;;AATF;EAWE,cAAa,EACb;;AAZF;EAcE,cAvBgB,EAwBhB;;AAfF;EAiBE,gBAzB0B,EA0B1B;;AAlBF;EAoBE,gBA9BoB;EA+BpB,kBAAiB,EAIjB;EAzBF;IAuBG,kBAAiB,EACjB;;AAxBH;EA2BE,cAlCoB;EAmCpB,aAAY,EACZ;;AA7BF;EAgCE,WAAU;EACV,aAvCe;EAwCf,kBAAiB,EACjB;;AAnCF;EAsCE,cAlDiB;EAmDjB,gBAlDkB;EAmDlB,gBAAe;EACf,kCAAiC,EACjC;;AA1CF;EA4CE,cA/CY,EAgDZ;;AA7CF;EA+CE,kBAAiB;EACjB,gBA3DkB;EA4DlB,gBAAe;EACf,oBAAmB,EAKnB;EAvDF;IAqDG,WA1Dc,EA2Dd;;AAtDH;EAyDE,WAAU;EACV,2BAA0B;EAC1B,oBAAmB;EACnB,gBAAe;EACf,qBAAoB,EAMpB;EAnEF;IAgEG,WArEc;IAsEd,mBAAkB,EAClB;;AAlEH;EAsEE,WAxEiB;EAyEjB,kBAAiB;EACjB,WAAU;EACV,mBAAkB;EAClB,6BAA4B,EAC5B;;AA3EF;EA8EE,gBAAe,EAkBf;EAhGF;IAkFI,gBAAe,EACf;EAnFJ;IAsFI,oBAAmB;IACnB,WAAU,EACV;EAxFJ;IA6FI,gBAAe,EACf;;AA9FJ;EAmGE,gBAAe;EACf,oBAAmB,EACnB;;AArGF;EAuGE,WA5Ge,EA6Gf;;AAxGF;EA0GE,WA9Ge,EA+Gf;;AA3GF;EA8GE,iBAAgB;EAChB,sBAAqB;EACrB,cAAa,EAsBb;EAtIF;IAmHG,UAAS,EACT;EApHH;IAuHG,gBAAe;IACf,kBAAiB;IACjB,oBAAmB;IACnB,YA/Hc,EAgId;EA3HH;IA8HG,gBAAe;IACf,mBAAkB;IAClB,YAtIc,EAuId;EAjIH;IAoIG,iBAAgB,EAChB;;AArIH;EAyIE,cAAa,EACb","file":"gantt.scss","sourcesContent":["$bar-color: #b8c2cc;\n$bar-stroke: #8D99A6;\n$border-color: #e0e0e0;\n$light-bg: #f5f5f5;\n$light-border-color: #ebeff2;\n$light-yellow: #fcf8e3;\n$text-muted: #666;\n$text-light: #555;\n$text-color: #333;\n$blue: #a3a3ff;\n$handle-color: #ddd;\n\n.gantt {\n\n\t.grid-background {\n\t\tfill: none;\n\t}\n\t.grid-header {\n\t\tfill: #ffffff;\n\t\tstroke: $border-color;\n\t\tstroke-width: 1.4;\n\t}\n\t.grid-row {\n\t\tfill: #ffffff;\n\t}\n\t.grid-row:nth-child(even) {\n\t\tfill: $light-bg;\n\t}\n\t.row-line {\n\t\tstroke: $light-border-color;\n\t}\n\t.tick {\n\t\tstroke: $border-color;\n\t\tstroke-width: 0.2;\n\t\t&.thick {\n\t\t\tstroke-width: 0.4;\n\t\t}\n\t}\n\t.today-highlight {\n\t\tfill: $light-yellow;\n\t\topacity: 0.5;\n\t}\n\n\t#arrow {\n\t\tfill: none;\n\t\tstroke: $text-muted;\n\t\tstroke-width: 1.4;\n\t}\n\n\t.bar {\n\t\tfill: $bar-color;\n\t\tstroke: $bar-stroke;\n\t\tstroke-width: 0;\n\t\ttransition: stroke-width .3s ease;\n\t}\n\t.bar-progress {\n\t\tfill: $blue;\n\t}\n\t.bar-invalid {\n\t\tfill: transparent;\n\t\tstroke: $bar-stroke;\n\t\tstroke-width: 1;\n\t\tstroke-dasharray: 5;\n\n\t\t&~.bar-label {\n\t\t\tfill: $text-light;\n\t\t}\n\t}\n\t.bar-label {\n\t\tfill: #fff;\n\t\tdominant-baseline: central;\n\t\ttext-anchor: middle;\n\t\tfont-size: 12px;\n\t\tfont-weight: lighter;\n\n\t\t&.big {\n\t\t\tfill: $text-light;\n\t\t\ttext-anchor: start;\n\t\t}\n\t}\n\n\t.handle {\n\t\tfill: $handle-color;\n\t\tcursor: ew-resize;\n\t\topacity: 0;\n\t\tvisibility: hidden;\n\t\ttransition: opacity .3s ease;\n\t}\n\n\t.bar-wrapper {\n\t\tcursor: pointer;\n\n\t\t&:hover {\n\t\t\t.bar {\n\t\t\t\tstroke-width: 2;\n\t\t\t}\n\n\t\t\t.handle {\n\t\t\t\tvisibility: visible;\n\t\t\t\topacity: 1;\n\t\t\t}\n\t\t}\n\n\t\t&.active {\n\t\t\t.bar {\n\t\t\t\tstroke-width: 2;\n\t\t\t}\n\t\t}\n\t}\n\n\t.lower-text, .upper-text {\n\t\tfont-size: 12px;\n\t\ttext-anchor: middle;\n\t}\n\t.upper-text {\n\t\tfill: $text-light;\n\t}\n\t.lower-text {\n\t\tfill: $text-color;\n\t}\n\n\t#details .details-container {\n\t\tbackground: #fff;\n\t\tdisplay: inline-block;\n\t\tpadding: 12px;\n\n\t\th5, p {\n\t\t\tmargin: 0;\n\t\t}\n\n\t\th5 {\n\t\t\tfont-size: 12px;\n\t\t\tfont-weight: bold;\n\t\t\tmargin-bottom: 10px;\n\t\t\tcolor: $text-light;\n\t\t}\n\n\t\tp {\n\t\t\tfont-size: 12px;\n\t\t\tmargin-bottom: 6px;\n\t\t\tcolor: $text-muted;\n\t\t}\n\n\t\tp:last-child {\n\t\t\tmargin-bottom: 0;\n\t\t}\n\t}\n\n\t.hide {\n\t\tdisplay: none;\n\t}\n}\n"],"sourceRoot":""}]);
	
	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Bar;
	/* global Snap */
	/*
		Class: Bar
	
		Opts:
			gt: Gantt object
			task: task object
	*/
	
	function Bar(gt, task) {
	
		var self = {};
	
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
			self.corner_radius = gt.config.bar.corner_radius;
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
			self.$bar = gt.canvas.rect(self.x, self.y, self.width, self.height, self.corner_radius, self.corner_radius).addClass('bar').appendTo(self.bar_group);
			if (self.invalid) {
				self.$bar.addClass('bar-invalid');
			}
		}
	
		function draw_progress_bar() {
			if (self.invalid) return;
			self.$bar_progress = gt.canvas.rect(self.x, self.y, self.progress_width, self.height, self.corner_radius, self.corner_radius).addClass('bar-progress').appendTo(self.bar_group);
		}
	
		function draw_label() {
			gt.canvas.text(self.x + self.width / 2, self.y + self.height / 2, self.task.name).addClass('bar-label').appendTo(self.bar_group);
			update_label_position();
		}
	
		function draw_resize_handles() {
			if (self.invalid) return;
	
			var bar = self.$bar,
			    handle_width = 8;
	
			gt.canvas.rect(bar.getX() + bar.getWidth() - 9, bar.getY() + 1, handle_width, self.height - 2, self.corner_radius, self.corner_radius).addClass('handle right').appendTo(self.handle_group);
			gt.canvas.rect(bar.getX() + 1, bar.getY() + 1, handle_width, self.height - 2, self.corner_radius, self.corner_radius).addClass('handle left').appendTo(self.handle_group);
	
			if (self.task.progress && self.task.progress < 100) {
				gt.canvas.polygon(get_progress_polygon_points()).addClass('handle progress').appendTo(self.handle_group);
			}
		}
	
		function get_progress_polygon_points() {
			var bar_progress = self.$bar_progress;
			return [bar_progress.getEndX() - 5, bar_progress.getY() + bar_progress.getHeight(), bar_progress.getEndX() + 5, bar_progress.getY() + bar_progress.getHeight(), bar_progress.getEndX(), bar_progress.getY() + bar_progress.getHeight() - 8.66];
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
			var popover_group = gt.element_groups.details;
			self.details_box = popover_group.select('.details-wrapper[data-task=\'' + self.task.id + '\']');
	
			if (!self.details_box) {
				self.details_box = gt.canvas.group().addClass('details-wrapper hide').attr('data-task', self.task.id).appendTo(popover_group);
	
				render_details();
	
				var f = gt.canvas.filter(Snap.filter.shadow(0, 1, 1, '#666', 0.6));
				self.details_box.attr({
					filter: f
				});
			}
	
			self.group.click(function (e) {
				if (self.action_completed) {
					// just finished a move action, wait for a few seconds
					return;
				}
				popover_group.selectAll('.details-wrapper').forEach(function (el) {
					return el.addClass('hide');
				});
				self.details_box.removeClass('hide');
			});
		}
	
		function render_details() {
			var _get_details_position = get_details_position(),
			    x = _get_details_position.x,
			    y = _get_details_position.y;
	
			self.details_box.transform('t' + x + ',' + y);
			self.details_box.clear();
	
			var html = get_details_html();
			var foreign_object = Snap.parse('<foreignObject width="5000" height="2000">\n\t\t\t\t<body xmlns="http://www.w3.org/1999/xhtml">\n\t\t\t\t\t' + html + '\n\t\t\t\t</body>\n\t\t\t\t</foreignObject>');
			self.details_box.append(foreign_object);
		}
	
		function get_details_html() {
	
			// custom html in config
			if (gt.config.custom_popup_html) {
				var _html = gt.config.custom_popup_html;
				if (typeof _html === 'string') {
					return _html;
				}
				if (isFunction(_html)) {
					return _html(task);
				}
			}
	
			var start_date = self.task._start.format('MMM D');
			var end_date = self.task._end.format('MMM D');
			var heading = self.task.name + ': ' + start_date + ' - ' + end_date;
	
			var line_1 = 'Duration: ' + self.duration + ' days';
			var line_2 = self.task.progress ? 'Progress: ' + self.task.progress : null;
	
			var html = '\n\t\t\t<div class="details-container">\n\t\t\t\t<h5>' + heading + '</h5>\n\t\t\t\t<p>' + line_1 + '</p>\n\t\t\t\t' + (line_2 ? '<p>' + line_2 + '</p>' : '') + '\n\t\t\t</div>\n\t\t';
			return html;
		}
	
		function get_details_position() {
			return {
				x: self.$bar.getEndX() + 2,
				y: self.$bar.getY() - 10
			};
		}
	
		function bind_resize() {
			var _get_handles = get_handles(),
			    left = _get_handles.left,
			    right = _get_handles.right;
	
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
			var bar = self.$bar,
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
			var bar = self.$bar;
			bar.ox = bar.getX();
			bar.oy = bar.getY();
			bar.owidth = bar.getWidth();
			bar.finaldx = 0;
			run_method_for_dependencies('onstart');
		}
		self.onstart = onstart;
	
		function onmove(dx, dy) {
			var bar = self.$bar;
			bar.finaldx = get_snap_position(dx);
			update_bar_position({ x: bar.ox + bar.finaldx });
			run_method_for_dependencies('onmove', [dx, dy]);
		}
		self.onmove = onmove;
	
		function onstop() {
			var bar = self.$bar;
			if (!bar.finaldx) return;
			date_changed();
			set_action_completed();
			run_method_for_dependencies('onstop');
		}
		self.onstop = onstop;
	
		function onmove_handle_left(dx, dy) {
			var bar = self.$bar;
			bar.finaldx = get_snap_position(dx);
			update_bar_position({
				x: bar.ox + bar.finaldx,
				width: bar.owidth - bar.finaldx
			});
			run_method_for_dependencies('onmove', [dx, dy]);
		}
		self.onmove_handle_left = onmove_handle_left;
	
		function onstop_handle_left() {
			var bar = self.$bar;
			if (bar.finaldx) date_changed();
			set_action_completed();
			run_method_for_dependencies('onstop');
		}
		self.onstop_handle_left = onstop_handle_left;
	
		function run_method_for_dependencies(fn, args) {
			var dm = gt.dependency_map;
			if (dm[self.task.id]) {
				var _iteratorNormalCompletion = true;
				var _didIteratorError = false;
				var _iteratorError = undefined;
	
				try {
					for (var _iterator = dm[self.task.id][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
						var deptask = _step.value;
	
						var dt = gt.get_bar(deptask);
						dt[fn].apply(dt, args);
					}
				} catch (err) {
					_didIteratorError = true;
					_iteratorError = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion && _iterator.return) {
							_iterator.return();
						}
					} finally {
						if (_didIteratorError) {
							throw _iteratorError;
						}
					}
				}
			}
		}
	
		function onmove_handle_right(dx, dy) {
			var bar = self.$bar;
			bar.finaldx = get_snap_position(dx);
			update_bar_position({ width: bar.owidth + bar.finaldx });
		}
	
		function onstop_handle_right() {
			var bar = self.$bar;
			if (bar.finaldx) date_changed();
			set_action_completed();
		}
	
		function update_bar_position(_ref) {
			var _ref$x = _ref.x,
			    x = _ref$x === undefined ? null : _ref$x,
			    _ref$width = _ref.width,
			    width = _ref$width === undefined ? null : _ref$width;
	
			var bar = self.$bar;
			if (x) {
				// get all x values of parent task
				var xs = task.dependencies.map(function (dep) {
					return gt.get_bar(dep).$bar.getX();
				});
				// child task must not go before parent
				var valid_x = xs.reduce(function (prev, curr) {
					return x >= curr;
				}, x);
				if (!valid_x) {
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
			var _compute_start_end_da = compute_start_end_date(),
			    new_start_date = _compute_start_end_da.new_start_date,
			    new_end_date = _compute_start_end_da.new_end_date;
	
			self.task._start = new_start_date;
			self.task._end = new_end_date;
			render_details();
			gt.trigger_event('date_change', [self.task, new_start_date, new_end_date]);
		}
	
		function progress_changed() {
			var new_progress = compute_progress();
			self.task.progress = new_progress;
			render_details();
			gt.trigger_event('progress_change', [self.task, new_progress]);
		}
	
		function set_action_completed() {
			self.action_completed = true;
			setTimeout(function () {
				return self.action_completed = false;
			}, 2000);
		}
	
		function compute_start_end_date() {
			var bar = self.$bar;
			var x_in_units = bar.getX() / gt.config.column_width;
			var new_start_date = gt.gantt_start.clone().add(x_in_units * gt.config.step, 'hours');
			var width_in_units = bar.getWidth() / gt.config.column_width;
			var new_end_date = new_start_date.clone().add(width_in_units * gt.config.step, 'hours');
			// lets say duration is 2 days
			// start_date = May 24 00:00:00
			// end_date = May 24 + 2 days = May 26 (incorrect)
			// so subtract 1 second so that
			// end_date = May 25 23:59:59
			new_end_date.add('-1', 'seconds');
			return { new_start_date: new_start_date, new_end_date: new_end_date };
		}
	
		function compute_progress() {
			var progress = self.$bar_progress.getWidth() / self.$bar.getWidth() * 100;
			return parseInt(progress, 10);
		}
	
		function compute_x() {
			var x = self.task._start.diff(gt.gantt_start, 'hours') / gt.config.step * gt.config.column_width;
	
			if (gt.view_is('Month')) {
				x = self.task._start.diff(gt.gantt_start, 'days') * gt.config.column_width / 30;
			}
			return x;
		}
	
		function compute_y() {
			return gt.config.header_height + gt.config.padding + self.task._index * (self.height + gt.config.padding);
		}
	
		function get_snap_position(dx) {
			var odx = dx,
			    rem = void 0,
			    position = void 0;
	
			if (gt.view_is('Week')) {
				rem = dx % (gt.config.column_width / 7);
				position = odx - rem + (rem < gt.config.column_width / 14 ? 0 : gt.config.column_width / 7);
			} else if (gt.view_is('Month')) {
				rem = dx % (gt.config.column_width / 30);
				position = odx - rem + (rem < gt.config.column_width / 60 ? 0 : gt.config.column_width / 30);
			} else {
				rem = dx % gt.config.column_width;
				position = odx - rem + (rem < gt.config.column_width / 2 ? 0 : gt.config.column_width);
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
			var bar = self.$bar,
			    label = self.group.select('.bar-label');
			if (label.getBBox().width > bar.getWidth()) {
				label.addClass('big').attr('x', bar.getX() + bar.getWidth() + 5);
			} else {
				label.removeClass('big').attr('x', bar.getX() + bar.getWidth() / 2);
			}
		}
	
		function update_handle_position() {
			var bar = self.$bar;
			self.handle_group.select('.handle.left').attr({
				'x': bar.getX() + 1
			});
			self.handle_group.select('.handle.right').attr({
				'x': bar.getEndX() - 9
			});
			var handle = self.group.select('.handle.progress');
			handle && handle.attr('points', get_progress_polygon_points());
		}
	
		function update_arrow_position() {
			var _iteratorNormalCompletion2 = true;
			var _didIteratorError2 = false;
			var _iteratorError2 = undefined;
	
			try {
				for (var _iterator2 = self.arrows[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
					var arrow = _step2.value;
	
					arrow.update();
				}
			} catch (err) {
				_didIteratorError2 = true;
				_iteratorError2 = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion2 && _iterator2.return) {
						_iterator2.return();
					}
				} finally {
					if (_didIteratorError2) {
						throw _iteratorError2;
					}
				}
			}
		}
	
		function update_details_position() {
			var _get_details_position2 = get_details_position(),
			    x = _get_details_position2.x,
			    y = _get_details_position2.y;
	
			self.details_box && self.details_box.transform('t' + x + ',' + y);
		}
	
		function isFunction(functionToCheck) {
			var getType = {};
			return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
		}
	
		init();
	
		return self;
	}
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Arrow;
	/* global Snap */
	/*
		Class: Arrow
		from_task ---> to_task
	
		Opts:
			gantt (Gantt object)
			from_task (Bar object)
			to_task (Bar object)
	*/
	
	function Arrow(gt, from_task, to_task) {
	
		var self = {};
	
		function init() {
			self.from_task = from_task;
			self.to_task = to_task;
			prepare();
			draw();
		}
	
		function prepare() {
	
			self.start_x = from_task.$bar.getX() + from_task.$bar.getWidth() / 2;
	
			var condition = function condition() {
				return to_task.$bar.getX() < self.start_x + gt.config.padding && self.start_x > from_task.$bar.getX() + gt.config.padding;
			};
	
			while (condition()) {
				self.start_x -= 10;
			}
	
			self.start_y = gt.config.header_height + gt.config.bar.height + (gt.config.padding + gt.config.bar.height) * from_task.task._index + gt.config.padding;
	
			self.end_x = to_task.$bar.getX() - gt.config.padding / 2;
			self.end_y = gt.config.header_height + gt.config.bar.height / 2 + (gt.config.padding + gt.config.bar.height) * to_task.task._index + gt.config.padding;
	
			var from_is_below_to = from_task.task._index > to_task.task._index;
			self.curve = gt.config.arrow.curve;
			self.clockwise = from_is_below_to ? 1 : 0;
			self.curve_y = from_is_below_to ? -self.curve : self.curve;
			self.offset = from_is_below_to ? self.end_y + gt.config.arrow.curve : self.end_y - gt.config.arrow.curve;
	
			self.path = Snap.format('M {start_x} {start_y} V {offset} ' + 'a {curve} {curve} 0 0 {clockwise} {curve} {curve_y} ' + 'L {end_x} {end_y} m -5 -5 l 5 5 l -5 5', {
				start_x: self.start_x,
				start_y: self.start_y,
				end_x: self.end_x,
				end_y: self.end_y,
				offset: self.offset,
				curve: self.curve,
				clockwise: self.clockwise,
				curve_y: self.curve_y
			});
	
			if (to_task.$bar.getX() < from_task.$bar.getX() + gt.config.padding) {
				self.path = Snap.format('M {start_x} {start_y} v {down_1} ' + 'a {curve} {curve} 0 0 1 -{curve} {curve} H {left} ' + 'a {curve} {curve} 0 0 {clockwise} -{curve} {curve_y} V {down_2} ' + 'a {curve} {curve} 0 0 {clockwise} {curve} {curve_y} ' + 'L {end_x} {end_y} m -5 -5 l 5 5 l -5 5', {
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
			self.element = gt.canvas.path(self.path).attr('data-from', self.from_task.task.id).attr('data-to', self.to_task.task.id);
		}
	
		function update() {
			// eslint-disable-line
			prepare();
			self.element.attr('d', self.path);
		}
		self.update = update;
	
		init();
	
		return self;
	}
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	(function (global, factory) {
		 true ? module.exports = factory() :
		typeof define === 'function' && define.amd ? define(factory) :
		(global.deepmerge = factory());
	}(this, (function () { 'use strict';
	
	var isMergeableObject = function isMergeableObject(value) {
		return isNonNullObject(value)
			&& !isSpecial(value)
	};
	
	function isNonNullObject(value) {
		return !!value && typeof value === 'object'
	}
	
	function isSpecial(value) {
		var stringValue = Object.prototype.toString.call(value);
	
		return stringValue === '[object RegExp]'
			|| stringValue === '[object Date]'
			|| isReactElement(value)
	}
	
	// see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
	var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
	var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;
	
	function isReactElement(value) {
		return value.$$typeof === REACT_ELEMENT_TYPE
	}
	
	function emptyTarget(val) {
		return Array.isArray(val) ? [] : {}
	}
	
	function cloneUnlessOtherwiseSpecified(value, optionsArgument) {
		var clone = !optionsArgument || optionsArgument.clone !== false;
	
		return (clone && isMergeableObject(value))
			? deepmerge(emptyTarget(value), value, optionsArgument)
			: value
	}
	
	function defaultArrayMerge(target, source, optionsArgument) {
		return target.concat(source).map(function(element) {
			return cloneUnlessOtherwiseSpecified(element, optionsArgument)
		})
	}
	
	function mergeObject(target, source, optionsArgument) {
		var destination = {};
		if (isMergeableObject(target)) {
			Object.keys(target).forEach(function(key) {
				destination[key] = cloneUnlessOtherwiseSpecified(target[key], optionsArgument);
			});
		}
		Object.keys(source).forEach(function(key) {
			if (!isMergeableObject(source[key]) || !target[key]) {
				destination[key] = cloneUnlessOtherwiseSpecified(source[key], optionsArgument);
			} else {
				destination[key] = deepmerge(target[key], source[key], optionsArgument);
			}
		});
		return destination
	}
	
	function deepmerge(target, source, optionsArgument) {
		var sourceIsArray = Array.isArray(source);
		var targetIsArray = Array.isArray(target);
		var options = optionsArgument || { arrayMerge: defaultArrayMerge };
		var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;
	
		if (!sourceAndTargetTypesMatch) {
			return cloneUnlessOtherwiseSpecified(source, optionsArgument)
		} else if (sourceIsArray) {
			var arrayMerge = options.arrayMerge || defaultArrayMerge;
			return arrayMerge(target, source, optionsArgument)
		} else {
			return mergeObject(target, source, optionsArgument)
		}
	}
	
	deepmerge.all = function deepmergeAll(array, optionsArgument) {
		if (!Array.isArray(array)) {
			throw new Error('first argument should be an array')
		}
	
		return array.reduce(function(prev, next) {
			return deepmerge(prev, next, optionsArgument)
		}, {})
	};
	
	var deepmerge_1 = deepmerge;
	
	return deepmerge_1;
	
	})));


/***/ }
/******/ ])
});
;
//# sourceMappingURL=frappe-gantt.js.map