const D = "year", Y = "month", $ = "day", E = "hour", A = "minute", H = "second", L = "millisecond", W = {
  January: "Jan",
  February: "Feb",
  March: "Mar",
  April: "Apr",
  May: "May",
  June: "Jun",
  July: "Jul",
  August: "Aug",
  September: "Sep",
  October: "Oct",
  November: "Nov",
  December: "Dec"
}, h = {
  parse_duration(o) {
    const e = /([0-9])+(y|m|d|h|min|s|ms)/gm.exec(o);
    if (e !== null) {
      if (e[2] === "y")
        return { duration: parseInt(e[1]), scale: "year" };
      if (e[2] === "m")
        return { duration: parseInt(e[1]), scale: "month" };
      if (e[2] === "d")
        return { duration: parseInt(e[1]), scale: "day" };
      if (e[2] === "h")
        return { duration: parseInt(e[1]), scale: "hour" };
      if (e[2] === "min")
        return { duration: parseInt(e[1]), scale: "minute" };
      if (e[2] === "s")
        return { duration: parseInt(e[1]), scale: "second" };
      if (e[2] === "ms")
        return { duration: parseInt(e[1]), scale: "millisecond" };
    }
  },
  parse(o, t = "-", e = /[.:]/) {
    if (o instanceof Date)
      return o;
    if (typeof o == "string") {
      let s, r;
      const i = o.split(" ");
      s = i[0].split(t).map((a) => parseInt(a, 10)), r = i[1] && i[1].split(e), s[1] = s[1] ? s[1] - 1 : 0;
      let n = s;
      return r && r.length && (r.length === 4 && (r[3] = "0." + r[3], r[3] = parseFloat(r[3]) * 1e3), n = n.concat(r)), new Date(...n);
    }
  },
  to_string(o, t = !1) {
    if (!(o instanceof Date))
      throw new TypeError("Invalid argument type");
    const e = this.get_date_values(o).map((i, n) => (n === 1 && (i = i + 1), n === 6 ? M(i + "", 3, "0") : M(i + "", 2, "0"))), s = `${e[0]}-${e[1]}-${e[2]}`, r = `${e[3]}:${e[4]}:${e[5]}.${e[6]}`;
    return s + (t ? " " + r : "");
  },
  format(o, t = "YYYY-MM-DD HH:mm:ss.SSS", e = "en") {
    const r = new Intl.DateTimeFormat(e, {
      month: "long"
    }).format(o), i = r.charAt(0).toUpperCase() + r.slice(1), n = this.get_date_values(o).map((g) => M(g, 2, 0)), a = {
      YYYY: n[0],
      MM: M(+n[1] + 1, 2, 0),
      DD: n[2],
      HH: n[3],
      mm: n[4],
      ss: n[5],
      SSS: n[6],
      D: n[2],
      MMMM: i,
      MMM: W[i]
    };
    let p = t;
    const _ = [];
    return Object.keys(a).sort((g, c) => c.length - g.length).forEach((g) => {
      p.includes(g) && (p = p.replaceAll(g, `$${_.length}`), _.push(a[g]));
    }), _.forEach((g, c) => {
      p = p.replaceAll(`$${c}`, g);
    }), p;
  },
  diff(o, t, e = $) {
    let s, r, i, n, a, p, _;
    return s = o - t, r = s / 1e3, n = r / 60, i = n / 60, a = i / 24, p = a / 30, _ = p / 12, e.endsWith("s") || (e += "s"), Math.floor(
      {
        milliseconds: s,
        seconds: r,
        minutes: n,
        hours: i,
        days: a,
        months: p,
        years: _
      }[e]
    );
  },
  today() {
    const o = this.get_date_values(/* @__PURE__ */ new Date()).slice(0, 3);
    return new Date(...o);
  },
  now() {
    return /* @__PURE__ */ new Date();
  },
  add(o, t, e) {
    t = parseInt(t, 10);
    const s = [
      o.getFullYear() + (e === D ? t : 0),
      o.getMonth() + (e === Y ? t : 0),
      o.getDate() + (e === $ ? t : 0),
      o.getHours() + (e === E ? t : 0),
      o.getMinutes() + (e === A ? t : 0),
      o.getSeconds() + (e === H ? t : 0),
      o.getMilliseconds() + (e === L ? t : 0)
    ];
    return new Date(...s);
  },
  start_of(o, t) {
    const e = {
      [D]: 6,
      [Y]: 5,
      [$]: 4,
      [E]: 3,
      [A]: 2,
      [H]: 1,
      [L]: 0
    };
    function s(i) {
      const n = e[t];
      return e[i] <= n;
    }
    const r = [
      o.getFullYear(),
      s(D) ? 0 : o.getMonth(),
      s(Y) ? 1 : o.getDate(),
      s($) ? 0 : o.getHours(),
      s(E) ? 0 : o.getMinutes(),
      s(A) ? 0 : o.getSeconds(),
      s(H) ? 0 : o.getMilliseconds()
    ];
    return new Date(...r);
  },
  clone(o) {
    return new Date(...this.get_date_values(o));
  },
  get_date_values(o) {
    return [
      o.getFullYear(),
      o.getMonth(),
      o.getDate(),
      o.getHours(),
      o.getMinutes(),
      o.getSeconds(),
      o.getMilliseconds()
    ];
  },
  get_days_in_month(o) {
    const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = o.getMonth();
    if (e !== 1)
      return t[e];
    const s = o.getFullYear();
    return s % 4 === 0 && s % 100 != 0 || s % 400 === 0 ? 29 : 28;
  }
};
function M(o, t, e) {
  return o = o + "", t = t >> 0, e = String(typeof e < "u" ? e : " "), o.length > t ? String(o) : (t = t - o.length, t > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(o));
}
function l(o, t) {
  return typeof o == "string" ? (t || document).querySelector(o) : o || null;
}
function u(o, t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", o);
  for (let s in t)
    s === "append_to" ? t.append_to.appendChild(e) : s === "innerHTML" ? e.innerHTML = t.innerHTML : s === "clipPath" ? e.setAttribute("clip-path", "url(#" + t[s] + ")") : e.setAttribute(s, t[s]);
  return e;
}
function S(o, t, e, s) {
  const r = X(o, t, e, s);
  if (r === o) {
    const i = document.createEvent("HTMLEvents");
    i.initEvent("click", !0, !0), i.eventName = "click", r.dispatchEvent(i);
  }
}
function X(o, t, e, s, r = "0.4s", i = "0.1s") {
  const n = o.querySelector("animate");
  if (n)
    return l.attr(n, {
      attributeName: t,
      from: e,
      to: s,
      dur: r,
      begin: "click + " + i
      // artificial click
    }), o;
  const a = u("animate", {
    attributeName: t,
    from: e,
    to: s,
    dur: r,
    begin: i,
    calcMode: "spline",
    values: e + ";" + s,
    keyTimes: "0; 1",
    keySplines: O("ease-out")
  });
  return o.appendChild(a), o;
}
function O(o) {
  return {
    ease: ".25 .1 .25 1",
    linear: "0 0 1 1",
    "ease-in": ".42 0 1 1",
    "ease-out": "0 0 .58 1",
    "ease-in-out": ".42 0 .58 1"
  }[o];
}
l.on = (o, t, e, s) => {
  s ? l.delegate(o, t, e, s) : (s = e, l.bind(o, t, s));
};
l.off = (o, t, e) => {
  o.removeEventListener(t, e);
};
l.bind = (o, t, e) => {
  t.split(/\s+/).forEach(function(s) {
    o.addEventListener(s, e);
  });
};
l.delegate = (o, t, e, s) => {
  o.addEventListener(t, function(r) {
    const i = r.target.closest(e);
    i && (r.delegatedTarget = i, s.call(this, r, i));
  });
};
l.closest = (o, t) => t ? t.matches(o) ? t : l.closest(o, t.parentNode) : null;
l.attr = (o, t, e) => {
  if (!e && typeof t == "string")
    return o.getAttribute(t);
  if (typeof t == "object") {
    for (let s in t)
      l.attr(o, s, t[s]);
    return;
  }
  o.setAttribute(t, e);
};
class C {
  constructor(t, e) {
    this.set_defaults(t, e), this.prepare(), this.draw(), this.bind();
  }
  set_defaults(t, e) {
    this.action_completed = !1, this.gantt = t, this.task = e;
  }
  prepare() {
    this.prepare_values(), this.prepare_helpers();
  }
  prepare_values() {
    this.invalid = this.task.invalid, this.height = this.gantt.options.bar_height, this.image_size = this.height - 5, this.compute_x(), this.compute_y(), this.compute_duration(), this.corner_radius = this.gantt.options.bar_corner_radius, this.width = this.gantt.options.column_width * this.duration, this.progress_width = this.gantt.options.column_width * this.duration * (this.task.progress / 100) || 0, this.group = u("g", {
      class: "bar-wrapper" + (this.task.custom_class ? " " + this.task.custom_class : "") + (this.task.important ? " important" : ""),
      "data-id": this.task.id
    }), this.bar_group = u("g", {
      class: "bar-group",
      append_to: this.group
    }), this.handle_group = u("g", {
      class: "handle-group",
      append_to: this.group
    });
  }
  prepare_helpers() {
    SVGElement.prototype.getX = function() {
      return +this.getAttribute("x");
    }, SVGElement.prototype.getY = function() {
      return +this.getAttribute("y");
    }, SVGElement.prototype.getWidth = function() {
      return +this.getAttribute("width");
    }, SVGElement.prototype.getHeight = function() {
      return +this.getAttribute("height");
    }, SVGElement.prototype.getEndX = function() {
      return this.getX() + this.getWidth();
    };
  }
  prepare_expected_progress_values() {
    this.compute_expected_progress(), this.expected_progress_width = this.gantt.options.column_width * this.duration * (this.expected_progress / 100) || 0;
  }
  draw() {
    this.draw_bar(), this.draw_progress_bar(), this.gantt.options.show_expected_progress && (this.prepare_expected_progress_values(), this.draw_expected_progress_bar()), this.draw_label(), this.draw_resize_handles(), this.task.thumbnail && this.draw_thumbnail();
  }
  draw_bar() {
    this.$bar = u("rect", {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar" + (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) && !this.task.important ? " safari" : ""),
      append_to: this.bar_group
    }), S(this.$bar, "width", 0, this.width), this.invalid && this.$bar.classList.add("bar-invalid");
  }
  draw_expected_progress_bar() {
    this.invalid || (this.$expected_bar_progress = u("rect", {
      x: this.x,
      y: this.y,
      width: this.expected_progress_width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar-expected-progress",
      append_to: this.bar_group
    }), S(
      this.$expected_bar_progress,
      "width",
      0,
      this.expected_progress_width
    ));
  }
  draw_progress_bar() {
    if (this.invalid)
      return;
    this.$bar_progress = u("rect", {
      x: this.x,
      y: this.y,
      width: this.progress_width,
      height: this.height,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "bar-progress",
      append_to: this.bar_group
    });
    const t = h.diff(this.task._start, this.gantt.gantt_start, "hour") / this.gantt.options.step * this.gantt.options.column_width;
    let e = document.createElement("div");
    e.id = `${this.task.id}-highlight`, e.classList.add("date-highlight"), e.style.height = this.height * 0.8 + "px", e.style.width = this.width + "px", e.style.top = this.gantt.options.header_height - 25 + "px", e.style.left = t + "px", this.$date_highlight = e, this.gantt.$lower_header.prepend(e), S(this.$bar_progress, "width", 0, this.progress_width);
  }
  draw_label() {
    let t = this.x + this.$bar.getWidth() / 2;
    this.task.thumbnail && (t = this.x + this.image_size + 5), u("text", {
      x: t,
      y: this.y + this.height / 2,
      innerHTML: this.task.name,
      class: "bar-label",
      append_to: this.bar_group
    }), requestAnimationFrame(() => this.update_label_position());
  }
  draw_thumbnail() {
    let t = 10, e = 2, s, r;
    s = u("defs", {
      append_to: this.bar_group
    }), u("rect", {
      id: "rect_" + this.task.id,
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      rx: "15",
      class: "img_mask",
      append_to: s
    }), r = u("clipPath", {
      id: "clip_" + this.task.id,
      append_to: s
    }), u("use", {
      href: "#rect_" + this.task.id,
      append_to: r
    }), u("image", {
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      class: "bar-img",
      href: this.task.thumbnail,
      clipPath: "clip_" + this.task.id,
      append_to: this.bar_group
    });
  }
  draw_resize_handles() {
    if (this.invalid || this.gantt.options.readonly)
      return;
    const t = this.$bar, e = 8;
    u("rect", {
      x: t.getX() + t.getWidth() + e - 4,
      y: t.getY() + 1,
      width: e,
      height: this.height - 2,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "handle right",
      append_to: this.handle_group
    }), u("rect", {
      x: t.getX() - e - 4,
      y: t.getY() + 1,
      width: e,
      height: this.height - 2,
      rx: this.corner_radius,
      ry: this.corner_radius,
      class: "handle left",
      append_to: this.handle_group
    }), this.$handle_progress = u("polygon", {
      points: this.get_progress_polygon_points().join(","),
      class: "handle progress",
      append_to: this.handle_group
    });
  }
  get_progress_polygon_points() {
    const t = this.$bar_progress;
    let e = 10, s = 15;
    return [
      t.getEndX() - e / 2,
      t.getY() + t.getHeight() / 2,
      t.getEndX(),
      t.getY() + t.getHeight() / 2 - s / 2,
      t.getEndX() + e / 2,
      t.getY() + t.getHeight() / 2,
      t.getEndX(),
      t.getY() + t.getHeight() / 2 + s / 2,
      t.getEndX() - e / 2,
      t.getY() + t.getHeight() / 2
    ];
  }
  bind() {
    this.invalid || this.setup_click_event();
  }
  setup_click_event() {
    let t = this.task.id;
    l.on(this.group, "mouseover", (s) => {
      this.gantt.trigger_event("hover", [
        this.task,
        s.screenX,
        s.screenY,
        s
      ]);
    });
    let e;
    l.on(
      this.group,
      "mouseenter",
      (s) => e = setTimeout(() => {
        this.show_popup(s.offsetX), document.querySelector(
          `#${t}-highlight`
        ).style.display = "block";
      }, 200)
    ), l.on(this.group, "mouseleave", () => {
      var s, r;
      clearTimeout(e), (r = (s = this.gantt.popup) == null ? void 0 : s.hide) == null || r.call(s), document.querySelector(`#${t}-highlight`).style.display = "none";
    }), l.on(this.group, this.gantt.options.popup_trigger, () => {
      this.gantt.trigger_event("click", [this.task]);
    }), l.on(this.group, "dblclick", (s) => {
      this.action_completed || this.gantt.trigger_event("double_click", [this.task]);
    });
  }
  show_popup(t) {
    if (this.gantt.bar_being_dragged)
      return;
    const e = h.format(
      this.task._start,
      "MMM D",
      this.gantt.options.language
    ), s = h.format(
      h.add(this.task._end, -1, "second"),
      "MMM D",
      this.gantt.options.language
    ), r = `${e} -  ${s}<br/>Progress: ${this.task.progress}`;
    this.gantt.show_popup({
      x: t,
      target_element: this.$bar,
      title: this.task.name,
      subtitle: r,
      task: this.task
    });
  }
  update_bar_position({ x: t = null, width: e = null }) {
    const s = this.$bar;
    if (t) {
      if (!this.task.dependencies.map((n) => this.gantt.get_bar(n).$bar.getX()).reduce((n, a) => t >= a, t)) {
        e = null;
        return;
      }
      this.update_attr(s, "x", t), this.$date_highlight.style.left = t + "px";
    }
    e && (this.update_attr(s, "width", e), this.$date_highlight.style.width = e + "px"), this.update_label_position(), this.update_handle_position(), this.gantt.options.show_expected_progress && (this.date_changed(), this.compute_duration(), this.update_expected_progressbar_position()), this.update_progressbar_position(), this.update_arrow_position();
  }
  update_label_position_on_horizontal_scroll({ x: t, sx: e }) {
    const s = document.querySelector(".gantt-container"), r = this.group.querySelector(".bar-label"), i = this.group.querySelector(".bar-img") || "", n = this.bar_group.querySelector(".img_mask") || "";
    let a = this.$bar.getX() + this.$bar.getWidth(), p = r.getX() + t, _ = i && i.getX() + t || 0, g = i && i.getBBox().width + 7 || 7, c = p + r.getBBox().width + 7, f = e + s.clientWidth / 2;
    r.classList.contains("big") || (c < a && t > 0 && c < f || p - g > this.$bar.getX() && t < 0 && c > f) && (r.setAttribute("x", p), i && (i.setAttribute("x", _), n.setAttribute("x", _)));
  }
  date_changed() {
    let t = !1;
    const { new_start_date: e, new_end_date: s } = this.compute_start_end_date();
    Number(this.task._start) !== Number(e) && (t = !0, this.task._start = e), Number(this.task._end) !== Number(s) && (t = !0, this.task._end = s), t && this.gantt.trigger_event("date_change", [
      this.task,
      e,
      h.add(s, -1, "second")
    ]);
  }
  progress_changed() {
    const t = this.compute_progress();
    this.task.progress = t, this.gantt.trigger_event("progress_change", [this.task, t]);
  }
  set_action_completed() {
    this.action_completed = !0, setTimeout(() => this.action_completed = !1, 1e3);
  }
  compute_start_end_date() {
    const t = this.$bar, e = t.getX() / this.gantt.options.column_width, s = h.add(
      this.gantt.gantt_start,
      e * this.gantt.options.step,
      "hour"
    ), r = t.getWidth() / this.gantt.options.column_width, i = h.add(
      s,
      r * this.gantt.options.step,
      "hour"
    );
    return { new_start_date: s, new_end_date: i };
  }
  compute_progress() {
    const t = this.$bar_progress.getWidth() / this.$bar.getWidth() * 100;
    return parseInt(t, 10);
  }
  compute_expected_progress() {
    this.expected_progress = h.diff(h.today(), this.task._start, "hour") / this.gantt.options.step, this.expected_progress = (this.expected_progress < this.duration ? this.expected_progress : this.duration) * 100 / this.duration;
  }
  compute_x() {
    const { step: t, column_width: e } = this.gantt.options, s = this.task._start, r = this.gantt.gantt_start;
    let n = h.diff(s, r, "hour") / t * e;
    this.gantt.view_is("Month") && (n = h.diff(s, r, "day") * e / 30), this.x = n;
  }
  compute_y() {
    this.y = this.gantt.options.header_height + this.gantt.options.padding + this.task._index * (this.height + this.gantt.options.padding);
  }
  compute_duration() {
    this.duration = h.diff(this.task._end, this.task._start, "hour") / this.gantt.options.step;
  }
  get_snap_position(t) {
    let e = t, s, r;
    return this.gantt.view_is("Week") ? (s = t % (this.gantt.options.column_width / 7), r = e - s + (s < this.gantt.options.column_width / 14 ? 0 : this.gantt.options.column_width / 7)) : this.gantt.view_is("Month") ? (s = t % (this.gantt.options.column_width / 30), r = e - s + (s < this.gantt.options.column_width / 60 ? 0 : this.gantt.options.column_width / 30)) : (s = t % this.gantt.options.column_width, r = e - s + (s < this.gantt.options.column_width / 2 ? 0 : this.gantt.options.column_width)), r;
  }
  update_attr(t, e, s) {
    return s = +s, isNaN(s) || t.setAttribute(e, s), t;
  }
  update_expected_progressbar_position() {
    this.invalid || (this.$expected_bar_progress.setAttribute("x", this.$bar.getX()), this.compute_expected_progress(), this.$expected_bar_progress.setAttribute(
      "width",
      this.gantt.options.column_width * this.duration * (this.expected_progress / 100) || 0
    ));
  }
  update_progressbar_position() {
    this.invalid || this.gantt.options.readonly || (this.$bar_progress.setAttribute("x", this.$bar.getX()), this.$bar_progress.setAttribute(
      "width",
      this.$bar.getWidth() * (this.task.progress / 100)
    ));
  }
  update_label_position() {
    const t = this.bar_group.querySelector(".img_mask") || "", e = this.$bar, s = this.group.querySelector(".bar-label"), r = this.group.querySelector(".bar-img");
    let i = 5, n = this.image_size + 10;
    const a = s.getBBox().width, p = e.getWidth();
    a > p ? (s.classList.add("big"), r ? (r.setAttribute("x", e.getX() + e.getWidth() + i), t.setAttribute(
      "x",
      e.getX() + e.getWidth() + i
    ), s.setAttribute(
      "x",
      e.getX() + e.getWidth() + n
    )) : s.setAttribute("x", e.getX() + e.getWidth() + i)) : (s.classList.remove("big"), r ? (r.setAttribute("x", e.getX() + i), t.setAttribute("x", e.getX() + i), s.setAttribute(
      "x",
      e.getX() + p / 2 + n
    )) : s.setAttribute(
      "x",
      e.getX() + p / 2 - a / 2
    ));
  }
  update_handle_position() {
    if (this.invalid || this.gantt.options.readonly)
      return;
    const t = this.$bar;
    this.handle_group.querySelector(".handle.left").setAttribute("x", t.getX() - 12), this.handle_group.querySelector(".handle.right").setAttribute("x", t.getEndX() + 4);
    const e = this.group.querySelector(".handle.progress");
    e && e.setAttribute("points", this.get_progress_polygon_points());
  }
  update_arrow_position() {
    this.arrows = this.arrows || [];
    for (let t of this.arrows)
      t.update();
  }
}
class N {
  constructor(t, e, s) {
    this.gantt = t, this.from_task = e, this.to_task = s, this.calculate_path(), this.draw();
  }
  calculate_path() {
    let t = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
    const e = () => this.to_task.$bar.getX() < t + this.gantt.options.padding && t > this.from_task.$bar.getX() + this.gantt.options.padding;
    for (; e(); )
      t -= 10;
    const s = this.gantt.options.header_height + this.gantt.options.bar_height + (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index + this.gantt.options.padding, r = this.to_task.$bar.getX() - this.gantt.options.padding / 2 - 7, i = this.gantt.options.header_height + this.gantt.options.bar_height / 2 + (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index + this.gantt.options.padding, n = this.from_task.task._index > this.to_task.task._index, a = this.gantt.options.arrow_curve, p = n ? 1 : 0, _ = n ? -a : a, g = n ? i + this.gantt.options.arrow_curve : i - this.gantt.options.arrow_curve;
    if (this.path = `
            M ${t} ${s}
            V ${g}
            a ${a} ${a} 0 0 ${p} ${a} ${_}
            L ${r} ${i}
            m -5 -5
            l 5 5
            l -5 5`, this.to_task.$bar.getX() < this.from_task.$bar.getX() + this.gantt.options.padding) {
      const c = this.gantt.options.padding / 2 - a, f = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - _, m = this.to_task.$bar.getX() - this.gantt.options.padding;
      this.path = `
                M ${t} ${s}
                v ${c}
                a ${a} ${a} 0 0 1 -${a} ${a}
                H ${m}
                a ${a} ${a} 0 0 ${p} -${a} ${_}
                V ${f}
                a ${a} ${a} 0 0 ${p} ${a} ${_}
                L ${r} ${i}
                m -5 -5
                l 5 5
                l -5 5`;
    }
  }
  draw() {
    this.element = u("path", {
      d: this.path,
      "data-from": this.from_task.task.id,
      "data-to": this.to_task.task.id
    });
  }
  update() {
    this.calculate_path(), this.element.setAttribute("d", this.path);
  }
}
class R {
  constructor(t, e) {
    this.parent = t, this.custom_html = e, this.make();
  }
  make() {
    this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `, this.hide(), this.title = this.parent.querySelector(".title"), this.subtitle = this.parent.querySelector(".subtitle"), this.pointer = this.parent.querySelector(".pointer");
  }
  show(t) {
    if (!t.target_element)
      throw new Error("target_element is required to show popup");
    const e = t.target_element;
    if (this.custom_html) {
      let r = this.custom_html(t.task);
      r += '<div class="pointer"></div>', this.parent.innerHTML = r, this.pointer = this.parent.querySelector(".pointer");
    } else
      this.title.innerHTML = t.title, this.subtitle.innerHTML = t.subtitle;
    let s;
    e instanceof HTMLElement ? s = e.getBoundingClientRect() : e instanceof SVGElement && (s = t.target_element.getBBox()), this.parent.style.left = t.x - this.parent.clientWidth / 2 + "px", this.parent.style.top = s.y + s.height + 10 + "px", this.pointer.style.left = this.parent.clientWidth / 2 + "px", this.pointer.style.top = "-15px", this.parent.style.opacity = 1;
  }
  hide() {
    this.parent.style.opacity = 0, this.parent.style.left = 0;
  }
}
const d = {
  HOUR: "Hour",
  QUARTER_DAY: "Quarter Day",
  HALF_DAY: "Half Day",
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  YEAR: "Year"
}, F = {
  HOUR: ["7d", "7d"],
  QUARTER_DAY: ["7d", "7d"],
  HALF_DAY: ["7d", "7d"],
  DAY: ["1m", "1m"],
  WEEK: ["1m", "1m"],
  MONTH: ["1m", "1m"],
  YEAR: ["2y", "2y"]
}, I = {
  header_height: 65,
  column_width: 30,
  step: 24,
  view_modes: [...Object.values(d)],
  bar_height: 30,
  bar_corner_radius: 3,
  arrow_curve: 5,
  padding: 18,
  view_mode: "Day",
  date_format: "YYYY-MM-DD",
  popup_trigger: "click",
  show_expected_progress: !1,
  popup: null,
  language: "en",
  readonly: !1,
  highlight_weekend: !0,
  scroll_to: "start",
  lines: "both",
  auto_move_label: !0,
  today_button: !0,
  view_mode_select: !1
};
class q {
  constructor(t, e, s) {
    this.setup_wrapper(t), this.setup_options(s), this.setup_tasks(e), this.change_view_mode(), this.bind_events();
  }
  setup_wrapper(t) {
    let e, s;
    if (typeof t == "string" && (t = document.querySelector(t)), t instanceof HTMLElement)
      s = t, e = t.querySelector("svg");
    else if (t instanceof SVGElement)
      e = t;
    else
      throw new TypeError(
        "Frappé Gantt only supports usage of a string CSS selector, HTML DOM element or SVG DOM element for the 'element' parameter"
      );
    e ? (this.$svg = e, this.$svg.classList.add("gantt")) : this.$svg = u("svg", {
      append_to: s,
      class: "gantt"
    }), this.$container = document.createElement("div"), this.$container.classList.add("gantt-container"), this.$svg.parentElement.appendChild(this.$container), this.$container.appendChild(this.$svg), this.$popup_wrapper = document.createElement("div"), this.$popup_wrapper.classList.add("popup-wrapper"), this.$container.appendChild(this.$popup_wrapper);
  }
  setup_options(t) {
    this.options = { ...I, ...t }, t.view_mode_padding || (t.view_mode_padding = {});
    for (let [e, s] of Object.entries(t.view_mode_padding))
      typeof s == "string" && (t.view_mode_padding[e] = [s, s]);
    this.options.view_mode_padding = {
      ...F,
      ...t.view_mode_padding
    };
  }
  setup_tasks(t) {
    this.tasks = t.map((e, s) => {
      if (e._start = h.parse(e.start), e.end === void 0 && e.duration !== void 0 && (e.end = e._start, e.duration.split(" ").forEach((a) => {
        let { duration: p, scale: _ } = h.parse_duration(a);
        e.end = h.add(e.end, p, _);
      })), e._end = h.parse(e.end), h.diff(e._end, e._start, "year") < 0)
        throw Error(
          "start of task can't be after end of task: in task #, " + (s + 1)
        );
      if (h.diff(e._end, e._start, "year") > 10 && (e.end = null), e._index = s, !e.start && !e.end) {
        const n = h.today();
        e._start = n, e._end = h.add(n, 2, "day");
      }
      if (!e.start && e.end && (e._start = h.add(e._end, -2, "day")), e.start && !e.end && (e._end = h.add(e._start, 2, "day")), h.get_date_values(e._end).slice(3).every((n) => n === 0) && (e._end = h.add(e._end, 24, "hour")), (!e.start || !e.end) && (e.invalid = !0), typeof e.dependencies == "string" || !e.dependencies) {
        let n = [];
        e.dependencies && (n = e.dependencies.split(",").map((a) => a.trim().replaceAll(" ", "_")).filter((a) => a)), e.dependencies = n;
      }
      return e.id ? typeof e.id == "string" ? e.id = e.id.replaceAll(" ", "_") : e.id = `${e.id}` : e.id = z(e), e;
    }), this.setup_dependencies();
  }
  setup_dependencies() {
    this.dependency_map = {};
    for (let t of this.tasks)
      for (let e of t.dependencies)
        this.dependency_map[e] = this.dependency_map[e] || [], this.dependency_map[e].push(t.id);
  }
  refresh(t) {
    this.setup_tasks(t), this.change_view_mode();
  }
  change_view_mode(t = this.options.view_mode) {
    this.update_view_scale(t), this.setup_dates(), this.render(), this.trigger_event("view_change", [t]);
  }
  update_view_scale(t) {
    this.options.view_mode = t, t === d.HOUR ? (this.options.step = 24 / 24, this.options.column_width = 38) : t === d.DAY ? (this.options.step = 24, this.options.column_width = 38) : t === d.HALF_DAY ? (this.options.step = 24 / 2, this.options.column_width = 38) : t === d.QUARTER_DAY ? (this.options.step = 24 / 4, this.options.column_width = 38) : t === d.WEEK ? (this.options.step = 24 * 7, this.options.column_width = 140) : t === d.MONTH ? (this.options.step = 24 * 30, this.options.column_width = 120) : t === d.YEAR && (this.options.step = 24 * 365, this.options.column_width = 120);
  }
  setup_dates() {
    this.setup_gantt_dates(), this.setup_date_values();
  }
  setup_gantt_dates() {
    this.gantt_start = this.gantt_end = null;
    for (let a of this.tasks)
      (!this.gantt_start || a._start < this.gantt_start) && (this.gantt_start = a._start), (!this.gantt_end || a._end > this.gantt_end) && (this.gantt_end = a._end);
    let t, e;
    this.gantt_start ? t = h.start_of(this.gantt_start, "day") : t = /* @__PURE__ */ new Date(), this.gantt_end ? e = h.start_of(this.gantt_end, "day") : e = /* @__PURE__ */ new Date();
    let s;
    for (let [a, p] of Object.entries(d))
      p === this.options.view_mode && (s = a);
    const [r, i] = this.options.view_mode_padding[s].map(h.parse_duration);
    t = h.add(
      t,
      -r.duration,
      r.scale
    );
    let n;
    this.view_is(d.YEAR) ? n = "YYYY" : this.view_is(d.MONTH) ? n = "YYYY-MM" : this.view_is(d.DAY) ? n = "YYYY-MM-DD" : n = "YYYY-MM-DD HH", this.gantt_start = h.parse(
      h.format(t, n)
    ), this.gantt_start.setHours(0, 0, 0, 0), this.gantt_end = h.add(
      e,
      i.duration,
      i.scale
    );
  }
  setup_date_values() {
    this.dates = [];
    let t = null;
    for (; t === null || t < this.gantt_end; )
      t ? this.view_is(d.YEAR) ? t = h.add(t, 1, "year") : this.view_is(d.MONTH) ? t = h.add(t, 1, "month") : t = h.add(
        t,
        this.options.step,
        "hour"
      ) : t = h.clone(this.gantt_start), this.dates.push(t);
  }
  bind_events() {
    this.options.readonly || (this.bind_grid_click(), this.bind_bar_events());
  }
  render() {
    this.clear(), this.setup_layers(), this.make_grid(), this.make_dates(), this.make_bars(), this.make_grid_extras(), this.make_arrows(), this.map_arrows_on_bars(), this.set_width(), this.set_scroll_position(this.options.scroll_to);
  }
  setup_layers() {
    this.layers = {};
    const t = ["grid", "arrow", "progress", "bar", "details"];
    for (let e of t)
      this.layers[e] = u("g", {
        class: e,
        append_to: this.$svg
      });
  }
  make_grid() {
    this.make_grid_background(), this.make_grid_rows(), this.make_grid_header();
  }
  make_grid_extras() {
    this.make_grid_highlights(), this.make_grid_ticks();
  }
  make_grid_background() {
    const t = this.dates.length * this.options.column_width, e = this.options.header_height + this.options.padding + (this.options.bar_height + this.options.padding) * this.tasks.length;
    u("rect", {
      x: 0,
      y: 0,
      width: t,
      height: e,
      class: "grid-background",
      append_to: this.$svg
    }), l.attr(this.$svg, {
      height: e + this.options.padding + 100,
      width: "100%"
    });
  }
  make_grid_rows() {
    const t = u("g", { append_to: this.layers.grid }), e = this.dates.length * this.options.column_width, s = this.options.bar_height + this.options.padding;
    let r = this.options.header_height + this.options.padding / 2;
    for (let i of this.tasks)
      u("rect", {
        x: 0,
        y: r,
        width: e,
        height: s,
        class: "grid-row",
        append_to: t
      }), this.options.lines === "both" || this.options.lines, r += this.options.bar_height + this.options.padding;
  }
  make_grid_header() {
    document.querySelector(".grid-header");
    let t = document.createElement("div");
    t.style.height = this.options.header_height + 10 + "px", t.style.width = this.dates.length * this.options.column_width + "px", t.classList.add("grid-header"), this.$header = t, this.$container.appendChild(t);
    let e = document.createElement("div");
    e.classList.add("upper-header"), this.$upper_header = e, this.$header.appendChild(e);
    let s = document.createElement("div");
    s.classList.add("lower-header"), this.$lower_header = s, this.$header.appendChild(s), this.make_side_header();
  }
  make_side_header() {
    let t = document.createElement("div");
    if (t.classList.add("side-header"), this.options.view_mode_select) {
      const i = document.createElement("select");
      i.classList.add("viewmode-select");
      const n = document.createElement("option");
      n.selected = !0, n.disabled = !0, n.textContent = "Mode", i.appendChild(n);
      for (const a in d) {
        const p = document.createElement("option");
        p.value = d[a], p.textContent = d[a], i.appendChild(p);
      }
      i.addEventListener(
        "change",
        (function() {
          this.change_view_mode(i.value);
        }).bind(this)
      ), t.appendChild(i);
    }
    if (this.options.today_button) {
      let i = document.createElement("button");
      i.classList.add("today-button"), i.textContent = "Today", i.onclick = this.scroll_today.bind(this), t.appendChild(i);
    }
    this.$header.appendChild(t);
    const { left: e, y: s } = this.$header.getBoundingClientRect(), r = Math.min(
      this.$header.clientWidth,
      this.$container.clientWidth
    );
    t.style.left = e + this.$container.scrollLeft + r - t.clientWidth + "px", t.style.top = s + 10 + "px";
  }
  make_grid_ticks() {
    if (!["both", "vertical", "horizontal"].includes(this.options.lines))
      return;
    let t = 0, e = this.options.header_height + this.options.padding / 2, s = (this.options.bar_height + this.options.padding) * this.tasks.length, r = u("g", {
      class: "lines_layer",
      append_to: this.layers.grid
    }), i = this.options.header_height + this.options.padding / 2;
    const n = this.dates.length * this.options.column_width, a = this.options.bar_height + this.options.padding;
    if (this.options.lines !== "vertical")
      for (let p of this.tasks)
        u("line", {
          x1: 0,
          y1: i + a,
          x2: n,
          y2: i + a,
          class: "row-line",
          append_to: r
        }), i += a;
    if (this.options.lines !== "horizontal")
      for (let p of this.dates) {
        let _ = "tick";
        this.view_is(d.DAY) && p.getDate() === 1 && (_ += " thick"), this.view_is(d.WEEK) && p.getDate() >= 1 && p.getDate() < 8 && (_ += " thick"), this.view_is(d.MONTH) && p.getMonth() % 3 === 0 && (_ += " thick"), u("path", {
          d: `M ${t} ${e} v ${s}`,
          class: _,
          append_to: this.layers.grid
        }), this.view_is(d.MONTH) ? t += h.get_days_in_month(p) * this.options.column_width / 30 : t += this.options.column_width;
      }
  }
  highlightWeekends() {
    if (!(!this.view_is("Day") && !this.view_is("Half Day"))) {
      for (let t = new Date(this.gantt_start); t <= this.gantt_end; t.setDate(t.getDate() + 1))
        if (t.getDay() === 0 || t.getDay() === 6) {
          const e = h.diff(t, this.gantt_start, "hour") / this.options.step * this.options.column_width, s = (this.options.bar_height + this.options.padding) * this.tasks.length;
          u("rect", {
            x: e,
            y: this.options.header_height + this.options.padding / 2,
            width: (this.view_is("Day") ? 1 : 2) * this.options.column_width,
            height: s,
            class: "holiday-highlight",
            append_to: this.layers.grid
          });
        }
    }
  }
  //compute the horizontal x distance
  computeGridHighlightDimensions(t) {
    let e = this.options.column_width / 2;
    if (this.view_is(d.DAY)) {
      let s = h.today();
      return {
        x: e + h.diff(s, this.gantt_start, "hour") / this.options.step * this.options.column_width,
        date: s
      };
    }
    for (let s of this.dates) {
      const r = /* @__PURE__ */ new Date(), i = new Date(s), n = new Date(s);
      switch (t) {
        case d.WEEK:
          n.setDate(s.getDate() + 7);
          break;
        case d.MONTH:
          n.setMonth(s.getMonth() + 1);
          break;
        case d.YEAR:
          n.setFullYear(s.getFullYear() + 1);
          break;
      }
      if (r >= i && r <= n)
        return { x: e, date: i };
      e += this.options.column_width;
    }
  }
  make_grid_highlights() {
    if (this.options.highlight_weekend && this.highlightWeekends(), this.view_is(d.DAY) || this.view_is(d.WEEK) || this.view_is(d.MONTH) || this.view_is(d.YEAR)) {
      const { x: t, date: e } = this.computeGridHighlightDimensions(
        this.options.view_mode
      ), s = this.options.header_height + this.options.padding / 2, r = (this.options.bar_height + this.options.padding) * this.tasks.length;
      this.$current_highlight = this.create_el({
        top: s,
        left: t,
        height: r,
        classes: "current-highlight",
        append_to: this.$container
      });
      let i = document.getElementById(
        h.format(e).replaceAll(" ", "_")
      );
      i.classList.add("current-date-highlight"), i.style.top = +i.style.top.slice(0, -2) - 4 + "px", i.style.left = +i.style.left.slice(0, -2) - 8 + "px";
    }
  }
  create_el({ left: t, top: e, width: s, height: r, id: i, classes: n, append_to: a }) {
    let p = document.createElement("div");
    return p.classList.add(n), p.style.top = e + "px", p.style.left = t + "px", i && (p.id = i), s && (p.style.width = r + "px"), r && (p.style.height = r + "px"), a.appendChild(p), p;
  }
  make_dates() {
    this.upper_texts_x = {}, this.get_dates_to_draw().forEach((t, e) => {
      let s = this.create_el({
        left: t.lower_x,
        top: t.lower_y,
        id: t.formatted_date,
        classes: "lower-text",
        append_to: this.$lower_header
      });
      if (s.innerText = t.lower_text, s.style.left = +s.style.left.slice(0, -2) - s.clientWidth / 2 + "px", t.upper_text) {
        this.upper_texts_x[t.upper_text] = t.upper_x;
        let r = document.createElement("div");
        r.classList.add("upper-text"), r.style.left = t.upper_x + "px", r.style.top = t.upper_y + "px", r.innerText = t.upper_text, this.$upper_header.appendChild(r), t.upper_x > this.layers.grid.getBBox().width && r.remove();
      }
    });
  }
  get_dates_to_draw() {
    let t = null;
    return this.dates.map((s, r) => {
      const i = this.get_date_info(s, t, r);
      return t = i, i;
    });
  }
  get_date_info(t, e) {
    let s = e ? e.date : h.add(t, 1, "day");
    const r = {
      Hour_lower: h.format(t, "HH", this.options.language),
      "Quarter Day_lower": h.format(
        t,
        "HH",
        this.options.language
      ),
      "Half Day_lower": h.format(
        t,
        "HH",
        this.options.language
      ),
      Day_lower: t.getDate() !== s.getDate() ? h.format(t, "D", this.options.language) : "",
      Week_lower: t.getMonth() !== s.getMonth() ? h.format(t, "D MMM", this.options.language) : h.format(t, "D", this.options.language),
      Month_lower: h.format(t, "MMMM", this.options.language),
      Year_lower: h.format(t, "YYYY", this.options.language),
      Hour_upper: t.getDate() !== s.getDate() ? h.format(t, "D MMMM", this.options.language) : "",
      "Quarter Day_upper": t.getDate() !== s.getDate() ? h.format(t, "D MMM", this.options.language) : "",
      "Half Day_upper": t.getDate() !== s.getDate() ? t.getMonth() !== s.getMonth() ? h.format(
        t,
        "D MMM",
        this.options.language
      ) : h.format(t, "D", this.options.language) : "",
      Day_upper: t.getMonth() !== s.getMonth() || !e ? h.format(t, "MMMM", this.options.language) : "",
      Week_upper: t.getMonth() !== s.getMonth() ? h.format(t, "MMMM", this.options.language) : "",
      Month_upper: t.getFullYear() !== s.getFullYear() ? h.format(t, "YYYY", this.options.language) : "",
      Year_upper: t.getFullYear() !== s.getFullYear() ? h.format(t, "YYYY", this.options.language) : ""
    };
    let i = this.view_is(d.MONTH) ? h.get_days_in_month(t) * this.options.column_width / 30 : this.options.column_width;
    const n = {
      x: e ? e.base_pos_x + e.column_width : 0,
      lower_y: this.options.header_height - 20,
      upper_y: this.options.header_height - 50
    }, a = {
      Hour_lower: i / 2,
      Hour_upper: i * 12,
      "Quarter Day_lower": i / 2,
      "Quarter Day_upper": i * 2,
      "Half Day_lower": i / 2,
      "Half Day_upper": i,
      Day_lower: i / 2,
      Day_upper: i / 2,
      Week_lower: i / 2,
      Week_upper: i * 4 / 2,
      Month_lower: i / 2,
      Month_upper: i / 2,
      Year_lower: i / 2,
      Year_upper: i * 30 / 2
    };
    return {
      date: t,
      formatted_date: h.format(t).replaceAll(" ", "_"),
      column_width: i,
      base_pos_x: n.x,
      upper_text: this.options.lower_text ? this.options.upper_text(
        t,
        this.options.view_mode,
        r[`${this.options.view_mode}_upper`]
      ) : r[`${this.options.view_mode}_upper`],
      lower_text: this.options.lower_text ? this.options.lower_text(
        t,
        this.options.view_mode,
        r[`${this.options.view_mode}_lower`]
      ) : r[`${this.options.view_mode}_lower`],
      upper_x: n.x + a[`${this.options.view_mode}_upper`],
      upper_y: n.upper_y,
      lower_x: n.x + a[`${this.options.view_mode}_lower`],
      lower_y: n.lower_y
    };
  }
  make_bars() {
    this.bars = this.tasks.map((t) => {
      const e = new C(this, t);
      return this.layers.bar.appendChild(e.group), e;
    });
  }
  make_arrows() {
    this.arrows = [];
    for (let t of this.tasks) {
      let e = [];
      e = t.dependencies.map((s) => {
        const r = this.get_task(s);
        if (!r)
          return;
        const i = new N(
          this,
          this.bars[r._index],
          // from_task
          this.bars[t._index]
          // to_task
        );
        return this.layers.arrow.appendChild(i.element), i;
      }).filter(Boolean), this.arrows = this.arrows.concat(e);
    }
  }
  map_arrows_on_bars() {
    for (let t of this.bars)
      t.arrows = this.arrows.filter((e) => e.from_task.task.id === t.task.id || e.to_task.task.id === t.task.id);
  }
  set_width() {
    const t = this.$svg.getBoundingClientRect().width, e = this.$svg.querySelector(".grid .grid-row") ? this.$svg.querySelector(".grid .grid-row").getAttribute("width") : 0;
    t < e && this.$svg.setAttribute("width", e);
  }
  set_scroll_position(t) {
    if (!t || t === "start")
      t = this.gantt_start;
    else {
      if (t === "today")
        return this.scroll_today();
      typeof t == "string" && (t = h.parse(t));
    }
    const e = this.$svg.parentElement;
    if (!e)
      return;
    const r = (h.diff(t, this.gantt_start, "hour") + 24) / this.options.step * this.options.column_width - this.options.column_width;
    e.scrollTo({ left: r, behavior: "smooth" });
  }
  scroll_today() {
    this.set_scroll_position(/* @__PURE__ */ new Date());
  }
  bind_grid_click() {
    l.on(
      this.$svg,
      this.options.popup_trigger,
      ".grid-row, .grid-header",
      () => {
        this.unselect_all(), this.hide_popup();
      }
    );
  }
  bind_bar_events() {
    let t = !1, e = 0, s = 0, r = 0, i = !1, n = !1, a = null, p = [];
    this.bar_being_dragged = null;
    function _() {
      return t || i || n;
    }
    l.on(this.$svg, "mousedown", ".bar-wrapper, .handle", (g, c) => {
      const f = l.closest(".bar-wrapper", c);
      p.forEach((b) => b.group.classList.remove("active")), c.classList.contains("left") ? i = !0 : c.classList.contains("right") ? n = !0 : c.classList.contains("bar-wrapper") && (t = !0), f.classList.add("active"), this.popup && this.popup.parent.classList.add("hidden"), e = g.offsetX, r = g.offsetY, a = f.getAttribute("data-id"), p = [
        a,
        ...this.get_all_dependent_tasks(a)
      ].map((b) => this.get_bar(b)), this.bar_being_dragged = a, p.forEach((b) => {
        const y = b.$bar;
        y.ox = y.getX(), y.oy = y.getY(), y.owidth = y.getWidth(), y.finaldx = 0;
      });
    }), l.on(this.$container, "scroll", (g) => {
      let c = document.querySelectorAll(".bar-wrapper"), f = [];
      const m = [];
      let b;
      s && (b = g.currentTarget.scrollLeft - s);
      const y = g.currentTarget.scrollLeft / this.options.column_width * this.options.step / 24;
      let x = "D MMM";
      ["Year", "Month"].includes(this.options.view_mode) ? x = "YYYY" : ["Day", "Week"].includes(this.options.view_mode) ? x = "MMMM" : this.view_is("Half Day") ? x = "D" : this.view_is("Hour") && (x = "D MMMM");
      let T = h.format(
        h.add(this.gantt_start, y, "day"),
        x
      );
      const v = Array.from(
        document.querySelectorAll(".upper-text")
      ).find(
        (w) => w.textContent === T
      );
      if (v && !v.classList.contains("current-upper")) {
        const w = document.querySelector(".current-upper");
        w && (w.classList.remove("current-upper"), w.style.left = this.upper_texts_x[w.textContent] + "px", w.style.top = this.options.header_height - 50 + "px"), v.classList.add("current-upper");
        let k = this.$svg.getBoundingClientRect();
        v.style.left = k.x + this.$container.scrollLeft + 10 + "px", v.style.top = k.y + this.options.header_height - 50 + "px";
      }
      Array.prototype.forEach.call(c, function(w, k) {
        m.push(w.getAttribute("data-id"));
      }), b && (f = m.map((w) => this.get_bar(w)), this.options.auto_move_label && f.forEach((w) => {
        w.update_label_position_on_horizontal_scroll({
          x: b,
          sx: g.currentTarget.scrollLeft
        });
      })), s = g.currentTarget.scrollLeft;
    }), l.on(this.$svg, "mousemove", (g) => {
      if (!_())
        return;
      const c = g.offsetX - e;
      g.offsetY - r, p.forEach((f) => {
        const m = f.$bar;
        m.finaldx = this.get_snap_position(c), this.hide_popup(), i ? a === f.task.id ? f.update_bar_position({
          x: m.ox + m.finaldx,
          width: m.owidth - m.finaldx
        }) : f.update_bar_position({
          x: m.ox + m.finaldx
        }) : n ? a === f.task.id && f.update_bar_position({
          width: m.owidth + m.finaldx
        }) : t && !this.options.readonly && f.update_bar_position({ x: m.ox + m.finaldx });
      });
    }), document.addEventListener("mouseup", (g) => {
      t = !1, i = !1, n = !1;
    }), l.on(this.$svg, "mouseup", (g) => {
      this.bar_being_dragged = null, p.forEach((c) => {
        c.$bar.finaldx && (c.date_changed(), c.set_action_completed());
      });
    }), this.bind_bar_progress();
  }
  bind_bar_progress() {
    let t = 0, e = 0, s = null, r = null, i = null, n = null;
    l.on(this.$svg, "mousedown", ".handle.progress", (a, p) => {
      s = !0, t = a.offsetX, e = a.offsetY;
      const g = l.closest(".bar-wrapper", p).getAttribute("data-id");
      r = this.get_bar(g), i = r.$bar_progress, n = r.$bar, i.finaldx = 0, i.owidth = i.getWidth(), i.min_dx = -i.getWidth(), i.max_dx = n.getWidth() - i.getWidth();
    }), l.on(this.$svg, "mousemove", (a) => {
      if (!s)
        return;
      let p = a.offsetX - t;
      a.offsetY - e, p > i.max_dx && (p = i.max_dx), p < i.min_dx && (p = i.min_dx);
      const _ = r.$handle_progress;
      l.attr(i, "width", i.owidth + p), l.attr(_, "points", r.get_progress_polygon_points()), i.finaldx = p;
    }), l.on(this.$svg, "mouseup", () => {
      s = !1, i && i.finaldx && (i.finaldx = 0, r.progress_changed(), r.set_action_completed(), r = null, i = null, n = null);
    });
  }
  get_all_dependent_tasks(t) {
    let e = [], s = [t];
    for (; s.length; ) {
      const r = s.reduce((i, n) => (i = i.concat(this.dependency_map[n]), i), []);
      e = e.concat(r), s = r.filter((i) => !s.includes(i));
    }
    return e.filter(Boolean);
  }
  get_snap_position(t) {
    let e = t, s, r;
    return this.view_is(d.WEEK) ? (s = t % (this.options.column_width / 7), r = e - s + (s < this.options.column_width / 14 ? 0 : this.options.column_width / 7)) : this.view_is(d.MONTH) ? (s = t % (this.options.column_width / 30), r = e - s + (s < this.options.column_width / 60 ? 0 : this.options.column_width / 30)) : (s = t % this.options.column_width, r = e - s + (s < this.options.column_width / 2 ? 0 : this.options.column_width)), r;
  }
  unselect_all() {
    [...this.$svg.querySelectorAll(".bar-wrapper")].forEach((t) => {
      t.classList.remove("active");
    }), this.popup && this.popup.parent.classList.remove("hidden");
  }
  view_is(t) {
    return typeof t == "string" ? this.options.view_mode === t : Array.isArray(t) ? t.some((e) => this.options.view_mode === e) : !1;
  }
  get_task(t) {
    return this.tasks.find((e) => e.id === t);
  }
  get_bar(t) {
    return this.bars.find((e) => e.task.id === t);
  }
  show_popup(t) {
    this.options.popup !== !1 && (this.popup || (this.popup = new R(this.$popup_wrapper, this.options.popup)), this.popup.show(t));
  }
  hide_popup() {
    this.popup && this.popup.hide();
  }
  trigger_event(t, e) {
    this.options["on_" + t] && this.options["on_" + t].apply(null, e);
  }
  /**
   * Gets the oldest starting date from the list of tasks
   *
   * @returns Date
   * @memberof Gantt
   */
  get_oldest_starting_date() {
    return this.tasks.length ? this.tasks.map((t) => t._start).reduce(
      (t, e) => e <= t ? e : t
    ) : /* @__PURE__ */ new Date();
  }
  /**
   * Clear all elements from the parent svg element
   *
   * @memberof Gantt
   */
  clear() {
    var t, e, s, r, i, n;
    this.$svg.innerHTML = "", (e = (t = this.$header) == null ? void 0 : t.remove) == null || e.call(t), (r = (s = this.$current_highlight) == null ? void 0 : s.remove) == null || r.call(s), (n = (i = this.popup) == null ? void 0 : i.hide) == null || n.call(i);
  }
}
q.VIEW_MODE = d;
function z(o) {
  return o.name + "_" + Math.random().toString(36).slice(2, 12);
}
export {
  q as default
};
