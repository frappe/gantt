# Frappé Gantt
A simple, interactive, modern gantt chart library for the web

![image](https://cloud.githubusercontent.com/assets/9355208/19997551/5bc597f2-a28d-11e6-809a-4cfa5fdf96d2.png)

####View the demo [here](https://frappe.github.io/gantt).

###Install
```
npm install frappe-gantt
```

###Usage
Include it in your html:
```
<script src="frappe-gantt.js"></script>
```

And start hacking:
```
var gantt = new Gantt(
  "#gantt",
  [
    {
      start: "2016-10-04", end: "2016-10-10",
      id: 0, name: "Explore ERPNext"
    },
    ...
  ]
});
```

If you want to contribute:

1. Clone this repo.
2. `cd` into project directory
3. `npm install`
4. `npm run dev`


------------------
Project maintained by [frappe](https://github.com/frappe)