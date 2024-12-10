<div align="center" markdown="1">
    <img src="https://github.com/frappe/design/blob/master/logos/logo-2019/frappe-gantt-logo.png" width="100">
    <h1>Frappe Gantt</h1>

**A modern, configurable, Gantt library for the web. Completely Open Source.**

![GitHub release (latest)](https://img.shields.io/github/v/release/frappe/gantt)
    <br/>
![GitHub stars](https://img.shields.io/github/stars/frappe/gantt)
![GitHub forks](https://img.shields.io/github/forks/frappe/gantt)
    
</div>

<div align="center">
	<img src=".github/hero-image.png" alt="Hero Image" width="72%" />
</div>

### Install

```
npm install frappe-gantt
```

## About
A Gantt chart is a bar chart that visually illustrates a project's schedule, tasks, and dependencies. With Frappe Gantt, you can easily build beautiful Gantt charts, with extensive levels of configurability.

You can use it anywhere from hobby projects to tracking the goals of your team at the worksplace.

[ERPNext](https://erpnext.com/) uses Frappe Gantt.


## Motivation
We at Frappe built Gantt after realizing that although Gantt charts are everywhere, there was no open source implementation.

Today, we pride ourselves on having the most aesthetically pleasing _and_ powerful Gantt library on the market - except it's free!


## Key Features
- A wide variety of modes - be it day, hour, or year, you have it. Or add your own modes!
- Easily ignore time periods from your tasks' progress calculation
- An incredible amount of configurability: spacing, edit access, labels, you can control it all.
- Multi-lingual support
- Powerful API to integrate Frappe Gantt into your product.

### Usage
Include it in your HTML:

```
<script src="frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="frappe-gantt.css">
```

Or from the CDN:
```
<script src="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.css">
```

And start hacking:
```js
let tasks = [
  {
    id: '1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20
  },
  ...
]
let gantt = new Gantt("#gantt", tasks);
```

To see the list of all options, check out [the docs](docs.frappe.io/gantt) (under development).

## Development Setup
If you want to contribute enhancements or fixes:

1. Clone this repo.
2. `cd` into project directory
3. `pnpm i`
4. `pnpm run build` - or `pnpm run build-dev` to watch for changes!
5. Open `index.html` in your browser
6. Make your code changes and test them.

---
License: MIT
