<div align="center" markdown="1">
    <img src=".github/gantt-logo.jpg" width="80">
    <h1>Frappe Gantt</h1>

**A modern, configurable, Gantt library for the web.**
</div>

![Hero Image](.github/hero-image.png)

## Frappe Gantt
Gantt charts are bar charts that visually illustrate a project's tasks, schedule, and dependencies. With Frappe Gantt, you can build beautiful, customizable, Gantt charts with ease.

You can use it anywhere from hobby projects to tracking the goals of your team at the worksplace.

[ERPNext](https://erpnext.com/) uses Frappe Gantt.


### Motivation
I needed a Gantt View for ERPNext. Surprisingly, I couldn't find a visually appealing Gantt library that was open source - so I decided to build it. Initially, the design was heavily inspired by Google Gantt and DHTMLX.


### Key Features
- **Customizable Views**: customize the timeline based on various time periods - day, hour, or year, you have it. You can also create your own views.
- **Ignore Periods**: exclude weekends and other holidays from your tasks' progress calculation.
- **Configure Anything**: spacing, edit access, labels, you can control it all. Change both the style and functionality to meet your needs.
- **Multi-lingual Support**: suitable for companies with an international base.

## Usage

Install with:
```bash
npm install frappe-gantt
```

Include it in your HTML:

```html
<script src="frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="frappe-gantt.css">
```

Or from the CDN:
```html
<script src="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/frappe-gantt/dist/frappe-gantt.css">
```

Star using Gantt:
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

<!-- To see the list of all options, check out [the docs](docs.frappe.io/gantt) (under development). -->


## Development Setup
If you want to contribute enhancements or fixes:

1. Clone this repo.
2. `cd` into project directory.
3. Run `pnpm i` to install dependencies.
4. `pnpm run build` to build files - or `pnpm run build-dev` to build and watch for changes.
5. Open `index.html` in your browser.
6. Make your code changes and test them.

<br />
<br />
<div align="center" style="padding-top: 0.75rem;">
	<a href="https://frappe.io" target="_blank">
		<picture>
			<source media="(prefers-color-scheme: dark)" srcset="https://frappe.io/files/Frappe-white.png">
			<img src="https://frappe.io/files/Frappe-black.png" alt="Frappe Technologies" height="28"/>
		</picture>
	</a>
</div>
