# A mod of [https://github.com/frappe/gantt](https://github.com/frappe/gantt) for optional grouping feature for v.0.8.1

## 🆕 Note about update
I made it to work with grouping so that more than one tasks can go in same row.
Check `index.html` to see working example.

You need to pass an option `enable_grouping: true` this way behevior can be controlled. You can also set custom grups indices like `groups: [0,1,2,3,4]`.

### Install

```
npm i frappe-gantt-fix-for-grouping
```

### Usage

You need to add following to options

```js
new Gantt('.gantt-target', tasks, {
    enable_grouping:  true,
    // Other options...
});
```
To set custom index you can do like this is useful if you want to set labels with fixed values
```js
new Gantt('.gantt-target', tasks, {
    enable_grouping:  true,
    groups: [0,1,2,3,4],
    // Other options...
});
```

and tasks will be like
```js
let tasks = [
    {
        start: '2024-03-30',
        duration: '12h',
        name: 'Write new content',
        id: 'Task 1',
        progress: 5,
        // important: true,
        group: 0,
    },
    {
        start: '2024-04-01',
        end: '2024-04-01',
        name: 'Redesign website',
        id: 'Task 0',
        progress: 30,
        group: 0,
    },
    {
        start: '2024-04-02',
        end: '2024-04-02',
        name: 'Apply new styles',
        id: 'Task 2',
        progress: 80,
        group: 0,
    },
    {
        start: '2024-04-04',
        end: '2024-04-04',
        name: 'Review',
        id: 'Task 3',
        progress: 5,
        group: 1,
    },
    {
        start: '2024-04-06',
        end: '2024-04-06',
        name: 'Deploy',
        id: 'Task 4',
        progress: 0,
        group: 1,
    },
];
```
### ⚠️ For full docs [check official docs](https://github.com/frappe/gantt) and source of this mod [https://github.com/iaminamcom/gantt-fix](https://github.com/iaminamcom/gantt-fix).