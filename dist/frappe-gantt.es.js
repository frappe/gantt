const k = "year", D = "month", $ = "day", E = "hour", Y = "minute", A = "second", L = "millisecond", S = {
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
  parse_duration(n) {
    const e = /([0-9]+)(y|m|d|h|min|s|ms)/gm.exec(n);
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
  parse(n, t = "-", e = /[.:]/) {
    if (n instanceof Date)
      return n;
    if (typeof n == "string") {
      let s, i;
      const o = n.split(" ");
      s = o[0].split(t).map((a) => parseInt(a, 10)), i = o[1] && o[1].split(e), s[1] = s[1] ? s[1] - 1 : 0;
      let r = s;
      return i && i.length && (i.length === 4 && (i[3] = "0." + i[3], i[3] = parseFloat(i[3]) * 1e3), r = r.concat(i)), new Date(...r);
    }
  },
  to_string(n, t = !1) {
    if (!(n instanceof Date))
      throw new TypeError("Invalid argument type");
    const e = this.get_date_values(n).map((o, r) => (r === 1 && (o = o + 1), r === 6 ? v(o + "", 3, "0") : v(o + "", 2, "0"))), s = `${e[0]}-${e[1]}-${e[2]}`, i = `${e[3]}:${e[4]}:${e[5]}.${e[6]}`;
    return s + (t ? " " + i : "");
  },
  format(n, t = "YYYY-MM-DD HH:mm:ss.SSS", e = "en") {
    const i = new Intl.DateTimeFormat(e, {
      month: "long"
    }).format(n), o = i.charAt(0).toUpperCase() + i.slice(1), r = this.get_date_values(n).map((g) => v(g, 2, 0)), a = {
      YYYY: r[0],
      MM: v(+r[1] + 1, 2, 0),
      DD: r[2],
      HH: r[3],
      mm: r[4],
      ss: r[5],
      SSS: r[6],
      D: r[2],
      MMMM: o,
      MMM: S[o]
    };
    let p = t;
    const d = [];
    return Object.keys(a).sort((g, c) => c.length - g.length).forEach((g) => {
      p.includes(g) && (p = p.replaceAll(g, `$${d.length}`), d.push(a[g]));
    }), d.forEach((g, c) => {
      p = p.replaceAll(`$${c}`, g);
    }), p;
  },
  diff(n, t, e = $) {
    let s, i, o, r, a, p, d;
    s = n - t, i = s / 1e3, r = i / 60, o = r / 60, a = o / 24;
    const g = n.getFullYear() - t.getFullYear(), c = n.getMonth() - t.getMonth();
    return p = g * 12 + c, n.getDate() < t.getDate() && p--, d = p / 12, e.endsWith("s") || (e += "s"), Math.floor(
      {
        milliseconds: s,
        seconds: i,
        minutes: r,
        hours: o,
        days: a,
        months: p,
        years: d
      }[e]
    );
  },
  today() {
    const n = this.get_date_values(/* @__PURE__ */ new Date()).slice(0, 3);
    return new Date(...n);
  },
  now() {
    return /* @__PURE__ */ new Date();
  },
  add(n, t, e) {
    t = parseInt(t, 10);
    const s = [
      n.getFullYear() + (e === k ? t : 0),
      n.getMonth() + (e === D ? t : 0),
      n.getDate() + (e === $ ? t : 0),
      n.getHours() + (e === E ? t : 0),
      n.getMinutes() + (e === Y ? t : 0),
      n.getSeconds() + (e === A ? t : 0),
      n.getMilliseconds() + (e === L ? t : 0)
    ];
    return new Date(...s);
  },
  start_of(n, t) {
    const e = {
      [k]: 6,
      [D]: 5,
      [$]: 4,
      [E]: 3,
      [Y]: 2,
      [A]: 1,
      [L]: 0
    };
    function s(o) {
      const r = e[t];
      return e[o] <= r;
    }
    const i = [
      n.getFullYear(),
      s(k) ? 0 : n.getMonth(),
      s(D) ? 1 : n.getDate(),
      s($) ? 0 : n.getHours(),
      s(E) ? 0 : n.getMinutes(),
      s(Y) ? 0 : n.getSeconds(),
      s(A) ? 0 : n.getMilliseconds()
    ];
    return new Date(...i);
  },
  clone(n) {
    return new Date(...this.get_date_values(n));
  },
  get_date_values(n) {
    return [
      n.getFullYear(),
      n.getMonth(),
      n.getDate(),
      n.getHours(),
      n.getMinutes(),
      n.getSeconds(),
      n.getMilliseconds()
    ];
  },
  get_days_in_month(n) {
    const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = n.getMonth();
    if (e !== 1)
      return t[e];
    const s = n.getFullYear();
    return s % 4 === 0 && s % 100 != 0 || s % 400 === 0 ? 29 : 28;
  }
};
function v(n, t, e) {
  return n = n + "", t = t >> 0, e = String(typeof e < "u" ? e : " "), n.length > t ? String(n) : (t = t - n.length, t > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(n));
}
function _(n, t) {
  return typeof n == "string" ? (t || document).querySelector(n) : n || null;
}
function u(n, t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let s in t)
    s === "append_to" ? t.append_to.appendChild(e) : s === "innerHTML" ? e.innerHTML = t.innerHTML : s === "clipPath" ? e.setAttribute("clip-path", "url(#" + t[s] + ")") : e.setAttribute(s, t[s]);
  return e;
}
function H(n, t, e, s) {
  const i = W(n, t, e, s);
  if (i === n) {
    const o = document.createEvent("HTMLEvents");
    o.initEvent("click", !0, !0), o.eventName = "click", i.dispatchEvent(o);
  }
}
function W(n, t, e, s, i = "0.4s", o = "0.1s") {
  const r = n.querySelector("animate");
  if (r)
    return _.attr(r, {
      attributeName: t,
      from: e,
      to: s,
      dur: i,
      begin: "click + " + o
      // artificial click
    }), n;
  const a = u("animate", {
    attributeName: t,
    from: e,
    to: s,
    dur: i,
    begin: o,
    calcMode: "spline",
    values: e + ";" + s,
    keyTimes: "0; 1",
    keySplines: X("ease-out")
  });
  return n.appendChild(a), n;
}
function X(n) {
  return {
    ease: ".25 .1 .25 1",
    linear: "0 0 1 1",
    "ease-in": ".42 0 1 1",
    "ease-out": "0 0 .58 1",
    "ease-in-out": ".42 0 .58 1"
  }[n];
}
_.on = (n, t, e, s) => {
  s ? _.delegate(n, t, e, s) : (s = e, _.bind(n, t, s));
};
_.off = (n, t, e) => {
  n.removeEventListener(t, e);
};
_.bind = (n, t, e) => {
  t.split(/\s+/).forEach(function(s) {
    n.addEventListener(s, e);
  });
};
_.delegate = (n, t, e, s) => {
  n.addEventListener(t, function(i) {
    const o = i.target.closest(e);
    o && (i.delegatedTarget = o, s.call(this, i, o));
  });
};
_.closest = (n, t) => t ? t.matches(n) ? t : _.closest(n, t.parentNode) : null;
_.attr = (n, t, e) => {
  if (!e && typeof t == "string")
    return n.getAttribute(t);
  if (typeof t == "object") {
    for (let s in t)
      _.attr(n, s, t[s]);
    return;
  }
  n.setAttribute(t, e);
};
class O {
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
    }), H(this.$bar, "width", 0, this.width), this.invalid && this.$bar.classList.add("bar-invalid");
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
    }), H(
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
    e.id = `${this.task.id}-highlight`, e.classList.add("date-highlight"), e.style.height = this.height * 0.8 + "px", e.style.width = this.width + "px", e.style.top = this.gantt.options.header_height - 25 + "px", e.style.left = t + "px", this.$date_highlight = e, this.gantt.$lower_header.prepend(e), H(this.$bar_progress, "width", 0, this.progress_width);
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
    let t = 10, e = 2, s, i;
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
    }), i = u("clipPath", {
      id: "clip_" + this.task.id,
      append_to: s
    }), u("use", {
      href: "#rect_" + this.task.id,
      append_to: i
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
    if (this.gantt.options.dates_readonly || (u("rect", {
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
    })), !this.gantt.options.progress_readonly) {
      const s = this.$bar_progress;
      this.$handle_progress = u("circle", {
        cx: s.getEndX(),
        cy: s.getY() + s.getHeight() / 2,
        r: 5,
        class: "handle progress",
        append_to: this.handle_group
      });
    }
  }
  bind() {
    this.invalid || this.setup_click_event();
  }
  setup_click_event() {
    let t = this.task.id;
    if (_.on(this.group, "mouseover", (e) => {
      this.gantt.trigger_event("hover", [
        this.task,
        e.screenX,
        e.screenY,
        e
      ]);
    }), this.gantt.options.popup_on === "click") {
      let e = !1;
      _.on(this.group, "click", (s) => {
        console.log(e), e ? this.gantt.hide_popup() : (this.show_popup(s.offsetX || s.layerX), document.getElementById(
          `${t}-highlight`
        ).style.display = "block"), e = !e;
      });
    } else {
      let e;
      _.on(
        this.group,
        "mouseenter",
        (s) => e = setTimeout(() => {
          this.show_popup(s.offsetX || s.layerX), document.getElementById(
            `${t}-highlight`
          ).style.display = "block";
        }, 200)
      ), _.on(this.group, "mouseleave", () => {
        var s, i;
        clearTimeout(e), (i = (s = this.gantt.popup) == null ? void 0 : s.hide) == null || i.call(s), document.getElementById(`${t}-highlight`).style.display = "none";
      });
    }
    _.on(this.group, "click", () => {
      this.gantt.trigger_event("click", [this.task]);
    }), _.on(this.group, "dblclick", (e) => {
      this.action_completed || (this.group.classList.remove("active"), this.gantt.popup && this.gantt.popup.parent.classList.remove("hidden"), this.gantt.trigger_event("double_click", [this.task]));
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
    ), i = `${e} -  ${s}<br/>Progress: ${this.task.progress}`;
    this.gantt.show_popup({
      x: t,
      target_element: this.$bar,
      title: this.task.name,
      subtitle: i,
      task: this.task
    });
  }
  update_bar_position({ x: t = null, width: e = null }) {
    const s = this.$bar;
    if (t) {
      if (!this.task.dependencies.map((r) => this.gantt.get_bar(r).$bar.getX()).reduce((r, a) => t >= a, t)) {
        e = null;
        return;
      }
      this.update_attr(s, "x", t), this.$date_highlight.style.left = t + "px";
    }
    e && (this.update_attr(s, "width", e), this.$date_highlight.style.width = e + "px"), this.update_label_position(), this.update_handle_position(), this.gantt.options.show_expected_progress && (this.date_changed(), this.compute_duration(), this.update_expected_progressbar_position()), this.update_progressbar_position(), this.update_arrow_position();
  }
  update_label_position_on_horizontal_scroll({ x: t, sx: e }) {
    const s = document.querySelector(".gantt-container"), i = this.group.querySelector(".bar-label"), o = this.group.querySelector(".bar-img") || "", r = this.bar_group.querySelector(".img_mask") || "";
    let a = this.$bar.getX() + this.$bar.getWidth(), p = i.getX() + t, d = o && o.getX() + t || 0, g = o && o.getBBox().width + 7 || 7, c = p + i.getBBox().width + 7, f = e + s.clientWidth / 2;
    i.classList.contains("big") || (c < a && t > 0 && c < f || p - g > this.$bar.getX() && t < 0 && c > f) && (i.setAttribute("x", p), o && (o.setAttribute("x", d), r.setAttribute("x", d)));
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
    const t = this.$bar, e = t.getX() / this.gantt.options.column_width;
    let s = h.add(
      this.gantt.gantt_start,
      e * this.gantt.options.step,
      "hour"
    );
    const i = this.gantt.gantt_start.getTimezoneOffset() - s.getTimezoneOffset();
    i && (s = h.add(
      s,
      i,
      "minute"
    ));
    const o = t.getWidth() / this.gantt.options.column_width, r = h.add(
      s,
      o * this.gantt.options.step,
      "hour"
    );
    return { new_start_date: s, new_end_date: r };
  }
  compute_progress() {
    const t = this.$bar_progress.getWidth() / this.$bar.getWidth() * 100;
    return parseInt(t, 10);
  }
  compute_expected_progress() {
    this.expected_progress = h.diff(h.today(), this.task._start, "hour") / this.gantt.options.step, this.expected_progress = (this.expected_progress < this.duration ? this.expected_progress : this.duration) * 100 / this.duration;
  }
  compute_x() {
    const { step: t, column_width: e } = this.gantt.options, s = this.task._start, i = this.gantt.gantt_start;
    let r = h.diff(s, i, "hour") / t * e;
    if (this.gantt.view_is("Month")) {
      const a = h.diff(s, i, "month") * 30, p = Math.min(
        29,
        h.format(s, "DD")
      );
      r = (a + p) * e / 30;
    }
    this.x = r;
  }
  compute_y() {
    this.y = this.gantt.options.header_height + this.gantt.options.padding + this.task._index * (this.height + this.gantt.options.padding);
  }
  compute_duration() {
    this.duration = h.diff(this.task._end, this.task._start, "hour") / this.gantt.options.step;
  }
  get_snap_position(t) {
    let e = t, s, i;
    return this.gantt.view_is("Week") ? (s = t % (this.gantt.options.column_width / 7), i = e - s + (s < this.gantt.options.column_width / 14 ? 0 : this.gantt.options.column_width / 7)) : this.gantt.view_is("Month") ? (s = t % (this.gantt.options.column_width / 30), i = e - s + (s < this.gantt.options.column_width / 60 ? 0 : this.gantt.options.column_width / 30)) : (s = t % this.gantt.options.column_width, i = e - s + (s < this.gantt.options.column_width / 2 ? 0 : this.gantt.options.column_width)), i;
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
    const t = this.bar_group.querySelector(".img_mask") || "", e = this.$bar, s = this.group.querySelector(".bar-label"), i = this.group.querySelector(".bar-img");
    let o = 5, r = this.image_size + 10;
    const a = s.getBBox().width, p = e.getWidth();
    a > p ? (s.classList.add("big"), i ? (i.setAttribute("x", e.getX() + e.getWidth() + o), t.setAttribute(
      "x",
      e.getX() + e.getWidth() + o
    ), s.setAttribute(
      "x",
      e.getX() + e.getWidth() + r
    )) : s.setAttribute("x", e.getX() + e.getWidth() + o)) : (s.classList.remove("big"), i ? (i.setAttribute("x", e.getX() + o), t.setAttribute("x", e.getX() + o), s.setAttribute(
      "x",
      e.getX() + p / 2 + r
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
    e && e.setAttribute("cx", this.$bar_progress.getEndX());
  }
  update_arrow_position() {
    this.arrows = this.arrows || [];
    for (let t of this.arrows)
      t.update();
  }
}
class C {
  constructor(t, e, s) {
    this.gantt = t, this.from_task = e, this.to_task = s, this.calculate_path(), this.draw();
  }
  calculate_path() {
    let t = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
    const e = () => this.to_task.$bar.getX() < t + this.gantt.options.padding && t > this.from_task.$bar.getX() + this.gantt.options.padding;
    for (; e(); )
      t -= 10;
    const s = this.gantt.options.header_height + this.gantt.options.bar_height + (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index + this.gantt.options.padding, i = this.to_task.$bar.getX() - this.gantt.options.padding / 2 - 7, o = this.gantt.options.header_height + this.gantt.options.bar_height / 2 + (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index + this.gantt.options.padding, r = this.from_task.task._index > this.to_task.task._index, a = this.gantt.options.arrow_curve, p = r ? 1 : 0, d = r ? -a : a, g = r ? o + this.gantt.options.arrow_curve : o - this.gantt.options.arrow_curve;
    if (this.path = `
            M ${t} ${s}
            V ${g}
            a ${a} ${a} 0 0 ${p} ${a} ${d}
            L ${i} ${o}
            m -5 -5
            l 5 5
            l -5 5`, this.to_task.$bar.getX() < this.from_task.$bar.getX() + this.gantt.options.padding) {
      const c = this.gantt.options.padding / 2 - a, f = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - d, w = this.to_task.$bar.getX() - this.gantt.options.padding;
      this.path = `
                M ${t} ${s}
                v ${c}
                a ${a} ${a} 0 0 1 -${a} ${a}
                H ${w}
                a ${a} ${a} 0 0 ${p} -${a} ${d}
                V ${f}
                a ${a} ${a} 0 0 ${p} ${a} ${d}
                L ${i} ${o}
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
class N {
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
      let i = this.custom_html(t.task);
      i += '<div class="pointer"></div>', this.parent.innerHTML = i, this.pointer = this.parent.querySelector(".pointer");
    } else
      this.title.innerHTML = t.title, this.subtitle.innerHTML = t.subtitle;
    console.log("hey in");
    let s;
    e instanceof HTMLElement ? s = e.getBoundingClientRect() : e instanceof SVGElement && (s = t.target_element.getBBox()), this.parent.style.left = t.x - this.parent.clientWidth / 2 + "px", this.parent.style.top = s.y + s.height + 10 + "px", this.parent.classList.remove("hidden"), this.pointer.style.left = this.parent.clientWidth / 2 + "px", this.pointer.style.top = "-15px", this.parent.style.opacity = 1;
  }
  hide() {
    this.parent.style.opacity = 0, this.parent.style.left = 0;
  }
}
const l = {
  HOUR: "Hour",
  QUARTER_DAY: "Quarter Day",
  HALF_DAY: "Half Day",
  DAY: "Day",
  WEEK: "Week",
  MONTH: "Month",
  YEAR: "Year"
}, R = {
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
  view_modes: [...Object.values(l)],
  bar_height: 30,
  bar_corner_radius: 3,
  arrow_curve: 5,
  padding: 18,
  view_mode: "Day",
  date_format: "YYYY-MM-DD",
  show_expected_progress: !1,
  popup: null,
  popup_on: "hover",
  language: "en",
  readonly: !1,
  progress_readonly: !1,
  dates_readonly: !1,
  highlight_weekend: !0,
  scroll_to: "start",
  lines: "both",
  auto_move_label: !0,
  today_button: !0,
  view_mode_select: !1
};
class B {
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
        "Frappe Gantt only supports usage of a string CSS selector, HTML DOM element or SVG DOM element for the 'element' parameter"
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
      ...R,
      ...t.view_mode_padding
    };
  }
  setup_tasks(t) {
    this.tasks = t.map((e, s) => {
      if (e._start = h.parse(e.start), e.end === void 0 && e.duration !== void 0 && (e.end = e._start, e.duration.split(" ").forEach((a) => {
        let { duration: p, scale: d } = h.parse_duration(a);
        e.end = h.add(e.end, p, d);
      })), e._end = h.parse(e.end), h.diff(e._end, e._start, "year") < 0)
        throw Error(
          "start of task can't be after end of task: in task #, " + (s + 1)
        );
      if (h.diff(e._end, e._start, "year") > 10 && (e.end = null), e._index = s, !e.start && !e.end) {
        const r = h.today();
        e._start = r, e._end = h.add(r, 2, "day");
      }
      if (!e.start && e.end && (e._start = h.add(e._end, -2, "day")), e.start && !e.end && (e._end = h.add(e._start, 2, "day")), h.get_date_values(e._end).slice(3).every((r) => r === 0) && (e._end = h.add(e._end, 24, "hour")), (!e.start || !e.end) && (e.invalid = !0), typeof e.dependencies == "string" || !e.dependencies) {
        let r = [];
        e.dependencies && (r = e.dependencies.split(",").map((a) => a.trim().replaceAll(" ", "_")).filter((a) => a)), e.dependencies = r;
      }
      return e.id ? typeof e.id == "string" ? e.id = e.id.replaceAll(" ", "_") : e.id = `${e.id}` : e.id = F(e), e;
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
    this.options.view_mode = t, t === l.HOUR ? (this.options.step = 24 / 24, this.options.column_width = 38) : t === l.DAY ? (this.options.step = 24, this.options.column_width = 38) : t === l.HALF_DAY ? (this.options.step = 24 / 2, this.options.column_width = 38) : t === l.QUARTER_DAY ? (this.options.step = 24 / 4, this.options.column_width = 38) : t === l.WEEK ? (this.options.step = 24 * 7, this.options.column_width = 140) : t === l.MONTH ? (this.options.step = 24 * 30, this.options.column_width = 120) : t === l.YEAR && (this.options.step = 24 * 365, this.options.column_width = 120);
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
    for (let [a, p] of Object.entries(l))
      p === this.options.view_mode && (s = a);
    const [i, o] = this.options.view_mode_padding[s].map(h.parse_duration);
    t = h.add(
      t,
      -i.duration,
      i.scale
    );
    let r;
    this.view_is(l.YEAR) ? r = "YYYY" : this.view_is(l.MONTH) ? r = "YYYY-MM" : this.view_is(l.DAY) ? r = "YYYY-MM-DD" : r = "YYYY-MM-DD HH", this.gantt_start = h.parse(
      h.format(t, r)
    ), this.gantt_start.setHours(0, 0, 0, 0), this.gantt_end = h.add(
      e,
      o.duration,
      o.scale
    );
  }
  setup_date_values() {
    this.dates = [];
    let t = null;
    for (; t === null || t < this.gantt_end; )
      t ? this.view_is(l.YEAR) ? t = h.add(t, 1, "year") : this.view_is(l.MONTH) ? t = h.add(t, 1, "month") : t = h.add(
        t,
        this.options.step,
        "hour"
      ) : t = h.clone(this.gantt_start), this.dates.push(t);
  }
  bind_events() {
    this.options.readonly || (this.bind_grid_click(), this.bind_bar_events());
  }
  render() {
    this.clear(), this.setup_layers(), this.make_grid(), this.make_dates(), this.make_bars(), this.make_grid_extras(), this.make_arrows(), this.map_arrows_on_bars(), this.set_width(), this.set_scroll_position(this.options.scroll_to), this.update_button_position();
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
    }), _.attr(this.$svg, {
      height: e + this.options.padding + 100,
      width: "100%"
    });
  }
  make_grid_rows() {
    const t = u("g", { append_to: this.layers.grid }), e = this.dates.length * this.options.column_width, s = this.options.bar_height + this.options.padding;
    let i = this.options.header_height + this.options.padding / 2;
    for (let o of this.tasks)
      u("rect", {
        x: 0,
        y: i,
        width: e,
        height: s,
        class: "grid-row",
        append_to: t
      }), this.options.lines === "both" || this.options.lines, i += this.options.bar_height + this.options.padding;
  }
  make_grid_header() {
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
      const e = document.createElement("select");
      e.classList.add("viewmode-select");
      const s = document.createElement("option");
      s.selected = !0, s.disabled = !0, s.textContent = "Mode", e.appendChild(s);
      for (const i in l) {
        const o = document.createElement("option");
        o.value = l[i], o.textContent = l[i], e.appendChild(o);
      }
      e.addEventListener(
        "change",
        (function() {
          this.change_view_mode(e.value);
        }).bind(this)
      ), t.appendChild(e);
    }
    if (this.options.today_button) {
      let e = document.createElement("button");
      e.classList.add("today-button"), e.textContent = "Today", e.onclick = this.scroll_today.bind(this), t.appendChild(e), this.$today_button = e;
    }
    this.$header.appendChild(t), this.$side_header = t, window.addEventListener(
      "scroll",
      this.update_button_position.bind(this)
    ), window.addEventListener(
      "resize",
      this.update_button_position.bind(this)
    );
  }
  update_button_position() {
    const t = this.$container.getBoundingClientRect(), e = this.$side_header.getBoundingClientRect(), { left: s, y: i } = this.$header.getBoundingClientRect();
    e.top < t.top || e.bottom > t.bottom ? (this.$side_header.style.position = "absolute", this.$side_header.style.top = `${t.scrollTop + e.top}px`) : (this.$side_header.style.position = "fixed", this.$side_header.style.top = i + 10 + "px");
    const o = Math.min(
      this.$header.clientWidth,
      this.$container.clientWidth
    );
    this.$side_header.style.left = s + this.$container.scrollLeft + o - this.$side_header.clientWidth + "px", this.$today_button && (this.$today_button.style.left = `${t.left + 20}px`);
  }
  make_grid_ticks() {
    if (!["both", "vertical", "horizontal"].includes(this.options.lines))
      return;
    let t = 0, e = this.options.header_height + this.options.padding / 2, s = (this.options.bar_height + this.options.padding) * this.tasks.length, i = u("g", {
      class: "lines_layer",
      append_to: this.layers.grid
    }), o = this.options.header_height + this.options.padding / 2;
    const r = this.dates.length * this.options.column_width, a = this.options.bar_height + this.options.padding;
    if (this.options.lines !== "vertical")
      for (let p of this.tasks)
        u("line", {
          x1: 0,
          y1: o + a,
          x2: r,
          y2: o + a,
          class: "row-line",
          append_to: i
        }), o += a;
    if (this.options.lines !== "horizontal")
      for (let p of this.dates) {
        let d = "tick";
        this.view_is(l.DAY) && p.getDate() === 1 && (d += " thick"), this.view_is(l.WEEK) && p.getDate() >= 1 && p.getDate() < 8 && (d += " thick"), this.view_is(l.MONTH) && p.getMonth() % 3 === 0 && (d += " thick"), u("path", {
          d: `M ${t} ${e} v ${s}`,
          class: d,
          append_to: this.layers.grid
        }), this.view_is(l.MONTH) ? t += h.get_days_in_month(p) * this.options.column_width / 30 : t += this.options.column_width;
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
    if (this.view_is(l.DAY)) {
      let s = h.today();
      return {
        x: e + h.diff(s, this.gantt_start, "hour") / this.options.step * this.options.column_width,
        date: s
      };
    }
    for (let s of this.dates) {
      const i = /* @__PURE__ */ new Date(), o = new Date(s), r = new Date(s);
      switch (t) {
        case l.WEEK:
          r.setDate(s.getDate() + 7);
          break;
        case l.MONTH:
          r.setMonth(s.getMonth() + 1);
          break;
        case l.YEAR:
          r.setFullYear(s.getFullYear() + 1);
          break;
      }
      if (i >= o && i <= r)
        return { x: e, date: o };
      e += this.options.column_width;
    }
    return { x: e };
  }
  make_grid_highlights() {
    if (this.options.highlight_weekend && this.highlightWeekends(), this.view_is(l.DAY) || this.view_is(l.WEEK) || this.view_is(l.MONTH) || this.view_is(l.YEAR)) {
      const { x: t, date: e } = this.computeGridHighlightDimensions(
        this.options.view_mode
      );
      if (!e || !this.dates.find((r) => r.getTime() == e.getTime()))
        return;
      const s = this.options.header_height + this.options.padding / 2, i = (this.options.bar_height + this.options.padding) * this.tasks.length;
      this.$current_highlight = this.create_el({
        top: s,
        left: t,
        height: i,
        classes: "current-highlight",
        append_to: this.$container
      });
      let o = document.getElementById(
        h.format(e).replaceAll(" ", "_")
      );
      o && (o.classList.add("current-date-highlight"), o.style.top = +o.style.top.slice(0, -2) - 4 + "px", o.style.left = +o.style.left.slice(0, -2) - 8 + "px");
    }
  }
  create_el({ left: t, top: e, width: s, height: i, id: o, classes: r, append_to: a }) {
    let p = document.createElement("div");
    return p.classList.add(r), p.style.top = e + "px", p.style.left = t + "px", o && (p.id = o), s && (p.style.width = i + "px"), i && (p.style.height = i + "px"), a.appendChild(p), p;
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
      if (s.innerText = t.lower_text, s.style.left = +s.style.left.slice(0, -2) + "px", t.upper_text) {
        this.upper_texts_x[t.upper_text] = t.upper_x;
        let i = document.createElement("div");
        i.classList.add("upper-text"), i.style.left = t.upper_x + "px", i.style.top = t.upper_y + "px", i.innerText = t.upper_text, this.$upper_header.appendChild(i), t.upper_x > this.layers.grid.getBBox().width && i.remove();
      }
    });
  }
  get_dates_to_draw() {
    let t = null;
    return this.dates.map((s, i) => {
      const o = this.get_date_info(s, t, i);
      return t = o, o;
    });
  }
  get_date_info(t, e) {
    let s = e ? e.date : h.add(t, 1, "day");
    const i = {
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
    let o = this.view_is(l.MONTH) ? h.get_days_in_month(t) * this.options.column_width / 30 : this.options.column_width;
    const r = {
      x: e ? e.base_pos_x + e.column_width : 0,
      lower_y: this.options.header_height - 20,
      upper_y: this.options.header_height - 50
    }, a = {
      Hour_lower: o / 2,
      Hour_upper: o * 12,
      "Quarter Day_lower": o / 2,
      "Quarter Day_upper": o * 2,
      "Half Day_lower": o / 2,
      "Half Day_upper": o,
      Day_lower: o / 2,
      Day_upper: o / 2,
      Week_lower: o / 2,
      Week_upper: o * 4 / 2,
      Month_lower: o / 2,
      Month_upper: o / 2,
      Year_lower: o / 2,
      Year_upper: o * 30 / 2
    };
    return {
      date: t,
      formatted_date: h.format(t).replaceAll(" ", "_"),
      column_width: o,
      base_pos_x: r.x,
      upper_text: this.options.lower_text ? this.options.upper_text(
        t,
        this.options.view_mode,
        i[`${this.options.view_mode}_upper`]
      ) : i[`${this.options.view_mode}_upper`],
      lower_text: this.options.lower_text ? this.options.lower_text(
        t,
        this.options.view_mode,
        i[`${this.options.view_mode}_lower`]
      ) : i[`${this.options.view_mode}_lower`],
      upper_x: r.x + a[`${this.options.view_mode}_upper`],
      upper_y: r.upper_y,
      lower_x: r.x + a[`${this.options.view_mode}_lower`],
      lower_y: r.lower_y
    };
  }
  make_bars() {
    this.bars = this.tasks.map((t) => {
      const e = new O(this, t);
      return this.layers.bar.appendChild(e.group), e;
    });
  }
  make_arrows() {
    this.arrows = [];
    for (let t of this.tasks) {
      let e = [];
      e = t.dependencies.map((s) => {
        const i = this.get_task(s);
        if (!i)
          return;
        const o = new C(
          this,
          this.bars[i._index],
          // from_task
          this.bars[t._index]
          // to_task
        );
        return this.layers.arrow.appendChild(o.element), o;
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
    const i = (h.diff(t, this.gantt_start, "hour") + 24) / this.options.step * this.options.column_width - this.options.column_width;
    e.scrollTo({ left: i, behavior: "smooth" });
  }
  scroll_today() {
    this.set_scroll_position(/* @__PURE__ */ new Date());
  }
  bind_grid_click() {
    _.on(this.$svg, "click", ".grid-row, .grid-header", () => {
      this.unselect_all(), this.hide_popup();
    });
  }
  bind_bar_events() {
    let t = !1, e = 0, s = 0, i = !1, o = !1, r = null, a = [];
    this.bar_being_dragged = null;
    function p() {
      return t || i || o;
    }
    this.$svg.onclick = (d) => {
      d.target.classList.contains("grid-row") && this.unselect_all();
    }, _.on(this.$svg, "mousedown", ".bar-wrapper, .handle", (d, g) => {
      const c = _.closest(".bar-wrapper", g);
      a.forEach((w) => w.group.classList.remove("active")), g.classList.contains("left") ? i = !0 : g.classList.contains("right") ? o = !0 : g.classList.contains("bar-wrapper") && (t = !0), c.classList.add("active"), this.popup && this.popup.parent.classList.add("hidden"), this.popup && this.popup.parent.classList.add("hidden"), e = d.offsetX || d.layerX, d.offsetY || d.layerY, r = c.getAttribute("data-id"), a = [
        r,
        ...this.get_all_dependent_tasks(r)
      ].map((w) => this.get_bar(w)), this.bar_being_dragged = r, a.forEach((w) => {
        const b = w.$bar;
        b.ox = b.getX(), b.oy = b.getY(), b.owidth = b.getWidth(), b.finaldx = 0;
      });
    }), _.on(this.$container, "scroll", (d) => {
      let g = document.querySelectorAll(".bar-wrapper"), c = [];
      const f = [];
      let w;
      s && (w = d.currentTarget.scrollLeft - s);
      const b = d.currentTarget.scrollLeft / this.options.column_width * this.options.step / 24;
      let y = "D MMM";
      ["Year", "Month"].includes(this.options.view_mode) ? y = "YYYY" : ["Day", "Week"].includes(this.options.view_mode) ? y = "MMMM" : this.view_is("Half Day") ? y = "D" : this.view_is("Hour") && (y = "D MMMM");
      let T = h.format(
        h.add(this.gantt_start, b, "day"),
        y
      );
      const x = Array.from(
        document.querySelectorAll(".upper-text")
      ).find(
        (m) => m.textContent === T
      );
      if (x && !x.classList.contains("current-upper")) {
        const m = document.querySelector(".current-upper");
        m && (m.classList.remove("current-upper"), m.style.left = this.upper_texts_x[m.textContent] + "px", m.style.top = this.options.header_height - 50 + "px"), x.classList.add("current-upper");
        let M = this.$svg.getBoundingClientRect();
        x.style.left = M.x + this.$container.scrollLeft + 10 + "px", x.style.top = M.y + this.options.header_height - 50 + "px";
      }
      Array.prototype.forEach.call(g, function(m, M) {
        f.push(m.getAttribute("data-id"));
      }), w && (c = f.map((m) => this.get_bar(m)), this.options.auto_move_label && c.forEach((m) => {
        m.update_label_position_on_horizontal_scroll({
          x: w,
          sx: d.currentTarget.scrollLeft
        });
      })), s = d.currentTarget.scrollLeft;
    }), _.on(this.$svg, "mousemove", (d) => {
      if (!p())
        return;
      const g = (d.offsetX || d.layerX) - e;
      a.forEach((c) => {
        const f = c.$bar;
        f.finaldx = this.get_snap_position(g), this.hide_popup(), i ? r === c.task.id ? c.update_bar_position({
          x: f.ox + f.finaldx,
          width: f.owidth - f.finaldx
        }) : c.update_bar_position({
          x: f.ox + f.finaldx
        }) : o ? r === c.task.id && c.update_bar_position({
          width: f.owidth + f.finaldx
        }) : t && !this.options.readonly && !this.options.dates_readonly && c.update_bar_position({ x: f.ox + f.finaldx });
      });
    }), document.addEventListener("mouseup", (d) => {
      t = !1, i = !1, o = !1;
    }), _.on(this.$svg, "mouseup", (d) => {
      this.bar_being_dragged = null, a.forEach((g) => {
        g.$bar.finaldx && (g.date_changed(), g.set_action_completed());
      });
    }), this.bind_bar_progress();
  }
  bind_bar_progress() {
    let t = 0, e = null, s = null, i = null, o = null;
    _.on(this.$svg, "mousedown", ".handle.progress", (r, a) => {
      e = !0, t = r.offsetX || r.layerX, r.offsetY || r.layerY;
      const d = _.closest(".bar-wrapper", a).getAttribute("data-id");
      s = this.get_bar(d), i = s.$bar_progress, o = s.$bar, i.finaldx = 0, i.owidth = i.getWidth(), i.min_dx = -i.getWidth(), i.max_dx = o.getWidth() - i.getWidth();
    }), _.on(this.$svg, "mousemove", (r) => {
      if (!e)
        return;
      let a = (r.offsetX || r.layerX) - t;
      a > i.max_dx && (a = i.max_dx), a < i.min_dx && (a = i.min_dx);
      const p = s.$handle_progress;
      _.attr(i, "width", i.owidth + a), _.attr(p, "cx", i.getEndX()), i.finaldx = a;
    }), _.on(this.$svg, "mouseup", () => {
      e = !1, i && i.finaldx && (i.finaldx = 0, s.progress_changed(), s.set_action_completed(), s = null, i = null, o = null);
    });
  }
  get_all_dependent_tasks(t) {
    let e = [], s = [t];
    for (; s.length; ) {
      const i = s.reduce((o, r) => (o = o.concat(this.dependency_map[r]), o), []);
      e = e.concat(i), s = i.filter((o) => !s.includes(o));
    }
    return e.filter(Boolean);
  }
  get_snap_position(t) {
    let e = t, s, i;
    return this.view_is(l.WEEK) ? (s = t % (this.options.column_width / 7), i = e - s + (s < this.options.column_width / 14 ? 0 : this.options.column_width / 7)) : this.view_is(l.MONTH) ? (s = t % (this.options.column_width / 30), i = e - s + (s < this.options.column_width / 60 ? 0 : this.options.column_width / 30)) : (s = t % this.options.column_width, i = e - s + (s < this.options.column_width / 2 ? 0 : this.options.column_width)), i;
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
    this.options.popup !== !1 && (this.popup || (this.popup = new N(this.$popup_wrapper, this.options.popup)), this.popup.show(t));
  }
  hide_popup() {
    this.popup && this.popup.hide();
  }
  trigger_event(t, e) {
    this.options["on_" + t] && this.options["on_" + t].apply(this, e);
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
    var t, e, s, i, o, r;
    this.$svg.innerHTML = "", (e = (t = this.$header) == null ? void 0 : t.remove) == null || e.call(t), (i = (s = this.$current_highlight) == null ? void 0 : s.remove) == null || i.call(s), (r = (o = this.popup) == null ? void 0 : o.hide) == null || r.call(o);
  }
}
B.VIEW_MODE = l;
function F(n) {
  return n.name + "_" + Math.random().toString(36).slice(2, 12);
}
export {
  B as default
};
