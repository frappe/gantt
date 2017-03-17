# Frappé Gantt
A simple, interactive, modern gantt chart library for the web

![image](https://cloud.githubusercontent.com/assets/9355208/21537921/4a38b194-cdbd-11e6-8110-e0da19678a6d.png)

####View the demo [here](https://frappe.github.io/gantt).

###Install
```
npm install frappe-gantt
```

###Usage
Include it in your html:
```
<script src="frappe-gantt.min.js"></script>
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
	bar_class: '',  # optional
	progress_class: '',  # optional
	label_class: 'my-class-label'  # optional
  },
  ...
]
var gantt = new Gantt("#gantt", tasks);
```

If you want to contribute:

1. Clone this repo.
2. `cd` into project directory
3. `npm install`
4. `npm run dev`

License: MIT

------------------
Project maintained by [frappe](https://github.com/frappe)