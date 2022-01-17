<div align="center">
    <img src="https://github.com/frappe/design/blob/master/logos/logo-2019/frappe-gantt-logo.png" height="128">
    <h2>Frappe Gantt</h2>
    <p align="center">
        <p>A simple, interactive, modern gantt chart library for the web</p>
        <a href="https://frappe.github.io/gantt">
            <b>View the demo »</b>
        </a>
    </p>
</div>

<p align="center">
    <a href="https://frappe.github.io/gantt">
        <img src="https://cloud.githubusercontent.com/assets/9355208/21537921/4a38b194-cdbd-11e6-8110-e0da19678a6d.png">
    </a>
</p>

### Install
```
npm install frappe-gantt
```

### Usage
Include it in your HTML:
```
<script src="frappe-gantt.min.js"></script>
<link rel="stylesheet" href="frappe-gantt.css">
```

And start hacking:
```js
var tasks = [
  {
    id: 'Task 1',
    name: 'Redesign website',
    start: '2016-12-28',
    end: '2016-12-31',
    progress: 20,
    dependencies: 'Task 2, Task 3',
    custom_class: 'bar-milestone' // optional
  },
  ...
]
var gantt = new Gantt("#gantt", tasks);
```

You can also pass various options to the Gantt constructor:
```js
var gantt = new Gantt("#gantt", tasks, {
    header_height: 50,
    column_width: 30,
    step: 24,
    view_modes: ['Quarter Day', 'Half Day', 'Day', 'Week', 'Month'],
    bar_height: 20,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Day',
    date_format: 'YYYY-MM-DD',
    custom_popup_html: null
});
```

### Contributing
If you want to contribute enhancements or fixes:

1. Clone this repo.
2. `cd` into project directory
3. `yarn`
4. `yarn run dev`
5. Open `index.html` in your browser, make your code changes and test them.

### Publishing
If you have publishing rights (Frappe Team), follow these steps to publish a new version.

Assuming the last commit (or a couple of commits) were enhancements or fixes,

1. Run `yarn build`

   This will generate files in the `dist/` folder. These files need to be committed.
1. Run `yarn publish`
1. Type the new version at the prompt

   Depending on the type of change, you can either bump the patch version or the minor version.
   For e.g.,
   ```
   0.5.0 -> 0.6.0 (minor version bump)
   0.5.0 -> 0.5.1 (patch version bump)
   ```
1. Now, there will be a commit named after the version you just entered. Include the generated files in `dist/` folder as part of this commit by running the command:
   ```
   git add dist
   git commit --amend
   git push origin master
   ```

License: MIT

------------------
Project maintained by [frappe](https://github.com/frappe)
