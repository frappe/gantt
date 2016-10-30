
var tasks = [
    {
        start: "2016-10-04",
        end: "2016-10-10",
        name: "Explore ERPNext",
        id: 0,
        progress: 30
    },
    {
        start: "2016-10-04",
        end: "2016-10-06",
        name: "Run Sales Cycle",
        id: 1,
        progress: 40
    },
    {
        start: "2016-10-06",
        end: "2016-10-08",
        name: "Run Billing Cycle",
        id: 2,
        progress: 30
    },
    {
        start: "2016-10-08",
        end: "2016-10-10",
        name: "Run Purchase Cycle",
        id: 3,
        progress: 20
    },
    {
        start: "2016-10-10",
        end: "2016-10-11",
        name: "Import Data",
        id: 4,
        progress: 0
    },
    {
        start: "2016-10-11",
        end: "2016-10-11",
        name: "Go Live!",
        id: 5,
        progress: 0
    }
]
var gantt = new Gantt({
    parent_selector: '#gantt',
    tasks: tasks,
    date_format: "YYYY-MM-DD",
    bar: {
        height: 24
    },
    events: {
        bar_on_click: function (task) {
            console.log(task);
        },
        bar_on_date_change: function (task, start, end) {
            console.log(task, start, end);
        },
        bar_on_progress_change: function (task, progress) {
            console.log(task, progress);
        },
        on_viewmode_change: function (mode) {
            console.log(mode);
        }
    }
});
gantt.render();
