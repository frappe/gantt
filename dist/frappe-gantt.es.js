const y = "year", k = "month", M = "day", D = "hour", T = "minute", L = "second", S = "millisecond", _ = {
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
      n.includes("T") && (n = n.replace("T", " ").replace(/Z$/, "").replace(/[+-]\d{2}:?\d{2}$/, ""));
      let i, s;
      const r = n.split(" ");
      i = r[0].split(t).map((a) => parseInt(a, 10)), s = r[1] && r[1].split(e), i[1] = i[1] ? i[1] - 1 : 0;
      let o = i;
      return s && s.length ? (s.length === 4 && (s[3] = "0." + s[3], s[3] = parseFloat(s[3]) * 1e3), o = o.concat(s)) : o = o.concat([0, 0, 0, 0]), new Date(...o);
    }
  },
  to_string(n, t = !1) {
    if (!(n instanceof Date))
      throw new TypeError("Invalid argument type");
    const e = this.get_date_values(n).map((r, o) => (o === 1 && (r = r + 1), o === 6 ? v(r + "", 3, "0") : v(r + "", 2, "0"))), i = `${e[0]}-${e[1]}-${e[2]}`, s = `${e[3]}:${e[4]}:${e[5]}.${e[6]}`;
    return i + (t ? " " + s : "");
  },
  format(n, t = "YYYY-MM-DD HH:mm:ss.SSS", e = "en") {
    const i = new Intl.DateTimeFormat(e, {
      month: "long"
    }), s = new Intl.DateTimeFormat(e, {
      month: "short"
    }), r = i.format(n), o = r.charAt(0).toUpperCase() + r.slice(1), a = this.get_date_values(n).map((c) => v(c, 2, 0)), h = {
      YYYY: a[0],
      MM: v(+a[1] + 1, 2, 0),
      DD: a[2],
      HH: a[3],
      mm: a[4],
      ss: a[5],
      SSS: a[6],
      D: a[2],
      MMMM: o,
      MMM: s.format(n)
    };
    let l = t;
    const d = [];
    return Object.keys(h).sort((c, g) => g.length - c.length).forEach((c) => {
      l.includes(c) && (l = l.replaceAll(c, `$${d.length}`), d.push(h[c]));
    }), d.forEach((c, g) => {
      l = l.replaceAll(`$${g}`, c);
    }), l;
  },
  diff(n, t, e = "day") {
    let i, s, r, o, a, h, l;
    return i = n - t, s = i / 1e3, o = s / 60, r = o / 60, a = r / 24, h = a / 30, l = a / 365, e.endsWith("s") || (e += "s"), Math.round(
      {
        milliseconds: i,
        seconds: s,
        minutes: o,
        hours: r,
        days: a,
        months: h,
        years: l
      }[e] * 100
    ) / 100;
  },
  today() {
    const n = this.get_date_values(/* @__PURE__ */ new Date()).slice(0, 3);
    return new Date(...n);
  },
  now() {
    return /* @__PURE__ */ new Date();
  },
  add(n, t, e) {
    const i = {
      [D]: 36e5,
      [T]: 6e4,
      [L]: 1e3,
      [S]: 1
    };
    if (i[e])
      return new Date(n.getTime() + t * i[e]);
    t = parseInt(t, 10);
    const s = [
      n.getFullYear() + (e === y ? t : 0),
      n.getMonth() + (e === k ? t : 0),
      n.getDate() + (e === M ? t : 0),
      n.getHours(),
      n.getMinutes(),
      n.getSeconds(),
      n.getMilliseconds()
    ];
    return new Date(...s);
  },
  start_of(n, t) {
    const e = {
      [y]: 6,
      [k]: 5,
      [M]: 4,
      [D]: 3,
      [T]: 2,
      [L]: 1,
      [S]: 0
    };
    function i(r) {
      const o = e[t];
      return e[r] <= o;
    }
    const s = [
      n.getFullYear(),
      i(y) ? 0 : n.getMonth(),
      i(k) ? 1 : n.getDate(),
      i(M) ? 0 : n.getHours(),
      i(D) ? 0 : n.getMinutes(),
      i(T) ? 0 : n.getSeconds(),
      i(L) ? 0 : n.getMilliseconds()
    ];
    return new Date(...s);
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
  get_utc_date_values(n) {
    return [
      n.getUTCFullYear(),
      n.getUTCMonth(),
      n.getUTCDate(),
      n.getUTCHours(),
      n.getUTCMinutes(),
      n.getUTCSeconds(),
      n.getUTCMilliseconds()
    ];
  },
  convert_scales(n, t) {
    const e = {
      millisecond: 11574074074074074e-24,
      second: 11574074074074073e-21,
      minute: 6944444444444445e-19,
      hour: 0.041666666666666664,
      day: 1,
      month: 30,
      year: 365
    }, { duration: i, scale: s } = this.parse_duration(n);
    return i * e[s] / e[t];
  },
  get_days_in_month(n) {
    const t = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31], e = n.getMonth();
    if (e !== 1)
      return t[e];
    const i = n.getFullYear();
    return i % 4 === 0 && i % 100 != 0 || i % 400 === 0 ? 29 : 28;
  },
  get_days_in_year(n) {
    return n.getFullYear() % 4 ? 365 : 366;
  }
};
function v(n, t, e) {
  return n = n + "", t = t >> 0, e = String(typeof e < "u" ? e : " "), n.length > t ? String(n) : (t = t - n.length, t > e.length && (e += e.repeat(t / e.length)), e.slice(0, t) + String(n));
}
function p(n, t) {
  return typeof n == "string" ? (t || document).querySelector(n) : n || null;
}
function u(n, t) {
  const e = document.createElementNS("http://www.w3.org/2000/svg", n);
  for (let i in t)
    i === "append_to" ? t.append_to.appendChild(e) : i === "innerHTML" ? e.innerHTML = t.innerHTML : i === "clipPath" ? e.setAttribute("clip-path", "url(#" + t[i] + ")") : e.setAttribute(i, t[i]);
  return e;
}
function Y(n, t, e, i) {
  const s = C(n, t, e, i);
  if (s === n) {
    const r = document.createEvent("HTMLEvents");
    r.initEvent("click", !0, !0), r.eventName = "click", s.dispatchEvent(r);
  }
}
function C(n, t, e, i, s = "0.4s", r = "0.1s") {
  const o = n.querySelector("animate");
  if (o)
    return p.attr(o, {
      attributeName: t,
      from: e,
      to: i,
      dur: s,
      begin: "click + " + r
      // artificial click
    }), n;
  const a = u("animate", {
    attributeName: t,
    from: e,
    to: i,
    dur: s,
    begin: r,
    calcMode: "spline",
    values: e + ";" + i,
    keyTimes: "0; 1",
    keySplines: W("ease-out")
  });
  return n.appendChild(a), n;
}
function W(n) {
  return {
    ease: ".25 .1 .25 1",
    linear: "0 0 1 1",
    "ease-in": ".42 0 1 1",
    "ease-out": "0 0 .58 1",
    "ease-in-out": ".42 0 .58 1"
  }[n];
}
p.on = (n, t, e, i) => {
  i ? p.delegate(n, t, e, i) : (i = e, p.bind(n, t, i));
};
p.off = (n, t, e) => {
  n.removeEventListener(t, e);
};
p.bind = (n, t, e) => {
  t.split(/\s+/).forEach(function(i) {
    n.addEventListener(i, e);
  });
};
p.delegate = (n, t, e, i) => {
  n.addEventListener(t, function(s) {
    const r = s.target.closest(e);
    r && (s.delegatedTarget = r, i.call(this, s, r));
  });
};
p.closest = (n, t) => t ? t.matches(n) ? t : p.closest(n, t.parentNode) : null;
p.attr = (n, t, e) => {
  if (!e && typeof t == "string")
    return n.getAttribute(t);
  if (typeof t == "object") {
    for (let i in t)
      p.attr(n, i, t[i]);
    return;
  }
  n.setAttribute(t, e);
};
class q {
  constructor(t, e, i) {
    this.gantt = t, this.from_task = e, this.to_task = i, this.calculate_path(), this.draw();
  }
  calculate_path() {
    let t = this.from_task.$bar.getX() + this.from_task.$bar.getWidth() / 2;
    const e = () => this.to_task.$bar.getX() < t + this.gantt.options.padding && t > this.from_task.$bar.getX() + this.gantt.options.padding;
    for (; e(); )
      t -= 10;
    t -= 10;
    let i = this.gantt.config.header_height + this.gantt.options.bar_height + (this.gantt.options.padding + this.gantt.options.bar_height) * this.from_task.task._index + this.gantt.options.padding / 2, s = this.to_task.$bar.getX() - 13, r = this.gantt.config.header_height + this.gantt.options.bar_height / 2 + (this.gantt.options.padding + this.gantt.options.bar_height) * this.to_task.task._index + this.gantt.options.padding / 2;
    const o = this.from_task.task._index > this.to_task.task._index;
    let a = this.gantt.options.arrow_curve;
    const h = o ? 1 : 0;
    let l = o ? -a : a;
    if (this.to_task.$bar.getX() <= this.from_task.$bar.getX() + this.gantt.options.padding) {
      let d = this.gantt.options.padding / 2 - a;
      d < 0 && (d = 0, a = this.gantt.options.padding / 2, l = o ? -a : a);
      const c = this.to_task.$bar.getY() + this.to_task.$bar.getHeight() / 2 - l, g = this.to_task.$bar.getX() - this.gantt.options.padding;
      this.path = `
                M ${t} ${i}
                v ${d}
                a ${a} ${a} 0 0 1 ${-a} ${a}
                H ${g}
                a ${a} ${a} 0 0 ${h} ${-a} ${l}
                V ${c}
                a ${a} ${a} 0 0 ${h} ${a} ${l}
                L ${s} ${r}
                m -5 -5
                l 5 5
                l -5 5`;
    } else {
      s < t + a && (a = s - t);
      let d = o ? r + a : r - a;
      this.path = `
              M ${t} ${i}
              V ${d}
              a ${a} ${a} 0 0 ${h} ${a} ${a}
              L ${s} ${r}
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
class I {
  constructor(t, e) {
    this.set_defaults(t, e), this.prepare_wrappers(), this.prepare_helpers(), this.refresh();
  }
  refresh() {
    this.bar_group.innerHTML = "", this.handle_group.innerHTML = "", this.task.custom_class ? this.group.classList.add(this.task.custom_class) : this.group.classList = ["bar-wrapper"], this.prepare_values(), this.draw(), this.bind();
  }
  set_defaults(t, e) {
    this.action_completed = !1, this.gantt = t, this.task = e, this.name = this.name || "";
  }
  prepare_wrappers() {
    this.group = u("g", {
      class: "bar-wrapper" + (this.task.custom_class ? " " + this.task.custom_class : ""),
      "data-id": this.task.id
    }), this.bar_group = u("g", {
      class: "bar-group",
      append_to: this.group
    }), this.handle_group = u("g", {
      class: "handle-group",
      append_to: this.group
    });
  }
  prepare_values() {
    this.invalid = this.task.invalid, this.height = this.gantt.options.bar_height, this.image_size = this.height - 5, this.task._start || (this.task._start = new Date(this.task.start)), this.task._end || (this.task._end = new Date(this.task.end)), this.compute_x(), this.compute_y(), this.compute_duration();
    const t = this.height / 2;
    this.gantt.options.bar_corner_radius > t && (this.gantt.has_warned_radius || (console.warn(
      `Frappe Gantt: the provided bar_corner_radius (${this.gantt.options.bar_corner_radius}) exceeds the maximum limit of half the bar height. Clamped to ${t} to prevent distortion.`
    ), this.gantt.has_warned_radius = !0)), this.corner_radius = Math.min(
      this.gantt.options.bar_corner_radius,
      t
    ), this.width = this.gantt.config.column_width * this.duration, this.width < 1 && this.task._end > this.task._start && (this.width = 1), (!this.task.progress || this.task.progress < 0) && (this.task.progress = 0), this.task.progress > 100 && (this.task.progress = 100);
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
      class: "bar",
      append_to: this.bar_group
    }), this.task.color && (this.$bar.style.fill = this.task.color), Y(this.$bar, "width", 0, this.width), this.invalid && this.$bar.classList.add("bar-invalid");
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
    }), Y(
      this.$expected_bar_progress,
      "width",
      0,
      this.expected_progress_width
    ));
  }
  draw_progress_bar() {
    if (this.invalid) return;
    this.progress_width = this.calculate_progress_width();
    let t = this.corner_radius;
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || (t = this.corner_radius + 2), this.$bar_progress = u("rect", {
      x: this.x,
      y: this.y,
      width: this.progress_width,
      height: this.height,
      rx: t,
      ry: t,
      class: "bar-progress",
      append_to: this.bar_group
    }), this.task.color_progress && (this.$bar_progress.style.fill = this.task.color_progress);
    const e = _.diff(
      this.task._start,
      this.gantt.gantt_start,
      this.gantt.config.unit
    ) / this.gantt.config.step * this.gantt.config.column_width;
    let i = this.gantt.create_el({
      classes: `date-range-highlight hide highlight-${this.task.id}`,
      width: this.width,
      left: e
    });
    this.$date_highlight = i, this.gantt.$lower_header.prepend(this.$date_highlight), Y(this.$bar_progress, "width", 0, this.progress_width);
  }
  calculate_progress_width() {
    const t = this.$bar.getWidth(), e = this.x + t, i = this.gantt.config.ignored_positions.reduce((h, l) => h + (l >= this.x && l < e), 0) * this.gantt.config.column_width;
    let s = (t - i) * this.task.progress / 100;
    const r = this.x + s, o = this.gantt.config.ignored_positions.reduce((h, l) => h + (l >= this.x && l < r), 0) * this.gantt.config.column_width;
    s += o;
    let a = this.gantt.get_ignored_region(
      this.x + s
    );
    for (; a.length; )
      s += this.gantt.config.column_width, a = this.gantt.get_ignored_region(
        this.x + s
      );
    return this.progress_width = s, s;
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
    let t = 10, e = 2, i, s;
    i = u("defs", {
      append_to: this.bar_group
    }), u("rect", {
      id: "rect_" + this.task.id,
      x: this.x + t,
      y: this.y + e,
      width: this.image_size,
      height: this.image_size,
      rx: "15",
      class: "img_mask",
      append_to: i
    }), s = u("clipPath", {
      id: "clip_" + this.task.id,
      append_to: i
    }), u("use", {
      href: "#rect_" + this.task.id,
      append_to: s
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
    if (this.invalid || this.gantt.options.readonly) return;
    const t = this.$bar, e = 3;
    if (this.handles = [], !this.gantt.options.readonly_dates && !this.gantt.options.fixed_duration && (this.handles.push(
      u("rect", {
        x: t.getEndX() - e / 2,
        y: t.getY() + this.height / 4,
        width: e,
        height: this.height / 2,
        rx: 2,
        ry: 2,
        class: "handle right",
        append_to: this.handle_group
      })
    ), this.handles.push(
      u("rect", {
        x: t.getX() - e / 2,
        y: t.getY() + this.height / 4,
        width: e,
        height: this.height / 2,
        rx: 2,
        ry: 2,
        class: "handle left",
        append_to: this.handle_group
      })
    )), !this.gantt.options.readonly_progress) {
      const i = this.$bar_progress;
      this.$handle_progress = u("circle", {
        cx: i.getEndX(),
        cy: i.getY() + i.getHeight() / 2,
        r: 4.5,
        class: "handle progress",
        append_to: this.handle_group
      }), this.handles.push(this.$handle_progress);
    }
    for (let i of this.handles)
      p.on(i, "mouseenter", () => i.classList.add("active")), p.on(i, "mouseleave", () => i.classList.remove("active"));
  }
  bind() {
    this.invalid || this.setup_click_event();
  }
  setup_click_event() {
    let t = this.task.id;
    p.on(this.group, "mouseover", (s) => {
      this.gantt.trigger_event("hover", [
        this.task,
        s.screenX,
        s.screenY,
        s
      ]);
    }), this.gantt.options.popup_on === "click" && p.on(this.group, "mouseup", (s) => {
      const r = s.offsetX || s.layerX;
      if (this.$handle_progress) {
        const o = +this.$handle_progress.getAttribute("cx");
        if (o > r - 1 && o < r + 1 || this.gantt.bar_being_dragged) return;
      }
      this.gantt.show_popup({
        x: s.offsetX || s.layerX,
        y: s.offsetY || s.layerY,
        task: this.task,
        target: this.$bar
      });
    });
    let e;
    p.on(this.group, "mouseenter", (s) => {
      e = setTimeout(() => {
        this.gantt.options.popup_on === "hover" && this.gantt.show_popup({
          x: s.offsetX || s.layerX,
          y: s.offsetY || s.layerY,
          task: this.task,
          target: this.$bar
        });
        const r = this.gantt.$container.scrollLeft;
        this.gantt.$container.querySelector(`.highlight-${t}`).classList.remove("hide"), this.gantt.$container.scrollLeft = r;
      }, 200);
    }), p.on(this.group, "mouseleave", () => {
      var s, r;
      clearTimeout(e), this.gantt.options.popup_on === "hover" && ((r = (s = this.gantt.popup) == null ? void 0 : s.hide) == null || r.call(s)), this.gantt.$container.querySelector(`.highlight-${t}`).classList.add("hide");
    }), p.on(this.group, "click", () => {
      this.gantt.trigger_event("click", [this.task]);
    }), p.on(this.group, "dblclick", (s) => {
      this.action_completed || (this.group.classList.remove("active"), this.gantt.popup && this.gantt.popup.parent.classList.remove("hide"), this.gantt.trigger_event("double_click", [this.task]));
    });
    let i = !1;
    p.on(this.group, "touchstart", (s) => {
      if (!i)
        return i = !0, setTimeout(function() {
          i = !1;
        }, 300), !1;
      s.preventDefault(), !this.action_completed && (this.group.classList.remove("active"), this.gantt.popup && this.gantt.popup.parent.classList.remove("hide"), this.gantt.trigger_event("double_click", [this.task]));
    });
  }
  update_bar_position({ x: t = null, width: e = null }) {
    const i = this.$bar;
    if (t) {
      if (!this.task.dependencies.map((o) => this.gantt.get_bar(o).$bar.getX()).reduce((o, a) => o && t >= a, !0)) return;
      this.update_attr(i, "x", t), this.x = t, this.$date_highlight.style.left = t + "px";
    }
    e > 0 && (this.update_attr(i, "width", e), this.$date_highlight.style.width = e + "px"), this.update_label_position(), this.update_handle_position(), this.date_changed(), this.compute_duration(), this.gantt.options.show_expected_progress && this.update_expected_progressbar_position(), this.update_progressbar_position(), this.update_arrow_position();
  }
  update_label_position_on_horizontal_scroll({ x: t, sx: e }) {
    const i = this.gantt.$container, s = this.group.querySelector(".bar-label"), r = this.group.querySelector(".bar-img") || "", o = this.bar_group.querySelector(".img_mask") || "";
    let a = this.$bar.getX() + this.$bar.getWidth(), h = s.getX() + t, l = r && r.getX() + t || 0, d = r && r.getBBox().width + 7 || 7, c = h + s.getBBox().width + 7, g = e + i.clientWidth / 2;
    s.classList.contains("big") || (c < a && t > 0 && c < g || h - d > this.$bar.getX() && t < 0 && c > g) && (s.setAttribute("x", h), r && (r.setAttribute("x", l), o.setAttribute("x", l)));
  }
  date_changed() {
    let t = !1;
    const { new_start_date: e, new_end_date: i } = this.compute_start_end_date();
    Number(this.task._start) !== Number(e) && (t = !0, this.task._start = e), Number(this.task._end) !== Number(i) && (t = !0, this.task._end = i), t && this.gantt.trigger_event("date_change", [
      this.task,
      e,
      _.add(i, -1, "second")
    ]);
  }
  progress_changed() {
    this.task.progress = this.compute_progress(), this.gantt.trigger_event("progress_change", [
      this.task,
      this.task.progress
    ]);
  }
  set_action_completed() {
    this.action_completed = !0, setTimeout(() => this.action_completed = !1, 1e3);
  }
  compute_start_end_date() {
    const t = this.$bar, e = t.getX() / this.gantt.config.column_width;
    let i = _.add(
      this.gantt.gantt_start,
      e * this.gantt.config.step,
      this.gantt.config.unit
    );
    const s = t.getWidth() / this.gantt.config.column_width, r = _.add(
      i,
      s * this.gantt.config.step,
      this.gantt.config.unit
    );
    return { new_start_date: i, new_end_date: r };
  }
  compute_progress() {
    this.progress_width = this.$bar_progress.getWidth(), this.x = this.$bar_progress.getBBox().x;
    const t = this.x + this.progress_width, e = this.progress_width - this.gantt.config.ignored_positions.reduce((s, r) => s + (r >= this.x && r <= t), 0) * this.gantt.config.column_width;
    if (e < 0) return 0;
    const i = this.$bar.getWidth() - this.ignored_duration_raw * this.gantt.config.column_width;
    return parseInt(e / i * 100, 10);
  }
  compute_expected_progress() {
    this.expected_progress = _.diff(_.today(), this.task._start, "hour") / this.gantt.config.step, this.expected_progress = (this.expected_progress < this.duration ? this.expected_progress : this.duration) * 100 / this.duration;
  }
  compute_x() {
    const { column_width: t } = this.gantt.config, e = this.task._start, i = this.gantt.gantt_start;
    let r = _.diff(e, i, this.gantt.config.unit) / this.gantt.config.step * t;
    this.x = r;
  }
  compute_y() {
    this.y = this.gantt.config.header_height + this.gantt.options.padding / 2 + this.task._index * (this.height + this.gantt.options.padding);
  }
  compute_duration() {
    this.duration = _.diff(
      this.task._end,
      this.task._start,
      this.gantt.config.unit
    ) / this.gantt.config.step;
    let t = 0, e = 0;
    for (let i = new Date(this.task._start); i < this.task._end; i.setDate(i.getDate() + 1))
      e++, !this.gantt.config.ignored_dates.find(
        (s) => s.getTime() === i.getTime()
      ) && (!this.gantt.config.ignored_function || !this.gantt.config.ignored_function(i)) && t++;
    this.task.actual_duration = t, this.task.ignored_duration = e - t, e > 0 ? this.actual_duration_raw = this.duration * (t / e) : this.actual_duration_raw = this.duration, this.ignored_duration_raw = this.duration - this.actual_duration_raw;
  }
  update_attr(t, e, i) {
    return i = +i, isNaN(i) || t.setAttribute(e, i), t;
  }
  update_expected_progressbar_position() {
    this.invalid || (this.$expected_bar_progress.setAttribute("x", this.$bar.getX()), this.compute_expected_progress(), this.$expected_bar_progress.setAttribute(
      "width",
      this.gantt.config.column_width * this.actual_duration_raw * (this.expected_progress / 100) || 0
    ));
  }
  update_progressbar_position() {
    this.invalid || this.gantt.options.readonly || (this.$bar_progress.setAttribute("x", this.$bar.getX()), this.$bar_progress.setAttribute(
      "width",
      this.calculate_progress_width()
    ));
  }
  update_label_position() {
    const t = this.bar_group.querySelector(".img_mask") || "", e = this.$bar, i = this.group.querySelector(".bar-label"), s = this.group.querySelector(".bar-img");
    let r = 5, o = this.image_size + 10;
    const a = i.getBBox().width, h = e.getWidth();
    a > h ? (i.classList.add("big"), s ? (s.setAttribute("x", e.getEndX() + r), t.setAttribute("x", e.getEndX() + r), i.setAttribute("x", e.getEndX() + o)) : i.setAttribute("x", e.getEndX() + r)) : (i.classList.remove("big"), s ? (s.setAttribute("x", e.getX() + r), t.setAttribute("x", e.getX() + r), i.setAttribute(
      "x",
      e.getX() + h / 2 + o
    )) : i.setAttribute(
      "x",
      e.getX() + h / 2 - a / 2
    ));
  }
  update_handle_position() {
    if (this.invalid || this.gantt.options.readonly) return;
    const t = this.$bar;
    this.handle_group.querySelector(".handle.left").setAttribute("x", t.getX()), this.handle_group.querySelector(".handle.right").setAttribute("x", t.getEndX());
    const e = this.group.querySelector(".handle.progress");
    e && e.setAttribute("cx", this.$bar_progress.getEndX());
  }
  update_arrow_position() {
    this.arrows = this.arrows || [];
    for (let t of this.arrows)
      t.update();
  }
}
class F {
  constructor(t, e, i) {
    this.parent = t, this.popup_func = e, this.gantt = i, this.make();
  }
  make() {
    this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="details"></div>
            <div class="actions"></div>
        `, this.hide(), this.title = this.parent.querySelector(".title"), this.subtitle = this.parent.querySelector(".subtitle"), this.details = this.parent.querySelector(".details"), this.actions = this.parent.querySelector(".actions");
  }
  show({ x: t, y: e, task: i, target: s }) {
    this.actions.innerHTML = "";
    let r = this.popup_func({
      task: i,
      chart: this.gantt,
      get_title: () => this.title,
      set_title: (o) => this.title.innerHTML = o,
      get_subtitle: () => this.subtitle,
      set_subtitle: (o) => this.subtitle.innerHTML = o,
      get_details: () => this.details,
      set_details: (o) => this.details.innerHTML = o,
      add_action: (o, a) => {
        let h = this.gantt.create_el({
          classes: "action-btn",
          type: "button",
          append_to: this.actions
        });
        typeof o == "function" && (o = o(i)), h.innerHTML = o, h.onclick = (l) => a(i, this.gantt, l);
      }
    });
    r !== !1 && (r && (this.parent.innerHTML = r), this.actions.innerHTML === "" ? this.actions.remove() : this.parent.appendChild(this.actions), this.parent.style.left = t + 10 + "px", this.parent.style.top = e - 10 + "px", this.parent.classList.remove("hide"));
  }
  hide() {
    this.parent.classList.add("hide");
  }
}
function A(n) {
  const t = n.getFullYear();
  return t - t % 10 + "";
}
function z(n, t, e) {
  let i = _.add(n, 6, "day"), s = i.getMonth() !== n.getMonth() ? "D MMM" : "D", r = !t || n.getMonth() !== t.getMonth() ? "D MMM" : "D";
  return `${_.format(n, r, e)} - ${_.format(i, s, e)}`;
}
const w = [
  {
    name: "Hour",
    padding: "7d",
    step: "1h",
    date_format: "YYYY-MM-DD HH:",
    lower_text: "HH",
    upper_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? _.format(n, "D MMMM", e) : "",
    upper_text_frequency: 24
  },
  {
    name: "Quarter Day",
    padding: "7d",
    step: "6h",
    date_format: "YYYY-MM-DD HH:",
    lower_text: "HH",
    upper_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? _.format(n, "D MMM", e) : "",
    upper_text_frequency: 4
  },
  {
    name: "Half Day",
    padding: "14d",
    step: "12h",
    date_format: "YYYY-MM-DD HH:",
    lower_text: "HH",
    upper_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? n.getMonth() !== n.getMonth() ? _.format(n, "D MMM", e) : _.format(n, "D", e) : "",
    upper_text_frequency: 2
  },
  {
    name: "Day",
    padding: "7d",
    date_format: "YYYY-MM-DD",
    step: "1d",
    lower_text: (n, t, e) => !t || n.getDate() !== t.getDate() ? _.format(n, "D", e) : "",
    upper_text: (n, t, e) => !t || n.getMonth() !== t.getMonth() ? _.format(n, "MMMM", e) : "",
    thick_line: (n) => n.getDay() === 1
  },
  {
    name: "Week",
    padding: "1m",
    step: "7d",
    date_format: "YYYY-MM-DD",
    column_width: 140,
    lower_text: z,
    upper_text: (n, t, e) => !t || n.getMonth() !== t.getMonth() ? _.format(n, "MMMM", e) : "",
    thick_line: (n) => n.getDate() >= 1 && n.getDate() <= 7,
    upper_text_frequency: 4
  },
  {
    name: "Month",
    padding: "2m",
    step: "1m",
    column_width: 120,
    date_format: "YYYY-MM",
    lower_text: "MMMM",
    upper_text: (n, t, e) => !t || n.getFullYear() !== t.getFullYear() ? _.format(n, "YYYY", e) : "",
    thick_line: (n) => n.getMonth() % 3 === 0,
    snap_at: "7d"
  },
  {
    name: "Year",
    padding: "2y",
    step: "1y",
    column_width: 120,
    date_format: "YYYY",
    upper_text: (n, t, e) => !t || A(n) !== A(t) ? A(n) : "",
    lower_text: "YYYY",
    snap_at: "30d"
  }
], O = {
  arrow_curve: 5,
  auto_move_label: !1,
  bar_corner_radius: 3,
  bar_height: 30,
  container_height: "auto",
  column_width: null,
  date_format: "YYYY-MM-DD HH:mm",
  upper_header_height: 45,
  lower_header_height: 30,
  snap_at: null,
  infinite_padding: !0,
  holidays: { "var(--g-weekend-highlight-color)": "weekend" },
  ignore: [],
  language: "en",
  lines: "both",
  move_dependencies: !0,
  padding: 18,
  popup: (n) => {
    n.set_title(n.task.name), n.task.description ? n.set_subtitle(n.task.description) : n.set_subtitle("");
    const t = _.format(
      n.task._start,
      "MMM D",
      n.chart.options.language
    ), e = _.format(
      _.add(n.task._end, -1, "second"),
      "MMM D",
      n.chart.options.language
    ), i = n.task.actual_duration === 1 ? "day" : "days";
    n.set_details(
      `${t} - ${e} (${n.task.actual_duration} ${i}${n.task.ignored_duration ? " + " + n.task.ignored_duration + " excluded" : ""})<br/>Progress: ${Math.floor(n.task.progress * 100) / 100}%`
    );
  },
  popup_on: "click",
  readonly_progress: !1,
  readonly_dates: !1,
  readonly: !1,
  hover_on_date: !1,
  fixed_duration: !1,
  scroll_to: "today",
  show_expected_progress: !1,
  today_button: !0,
  view_mode: "Day",
  view_mode_select: !1,
  view_modes: w,
  is_weekend: (n) => n.getDay() === 0 || n.getDay() === 6
};
class B {
  constructor(t, e, i) {
    this.setup_wrapper(t), this.setup_options(i), this.setup_tasks(e), this.change_view_mode(), this.bind_events();
  }
  setup_wrapper(t) {
    let e, i;
    if (typeof t == "string") {
      let s = document.querySelector(t);
      if (!s)
        throw new ReferenceError(
          `CSS selector "${t}" could not be found in DOM`
        );
      t = s;
    }
    if (t instanceof HTMLElement)
      i = t, e = t.querySelector("svg");
    else if (t instanceof SVGElement)
      e = t;
    else
      throw new TypeError(
        "Frappe Gantt only supports usage of a string CSS selector, HTML DOM element or SVG DOM element for the 'element' parameter"
      );
    e ? (this.$svg = e, this.$svg.classList.add("gantt")) : this.$svg = u("svg", {
      append_to: i,
      class: "gantt"
    }), this.$container = this.create_el({
      classes: "gantt-container",
      append_to: this.$svg.parentElement
    }), this.$container.appendChild(this.$svg), this.$popup_wrapper = this.create_el({
      classes: "popup-wrapper",
      append_to: this.$container
    });
  }
  setup_options(t) {
    this.original_options = t, t != null && t.view_modes && (t.view_modes = t.view_modes.map((i) => {
      if (typeof i == "string") {
        const s = w.find(
          (r) => r.name === i
        );
        return s || console.error(
          `The view mode "${i}" is not predefined in Frappe Gantt. Please define the view mode object instead.`
        ), s;
      }
      return i;
    }), t.view_mode || (t.view_mode = t.view_modes[0])), this.options = { ...O, ...t };
    const e = {
      "grid-height": "container_height",
      "bar-height": "bar_height",
      "lower-header-height": "lower_header_height",
      "upper-header-height": "upper_header_height"
    };
    for (let i in e) {
      let s = this.options[e[i]];
      s !== "auto" && this.$container.style.setProperty(
        "--gv-" + i,
        s + "px"
      );
    }
    if (this.config = {
      ignored_dates: [],
      ignored_positions: [],
      extend_by_units: 10
    }, typeof this.options.ignore != "function") {
      typeof this.options.ignore == "string" && (this.options.ignore = [this.options.ignore]);
      for (let i of this.options.ignore) {
        if (typeof i == "function") {
          this.config.ignored_function = i;
          continue;
        }
        typeof i == "string" && (i === "weekend" ? this.config.ignored_function = (s) => s.getDay() == 6 || s.getDay() == 0 : this.config.ignored_dates.push(/* @__PURE__ */ new Date(i + " ")));
      }
    } else
      this.config.ignored_function = this.options.ignore;
  }
  update_options(t) {
    const e = this.config.view_mode;
    this.setup_options({ ...this.original_options, ...t }), this.change_view_mode(e, !0);
  }
  setup_tasks(t) {
    this.tasks = t.map((e, i) => {
      if (!e.start)
        return console.error(
          `task "${e.id}" doesn't have a start date`
        ), !1;
      if (e._start = _.parse(e.start), e.end === void 0 && e.duration !== void 0 && (e.end = e._start, e.duration.split(" ").forEach((o) => {
        let { duration: a, scale: h } = _.parse_duration(o);
        e.end = _.add(e.end, a, h);
      })), !e.end)
        return console.error(`task "${e.id}" doesn't have an end date`), !1;
      if (e._end = _.parse(e.end), _.diff(e._end, e._start, "year") < 0)
        return console.error(
          `start of task can't be after end of task: in task "${e.id}"`
        ), !1;
      if (_.diff(e._end, e._start, "year") > 10)
        return console.error(
          `the duration of task "${e.id}" is too long (above ten years)`
        ), !1;
      if (e._index = i, typeof e.dependencies == "string" || !e.dependencies) {
        let r = [];
        e.dependencies && (r = e.dependencies.split(",").map((o) => o.trim().replaceAll(" ", "_")).filter((o) => o)), e.dependencies = r;
      }
      return e.id ? typeof e.id == "string" ? e.id = e.id.replaceAll(" ", "_") : e.id = `${e.id}` : e.id = N(e), e;
    }).filter((e) => e), this.setup_dependencies();
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
  update_task(t, e) {
    let i = this.tasks.find((r) => r.id === t), s = this.bars[i._index];
    Object.assign(i, e), s.refresh();
  }
  change_view_mode(t = this.options.view_mode, e = !1) {
    const i = typeof t == "string" ? t : t.name, s = this.options.view_modes.find((h) => h.name === i) || {};
    t = { ...w.find((h) => h.name === i) || {}, ...s };
    let o, a;
    e && (o = this.$container.scrollLeft, a = this.options.scroll_to, this.options.scroll_to = null), this.options.view_mode = t.name, this.config.view_mode = t, this.update_view_scale(t), this.setup_dates(e), this.render(), e && (this.$container.scrollLeft = o, this.options.scroll_to = a), this.trigger_event("view_change", [t]);
  }
  update_view_scale(t) {
    let { duration: e, scale: i } = _.parse_duration(t.step);
    this.config.step = e, this.config.unit = i, this.config.column_width = this.options.column_width || t.column_width || 45, this.$container.style.setProperty(
      "--gv-column-width",
      this.config.column_width + "px"
    ), this.config.header_height = this.options.lower_header_height + this.options.upper_header_height + 10;
  }
  setup_dates(t = !1) {
    this.setup_gantt_dates(t), this.setup_date_values(), this._precompute_grid_data(), this._precompute_holidays();
  }
  setup_gantt_dates(t) {
    let e, i;
    this.tasks.length || (e = /* @__PURE__ */ new Date(), i = /* @__PURE__ */ new Date());
    for (let s of this.tasks)
      (!e || s._start < e) && (e = s._start), (!i || s._end > i) && (i = s._end);
    if (e = _.start_of(e, this.config.unit), i = _.start_of(i, this.config.unit), !t)
      if (this.options.infinite_padding)
        this.gantt_start = _.add(
          e,
          -this.config.extend_by_units * 3,
          this.config.unit
        ), this.gantt_end = _.add(
          i,
          this.config.extend_by_units * 3,
          this.config.unit
        );
      else {
        typeof this.config.view_mode.padding == "string" && (this.config.view_mode.padding = [
          this.config.view_mode.padding,
          this.config.view_mode.padding
        ]);
        let [s, r] = this.config.view_mode.padding.map(
          _.parse_duration
        );
        this.gantt_start = _.add(
          e,
          -s.duration,
          s.scale
        ), this.gantt_end = _.add(
          i,
          r.duration,
          r.scale
        );
      }
    this.config.date_format = this.config.view_mode.date_format || this.options.date_format, this.gantt_start.setHours(0, 0, 0, 0);
  }
  setup_date_values() {
    let t = this.gantt_start;
    for (this.dates = [t]; t < this.gantt_end; )
      t = _.add(
        t,
        this.config.step,
        this.config.unit
      ), this.dates.push(t);
  }
  // ==================== Horizontal Virtualization ====================
  _precompute_grid_data() {
    let t = this.config.view_mode.upper_text, e = this.config.view_mode.lower_text;
    t ? typeof t == "string" && (this.config.view_mode.upper_text = (r, o, a) => _.format(r, t, a)) : this.config.view_mode.upper_text = () => "", e ? typeof e == "string" && (this.config.view_mode.lower_text = (r, o, a) => _.format(r, e, a)) : this.config.view_mode.lower_text = () => "", this._tick_x_positions = [];
    let i = 0;
    const s = this.config.view_mode.name;
    for (const r of this.dates)
      this._tick_x_positions.push(i), s === "Month" ? i += _.get_days_in_month(r) * this.config.column_width / 30 : s === "Year" ? i += _.get_days_in_year(r) * this.config.column_width / 365 : i += this.config.column_width;
    this._last_visible_range = null, this._last_refresh_start = void 0, this._last_refresh_end = void 0;
  }
  _precompute_holidays() {
    if (this._precomputed_holidays = [], !this.options.holidays) return;
    const t = _.convert_scales(
      this.config.view_mode.step,
      "day"
    );
    for (let e in this.options.holidays) {
      let i = this.options.holidays[e];
      i === "weekend" && (i = this.options.is_weekend);
      let s, r = {};
      if (typeof i == "object") {
        let o = i.find(
          (a) => typeof a == "function"
        );
        if (o && (s = o), this.options.holidays.name) {
          let a = /* @__PURE__ */ new Date(i.date + " ");
          i = (h) => a.getTime() === h.getTime(), r[a] = i.name;
        } else
          i = (a) => this.options.holidays[e].filter((h) => typeof h != "function").map((h) => {
            if (h.name) {
              let l = /* @__PURE__ */ new Date(h.date + " ");
              return r[l] = h.name, l.getTime();
            }
            return (/* @__PURE__ */ new Date(h + " ")).getTime();
          }).includes(a.getTime());
      }
      for (let o = new Date(this.gantt_start); o <= this.gantt_end; o.setDate(o.getDate() + 1)) {
        if (this.config.ignored_dates.find(
          (d) => d.getTime() == o.getTime()
        ) || this.config.ignored_function && this.config.ignored_function(o))
          continue;
        const a = i(o) || s && s(o);
        if (!a && !this.options.hover_on_date) continue;
        const h = _.diff(
          o,
          this.gantt_start,
          this.config.unit
        ) / this.config.step * this.config.column_width, l = _.format(o, "YYYY-MM-DD", this.options.language).replace(" ", "_");
        this._precomputed_holidays.push({
          x: Math.round(h),
          width: this.config.column_width / t,
          color: e,
          d_formatted: l,
          is_holiday: a,
          label: r[o] || null
        });
      }
    }
  }
  _compute_scroll_target() {
    const t = this.options.scroll_to;
    if (this._scroll_target_px = 0, !t || t === "start")
      this._scroll_target_px = 0;
    else if (t === "end")
      this._scroll_target_px = this.dates.length * this.config.column_width;
    else if (t === "today") {
      const e = /* @__PURE__ */ new Date();
      e >= this.gantt_start && e <= this.gantt_end && (this._scroll_target_px = _.diff(
        e,
        this.gantt_start,
        this.config.unit
      ) / this.config.step * this.config.column_width);
    } else if (typeof t == "string") {
      const e = _.parse(t);
      this._scroll_target_px = _.diff(e, this.gantt_start, this.config.unit) / this.config.step * this.config.column_width;
    }
  }
  _update_visible_range() {
    const t = this._tick_x_positions && this._tick_x_positions.length ? this._tick_x_positions[this._tick_x_positions.length - 1] + this.config.column_width : this.dates.length * this.config.column_width;
    if (t <= 25e3) {
      this._visible_start_px = 0, this._visible_end_px = t, this._virtualization_disabled = !0;
      return;
    }
    this._virtualization_disabled = !1;
    let e = this.$container ? this.$container.scrollLeft : 0;
    const i = this.$container ? this.$container.clientWidth : 800;
    e === 0 && this._scroll_target_px > 0 && (e = this._scroll_target_px);
    const s = i * 3;
    this._visible_start_px = Math.max(0, e - s), this._visible_end_px = e + i + s;
  }
  _get_visible_date_range() {
    const t = this._tick_x_positions;
    if (!t || !t.length) return { startIdx: 0, endIdx: 0 };
    let e = 0, i = t.length - 1, s = 0;
    for (; e <= i; ) {
      const o = e + i >> 1;
      t[o] + this.config.column_width >= this._visible_start_px ? (s = o, i = o - 1) : e = o + 1;
    }
    e = s, i = t.length - 1;
    let r = t.length - 1;
    for (; e <= i; ) {
      const o = e + i >> 1;
      t[o] <= this._visible_end_px ? (r = o, e = o + 1) : i = o - 1;
    }
    return { startIdx: s, endIdx: r };
  }
  _clear_virtual_elements() {
    this._$vticks && (this._$vticks.innerHTML = ""), this._$vholidays && (this._$vholidays.innerHTML = ""), this._$vignored && (this._$vignored.innerHTML = ""), this.$lower_header && this.$lower_header.querySelectorAll(".lower-text").forEach((t) => t.remove()), this.$upper_header && this.$upper_header.querySelectorAll(".upper-text").forEach((t) => t.remove()), this.$container && this.$container.querySelectorAll(".holiday-label").forEach((t) => t.remove()), this.$current_highlight && (this.$current_highlight.remove(), this.$current_highlight = null), this.$current_ball_highlight && (this.$current_ball_highlight.remove(), this.$current_ball_highlight = null);
  }
  _refresh_virtual_grid() {
    if (this._virtualization_disabled) return;
    this._update_visible_range();
    const e = (this.$container ? this.$container.clientWidth : 800) * 1.5;
    this._last_refresh_start !== void 0 && Math.abs(this._visible_start_px - this._last_refresh_start) < e && Math.abs(this._visible_end_px - this._last_refresh_end) < e || (this._last_refresh_start = this._visible_start_px, this._last_refresh_end = this._visible_end_px, this._clear_virtual_elements(), this.make_grid_ticks(), this.make_dates(), this.make_grid_highlights(), this.bind_holiday_labels());
  }
  _bind_virtual_scroll() {
    let t = null;
    this._virtual_scroll_handler = () => {
      t || (t = requestAnimationFrame(() => {
        t = null, this._refresh_virtual_grid();
      }));
    }, this.$container.addEventListener(
      "scroll",
      this._virtual_scroll_handler
    );
  }
  // ==================== End Virtualization ====================
  bind_events() {
    this.bind_grid_click(), this.bind_holiday_labels(), this.bind_bar_events(), this._bind_virtual_scroll();
  }
  render() {
    this.clear(), this.setup_layers(), this.make_grid(), this._compute_scroll_target(), this._update_visible_range(), this.make_dates(), this.make_grid_extras(), this.make_bars(), this.make_arrows(), this.map_arrows_on_bars(), this.set_dimensions(), this.set_scroll_position(this.options.scroll_to);
  }
  setup_layers() {
    this.layers = {};
    const t = ["grid", "arrow", "progress", "bar"];
    for (let s of t)
      this.layers[s] = u("g", {
        class: s,
        append_to: this.$svg
      });
    const e = u("defs", { append_to: this.$svg }), i = u("pattern", {
      id: "diagonalHatch",
      patternUnits: "userSpaceOnUse",
      width: 4,
      height: 4,
      append_to: e
    });
    u("path", {
      d: "M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2",
      style: "stroke:grey; stroke-width:0.3",
      append_to: i
    }), this._$vticks = u("g", {
      class: "vticks",
      append_to: this.layers.grid
    }), this._$vholidays = u("g", {
      class: "vholidays",
      append_to: this.layers.grid
    }), this._$vignored = u("g", {
      class: "vignored",
      append_to: this.$svg
    }), this.$extras = this.create_el({
      classes: "extras",
      append_to: this.$container
    }), this.$adjust = this.create_el({
      classes: "adjust hide",
      append_to: this.$extras,
      type: "button"
    }), this.$adjust.innerHTML = "&larr;";
  }
  make_grid() {
    this.make_grid_background(), this.make_grid_rows(), this._make_grid_row_lines(), this.make_grid_header(), this.make_side_header();
  }
  _make_grid_row_lines() {
    if (this.options.lines === "none" || this.options.lines === "vertical")
      return;
    let t = u("g", {
      class: "lines_layer",
      append_to: this.layers.grid
    }), e = this.config.header_height;
    const i = this.dates.length * this.config.column_width, s = this.options.bar_height + this.options.padding;
    for (let r = this.config.header_height; r < this.grid_height; r += s)
      u("line", {
        x1: 0,
        y1: e + s,
        x2: i,
        y2: e + s,
        class: "row-line",
        append_to: t
      }), e += s;
  }
  make_grid_extras() {
    this.make_grid_highlights(), this.make_grid_ticks();
  }
  make_grid_background() {
    const t = this.dates.length * this.config.column_width, e = Math.max(
      this.config.header_height + this.options.padding + (this.options.bar_height + this.options.padding) * this.tasks.length - 10,
      this.options.container_height !== "auto" ? this.options.container_height : 0
    );
    u("rect", {
      x: 0,
      y: 0,
      width: t,
      height: e,
      class: "grid-background",
      append_to: this.$svg
    }), p.attr(this.$svg, {
      height: e,
      width: "100%"
    }), this.grid_height = e, this.options.container_height === "auto" && (this.$container.style.height = e + "px");
  }
  make_grid_rows() {
    const t = u("g", { append_to: this.layers.grid }), e = this.dates.length * this.config.column_width, i = this.options.bar_height + this.options.padding;
    this.config.header_height;
    for (let s = this.config.header_height; s < this.grid_height; s += i)
      u("rect", {
        x: 0,
        y: s,
        width: e,
        height: i,
        class: "grid-row",
        append_to: t
      });
  }
  make_grid_header() {
    this.$header = this.create_el({
      width: this.dates.length * this.config.column_width,
      classes: "grid-header",
      append_to: this.$container
    }), this.$upper_header = this.create_el({
      classes: "upper-header",
      append_to: this.$header
    }), this.$lower_header = this.create_el({
      classes: "lower-header",
      append_to: this.$header
    });
  }
  make_side_header() {
    if (this.$side_header = this.create_el({ classes: "side-header" }), this.$upper_header.prepend(this.$side_header), this.options.view_mode_select) {
      const t = document.createElement("select");
      t.classList.add("viewmode-select");
      const e = document.createElement("option");
      e.selected = !0, e.disabled = !0, e.textContent = "Mode", t.appendChild(e);
      for (const i of this.options.view_modes) {
        const s = document.createElement("option");
        s.value = i.name, s.textContent = i.name, i.name === this.config.view_mode.name && (s.selected = !0), t.appendChild(s);
      }
      t.addEventListener(
        "change",
        (function() {
          this.change_view_mode(t.value, !0);
        }).bind(this)
      ), this.$side_header.appendChild(t);
    }
    if (this.options.today_button) {
      let t = document.createElement("button");
      t.classList.add("today-button"), t.textContent = "Today", t.onclick = this.scroll_current.bind(this), this.$side_header.prepend(t), this.$today_button = t;
    }
  }
  make_grid_ticks() {
    if (this.options.lines === "none" || this.options.lines === "horizontal")
      return;
    const t = this.config.header_height, e = this.grid_height - this.config.header_height, { startIdx: i, endIdx: s } = this._get_visible_date_range();
    for (let r = i; r <= s && r < this.dates.length; r++) {
      const o = this.dates[r];
      let a = "tick";
      this.config.view_mode.thick_line && this.config.view_mode.thick_line(o) && (a += " thick"), u("path", {
        d: `M ${this._tick_x_positions[r]} ${t} v ${e}`,
        class: a,
        append_to: this._$vticks
      });
    }
  }
  highlight_holidays() {
    if (!this._precomputed_holidays || !this._precomputed_holidays.length)
      return;
    const t = this.grid_height - this.config.header_height;
    for (const e of this._precomputed_holidays)
      if (!(e.x + e.width < this._visible_start_px || e.x > this._visible_end_px))
        if (e.is_holiday) {
          if (e.label) {
            let i = this.create_el({
              classes: "holiday-label label_" + e.d_formatted,
              append_to: this.$extras
            });
            i.textContent = e.label;
          }
          u("rect", {
            x: e.x,
            y: this.config.header_height,
            width: e.width,
            height: t,
            class: "holiday-highlight " + e.d_formatted + (this.options.hover_on_date ? " grid-column" : ""),
            style: `fill: ${e.color};`,
            append_to: this._$vholidays
          });
        } else this.options.hover_on_date && u("rect", {
          x: e.x,
          y: this.config.header_height,
          width: e.width,
          height: t,
          class: "grid-column",
          append_to: this._$vholidays
        });
  }
  /**
   * Compute the horizontal x-axis distance and associated date for the current date and view.
   *
   * @returns Object containing the x-axis distance and date of the current date, or null if the current date is out of the gantt range.
   */
  highlight_current() {
    const t = this.get_closest_date();
    if (!t || !t[1]) return;
    const [e, i] = t;
    i.classList.add("current-date-highlight");
    const r = _.diff(
      /* @__PURE__ */ new Date(),
      this.gantt_start,
      this.config.unit
    ) / this.config.step * this.config.column_width;
    this.$current_highlight = this.create_el({
      top: this.config.header_height,
      left: r,
      height: this.grid_height - this.config.header_height,
      classes: "current-highlight",
      append_to: this.$container
    }), this.$current_ball_highlight = this.create_el({
      top: this.config.header_height - 6,
      left: r - 2.5,
      width: 6,
      height: 6,
      classes: "current-ball-highlight",
      append_to: this.$header
    });
  }
  make_grid_highlights() {
    if (this.highlight_holidays(), !this._ignored_positions_computed) {
      this.config.ignored_positions = [];
      for (let e = new Date(this.gantt_start); e <= this.gantt_end; e.setDate(e.getDate() + 1)) {
        if (!this.config.ignored_dates.find(
          (s) => s.getTime() == e.getTime()
        ) && (!this.config.ignored_function || !this.config.ignored_function(e)))
          continue;
        let i = _.convert_scales(
          _.diff(e, this.gantt_start) + "d",
          this.config.unit
        ) / this.config.step;
        this.config.ignored_positions.push(
          i * this.config.column_width
        );
      }
      this._ignored_positions_computed = !0;
    }
    const t = (this.options.bar_height + this.options.padding) * this.tasks.length;
    for (const e of this.config.ignored_positions)
      e + this.config.column_width < this._visible_start_px || e > this._visible_end_px || u("rect", {
        x: e,
        y: this.config.header_height,
        width: this.config.column_width,
        height: t,
        class: "ignored-bar",
        style: "fill: url(#diagonalHatch);",
        append_to: this._$vignored
      });
    this.highlight_current(this.config.view_mode);
  }
  create_el({ left: t, top: e, width: i, height: s, id: r, classes: o, append_to: a, type: h }) {
    let l = document.createElement(h || "div");
    for (let d of o.split(" ")) l.classList.add(d);
    return l.style.top = e + "px", l.style.left = t + "px", r && (l.id = r), i && (l.style.width = i + "px"), s && (l.style.height = s + "px"), a && a.appendChild(l), l;
  }
  make_dates() {
    const { startIdx: t, endIdx: e } = this._get_visible_date_range();
    for (let i = t; i <= e && i < this.dates.length; i++) {
      const s = this.dates[i], r = i > 0 ? this.dates[i - 1] : null, o = this._tick_x_positions[i], a = $(
        _.format(
          s,
          this.config.date_format,
          this.options.language
        )
      ), h = this.config.view_mode.lower_text(
        s,
        r,
        this.options.language
      ), l = this.config.view_mode.upper_text(
        s,
        r,
        this.options.language
      );
      if (h) {
        let d = this.create_el({
          left: o,
          top: this.options.upper_header_height + 5,
          classes: "lower-text date_" + a,
          append_to: this.$lower_header
        });
        d.innerText = h;
      }
      if (l) {
        let d = this.create_el({
          left: o,
          top: 17,
          classes: "upper-text",
          append_to: this.$upper_header
        });
        d.innerText = l;
      }
    }
    this.upperTexts = Array.from(
      this.$container.querySelectorAll(".upper-text")
    ), this.lowerTexts = Array.from(
      this.$container.querySelectorAll(".lower-text")
    );
  }
  get_dates_to_draw() {
    let t = null;
    return this.dates.map((i, s) => {
      const r = this.get_date_info(i, t, s);
      return t = r, r;
    });
  }
  get_date_info(t, e) {
    let i = e ? e.date : null;
    this.config.column_width;
    const s = e ? e.x + e.column_width : 0;
    let r = this.config.view_mode.upper_text, o = this.config.view_mode.lower_text;
    return r ? typeof r == "string" && (this.config.view_mode.upper_text = (a) => _.format(a, r, this.options.language)) : this.config.view_mode.upper_text = () => "", o ? typeof o == "string" && (this.config.view_mode.lower_text = (a) => _.format(a, o, this.options.language)) : this.config.view_mode.lower_text = () => "", {
      date: t,
      formatted_date: $(
        _.format(
          t,
          this.config.date_format,
          this.options.language
        )
      ),
      column_width: this.config.column_width,
      x: s,
      upper_text: this.config.view_mode.upper_text(
        t,
        i,
        this.options.language
      ),
      lower_text: this.config.view_mode.lower_text(
        t,
        i,
        this.options.language
      ),
      upper_y: 17,
      lower_y: this.options.upper_header_height + 5
    };
  }
  make_bars() {
    this.bars = this.tasks.map((t) => {
      const e = new I(this, t);
      return this.layers.bar.appendChild(e.group), e;
    });
  }
  make_arrows() {
    this.arrows = [];
    for (let t of this.tasks) {
      let e = [];
      e = t.dependencies.map((i) => {
        const s = this.get_task(i);
        if (!s) return;
        const r = new q(
          this,
          this.bars[s._index],
          // from_task
          this.bars[t._index]
          // to_task
        );
        return this.layers.arrow.appendChild(r.element), r;
      }).filter(Boolean), this.arrows = this.arrows.concat(e);
    }
  }
  map_arrows_on_bars() {
    for (let t of this.bars)
      t.arrows = this.arrows.filter((e) => e.from_task.task.id === t.task.id || e.to_task.task.id === t.task.id);
  }
  set_dimensions() {
    const { width: t } = this.$svg.getBoundingClientRect(), e = this.$svg.querySelector(".grid .grid-row") ? this.$svg.querySelector(".grid .grid-row").getAttribute("width") : 0;
    t < e && this.$svg.setAttribute("width", e);
  }
  set_scroll_position(t) {
    if (this.options.infinite_padding && (!t || t === "start")) {
      let [o, ...a] = this.get_start_end_positions();
      this.$container.scrollLeft = o;
      return;
    }
    if (!t || t === "start")
      t = this.gantt_start;
    else if (t === "end")
      t = this.gantt_end;
    else {
      if (t === "today")
        return this.scroll_current();
      typeof t == "string" && (t = _.parse(t));
    }
    const i = _.diff(
      t,
      this.gantt_start,
      this.config.unit
    ) / this.config.step * this.config.column_width;
    this.$container.scrollTo({
      left: i - this.config.column_width / 6,
      behavior: "smooth"
    }), this.$current && this.$current.classList.remove("current-upper"), this.current_date = _.add(
      this.gantt_start,
      this.$container.scrollLeft / this.config.column_width,
      this.config.unit
    );
    let s = this.config.view_mode.upper_text(
      this.current_date,
      null,
      this.options.language
    ), r = this.upperTexts.find(
      (o) => o.textContent === s
    );
    r && (this.current_date = _.add(
      this.gantt_start,
      (this.$container.scrollLeft + r.clientWidth) / this.config.column_width,
      this.config.unit
    ), s = this.config.view_mode.upper_text(
      this.current_date,
      null,
      this.options.language
    ), r = this.upperTexts.find((o) => o.textContent === s), r && (r.classList.add("current-upper"), this.$current = r));
  }
  scroll_current() {
    let t = this.get_closest_date();
    t && this.set_scroll_position(t[0]);
  }
  get_closest_date() {
    let t = /* @__PURE__ */ new Date();
    if (t < this.gantt_start || t > this.gantt_end) return null;
    let e = /* @__PURE__ */ new Date(), i = this.$container.querySelector(
      ".date_" + $(
        _.format(
          e,
          this.config.date_format,
          this.options.language
        )
      )
    ), s = 0;
    for (; !i && s < this.config.step; )
      e = _.add(e, -1, this.config.unit), i = this.$container.querySelector(
        ".date_" + $(
          _.format(
            e,
            this.config.date_format,
            this.options.language
          )
        )
      ), s++;
    return [
      /* @__PURE__ */ new Date(
        _.format(
          e,
          this.config.date_format,
          this.options.language
        ) + " "
      ),
      i
    ];
  }
  bind_grid_click() {
    p.on(
      this.$container,
      "click",
      ".grid-row, .grid-header, .ignored-bar, .holiday-highlight",
      () => {
        this.unselect_all(), this.hide_popup();
      }
    );
  }
  bind_holiday_labels() {
    const t = this.$container.querySelectorAll(".holiday-highlight");
    for (let e of t) {
      const i = this.$container.querySelector(
        ".label_" + e.classList[1]
      );
      if (!i) continue;
      let s;
      e.onmouseenter = (r) => {
        s = setTimeout(() => {
          i.classList.add("show"), i.style.left = (r.offsetX || r.layerX) + "px", i.style.top = (r.offsetY || r.layerY) + "px";
        }, 300);
      }, e.onmouseleave = (r) => {
        clearTimeout(s), i.classList.remove("show");
      };
    }
  }
  get_start_end_positions() {
    if (!this.bars.length) return [0, 0, 0];
    let { x: t, width: e } = this.bars[0].group.getBBox(), i = t, s = t, r = t + e;
    return Array.prototype.forEach.call(this.bars, function({ group: o }, a) {
      let { x: h, width: l } = o.getBBox();
      h < i && (i = h), h > s && (s = h), h + l > r && (r = h + l);
    }), [i, s, r];
  }
  bind_bar_events() {
    let t = !1, e = 0, i = 0, s = !1, r = !1, o = null, a = [];
    this.bar_being_dragged = null;
    const h = () => t || s || r;
    this.$svg.onclick = (d) => {
      d.target.classList.contains("grid-row") && this.unselect_all();
    };
    let l = 0;
    if (p.on(this.$svg, "mousemove", ".bar-wrapper, .handle", (d) => {
      this.bar_being_dragged === !1 && Math.abs((d.offsetX || d.layerX) - l) > 10 && (this.bar_being_dragged = !0);
    }), p.on(this.$svg, "mousedown", ".grid-column", (d) => {
      this.trigger_event("date_click", [this.getDateFromClick(d)]);
    }), p.on(this.$svg, "mousedown", ".bar-wrapper, .handle", (d, c) => {
      const g = p.closest(".bar-wrapper", c);
      c.classList.contains("left") ? (s = !0, c.classList.add("visible")) : c.classList.contains("right") ? (r = !0, c.classList.add("visible")) : c.classList.contains("bar-wrapper") && (t = !0), this.popup && this.popup.hide(), e = d.offsetX || d.layerX, o = g.getAttribute("data-id");
      let f;
      this.options.move_dependencies ? f = [
        o,
        ...this.get_all_dependent_tasks(o)
      ] : f = [o], a = f.map((x) => this.get_bar(x)), this.bar_being_dragged = !1, l = e, a.forEach((x) => {
        const m = x.$bar;
        m.ox = m.getX(), m.oy = m.getY(), m.owidth = m.getWidth(), m.finaldx = 0;
      });
    }), this.options.infinite_padding) {
      let d = !1;
      p.on(this.$container, "mousewheel", (c) => {
        let g = this.$container.scrollWidth / 2;
        if (!d && c.currentTarget.scrollLeft <= g) {
          let f = c.currentTarget.scrollLeft;
          d = !0, this.gantt_start = _.add(
            this.gantt_start,
            -this.config.extend_by_units,
            this.config.unit
          ), this.setup_date_values(), this.render(), c.currentTarget.scrollLeft = f + this.config.column_width * this.config.extend_by_units, setTimeout(() => d = !1, 300);
        }
        if (!d && c.currentTarget.scrollWidth - (c.currentTarget.scrollLeft + c.currentTarget.clientWidth) <= g) {
          let f = c.currentTarget.scrollLeft;
          d = !0, this.gantt_end = _.add(
            this.gantt_end,
            this.config.extend_by_units,
            this.config.unit
          ), this.setup_date_values(), this.render(), c.currentTarget.scrollLeft = f, setTimeout(() => d = !1, 300);
        }
      });
    }
    p.on(this.$container, "scroll", (d) => {
      let c = [];
      const g = this.bars.map(
        ({ group: b }) => b.getAttribute("data-id")
      );
      let f;
      i && (f = d.currentTarget.scrollLeft - i), this.current_date = _.add(
        this.gantt_start,
        d.currentTarget.scrollLeft / this.config.column_width * this.config.step,
        this.config.unit
      );
      let x = this.config.view_mode.upper_text(
        this.current_date,
        null,
        this.options.language
      ), m = this.upperTexts.find(
        (b) => b.textContent === x
      );
      if (!m || (this.current_date = _.add(
        this.gantt_start,
        (d.currentTarget.scrollLeft + m.clientWidth) / this.config.column_width * this.config.step,
        this.config.unit
      ), x = this.config.view_mode.upper_text(
        this.current_date,
        null,
        this.options.language
      ), m = this.upperTexts.find(
        (b) => b.textContent === x
      ), !m)) return;
      m !== this.$current && (this.$current && this.$current.classList.remove("current-upper"), m.classList.add("current-upper"), this.$current = m), i = d.currentTarget.scrollLeft;
      let [E, H, X] = this.get_start_end_positions();
      i > X + 100 ? (this.$adjust.innerHTML = "&larr;", this.$adjust.classList.remove("hide"), this.$adjust.onclick = () => {
        this.$container.scrollTo({
          left: H,
          behavior: "smooth"
        });
      }) : i + d.currentTarget.offsetWidth < E - 100 ? (this.$adjust.innerHTML = "&rarr;", this.$adjust.classList.remove("hide"), this.$adjust.onclick = () => {
        this.$container.scrollTo({
          left: E,
          behavior: "smooth"
        });
      }) : this.$adjust.classList.add("hide"), f && (c = g.map((b) => this.get_bar(b)), this.options.auto_move_label && c.forEach((b) => {
        b.update_label_position_on_horizontal_scroll({
          x: f,
          sx: d.currentTarget.scrollLeft
        });
      }));
    }), p.on(this.$svg, "mousemove", (d) => {
      if (!h()) return;
      const c = (d.offsetX || d.layerX) - e;
      a.forEach((g) => {
        const f = g.$bar;
        f.finaldx = this.get_snap_position(c, f.ox), this.hide_popup(), s ? o === g.task.id ? g.update_bar_position({
          x: f.ox + f.finaldx,
          width: f.owidth - f.finaldx
        }) : g.update_bar_position({
          x: f.ox + f.finaldx
        }) : r ? o === g.task.id && g.update_bar_position({
          width: f.owidth + f.finaldx
        }) : t && !this.options.readonly && !this.options.readonly_dates && g.update_bar_position({ x: f.ox + f.finaldx });
      });
    }), document.addEventListener("mouseup", () => {
      var d, c, g;
      t = !1, s = !1, r = !1, (g = (c = (d = this.$container.querySelector(".visible")) == null ? void 0 : d.classList) == null ? void 0 : c.remove) == null || g.call(c, "visible");
    }), p.on(this.$svg, "mouseup", (d) => {
      this.bar_being_dragged = null, a.forEach((c) => {
        c.$bar.finaldx && (c.date_changed(), c.compute_progress(), c.set_action_completed());
      });
    }), this.bind_bar_progress();
  }
  bind_bar_progress() {
    let t = 0, e = null, i = null, s = null, r = null;
    p.on(this.$svg, "mousedown", ".handle.progress", (a, h) => {
      e = !0, t = a.offsetX || a.layerX;
      const d = p.closest(".bar-wrapper", h).getAttribute("data-id");
      i = this.get_bar(d), s = i.$bar_progress, r = i.$bar, s.finaldx = 0, s.owidth = s.getWidth(), s.min_dx = -s.owidth, s.max_dx = r.getWidth() - s.getWidth();
    });
    const o = this.config.ignored_positions.map((a) => [
      a,
      a + this.config.column_width
    ]);
    p.on(this.$svg, "mousemove", (a) => {
      if (!e) return;
      let h = a.offsetX || a.layerX;
      if (h > t) {
        let c = o.find(
          ([g, f]) => h >= g && h < f
        );
        for (; c; )
          h = c[1], c = o.find(
            ([g, f]) => h >= g && h < f
          );
      } else {
        let c = o.find(
          ([g, f]) => h > g && h <= f
        );
        for (; c; )
          h = c[0], c = o.find(
            ([g, f]) => h > g && h <= f
          );
      }
      let d = h - t;
      d > s.max_dx && (d = s.max_dx), d < s.min_dx && (d = s.min_dx), s.setAttribute("width", s.owidth + d), p.attr(i.$handle_progress, "cx", s.getEndX()), s.finaldx = d;
    }), p.on(this.$svg, "mouseup", () => {
      e = !1, s && s.finaldx && (s.finaldx = 0, i.progress_changed(), i.set_action_completed(), i = null, s = null, r = null);
    });
  }
  get_all_dependent_tasks(t) {
    let e = [], i = [t];
    for (; i.length; ) {
      const s = i.reduce((r, o) => (r = r.concat(this.dependency_map[o]), r), []);
      e = e.concat(s), i = s.filter(
        (r) => !i.includes(r) && !e.includes(r)
      );
    }
    return e.filter(Boolean);
  }
  get_snap_position(t, e) {
    let i = 1;
    const s = this.options.snap_at || this.config.view_mode.snap_at || "1d";
    if (s !== "unit") {
      const { duration: d, scale: c } = _.parse_duration(s);
      i = _.convert_scales(this.config.view_mode.step, c) / d;
    }
    const r = t % (this.config.column_width / i);
    let o = t - r + (r < this.config.column_width / i * 2 ? 0 : this.config.column_width / i), a = e + o;
    const h = o > 0 ? 1 : -1;
    let l = this.get_ignored_region(a, h);
    for (; l.length; )
      a += this.config.column_width * h, l = this.get_ignored_region(a, h), l.length || (a -= this.config.column_width * h);
    return a - e;
  }
  get_ignored_region(t, e = 1) {
    return e === 1 ? this.config.ignored_positions.filter((i) => t > i && t <= i + this.config.column_width) : this.config.ignored_positions.filter(
      (i) => t >= i && t < i + this.config.column_width
    );
  }
  unselect_all() {
    this.popup && this.popup.parent.classList.add("hide"), this.$container.querySelectorAll(".date-range-highlight").forEach((t) => t.classList.add("hide"));
  }
  view_is(t) {
    return typeof t == "string" ? this.config.view_mode.name === t : Array.isArray(t) ? t.some(view_is) : this.config.view_mode.name === t.name;
  }
  get_task(t) {
    return this.tasks.find((e) => e.id === t);
  }
  get_bar(t) {
    return this.bars.find((e) => e.task.id === t);
  }
  show_popup(t) {
    this.options.popup !== !1 && (this.popup || (this.popup = new F(
      this.$popup_wrapper,
      this.options.popup,
      this
    )), this.popup.show(t));
  }
  hide_popup() {
    this.popup && this.popup.hide();
  }
  trigger_event(t, e) {
    this.options["on_" + t] && this.options["on_" + t].apply(this, e);
  }
  view_is(t) {
    return this.options.view_mode.name === t;
  }
  getDateFromClick(t) {
    const e = this.$svg.getBoundingClientRect(), i = t.clientX - e.left, s = this.lowerTexts;
    if (!s.length) return null;
    const r = Math.floor(i / this.config.column_width), o = s[r];
    if (!o) return null;
    const a = o.className.match(/date_(\d{4}-\d{2}-\d{2})/);
    return a ? a[1] : null;
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
    var t, e, i, s, r, o, a, h, l, d, c, g;
    this.$svg.innerHTML = "", (e = (t = this.$header) == null ? void 0 : t.remove) == null || e.call(t), (s = (i = this.$side_header) == null ? void 0 : i.remove) == null || s.call(i), (o = (r = this.$current_highlight) == null ? void 0 : r.remove) == null || o.call(r), (h = (a = this.$current_ball_highlight) == null ? void 0 : a.remove) == null || h.call(a), (d = (l = this.$extras) == null ? void 0 : l.remove) == null || d.call(l), (g = (c = this.popup) == null ? void 0 : c.hide) == null || g.call(c), this._ignored_positions_computed = !1;
  }
}
B.VIEW_MODE = {
  HOUR: w[0],
  QUARTER_DAY: w[1],
  HALF_DAY: w[2],
  DAY: w[3],
  WEEK: w[4],
  MONTH: w[5],
  YEAR: w[6]
};
function N(n) {
  return n.name + "_" + Math.random().toString(36).slice(2, 12);
}
function $(n) {
  return n.replaceAll(" ", "_").replaceAll(":", "_").replaceAll(".", "_");
}
export {
  B as default
};
