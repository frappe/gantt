
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
var gantt_1 = new Gantt({
    parent_selector: '#gantt-1',
    tasks: tasks,
    date_format: "YYYY-MM-DD",
    events: {
        on_viewmode_change: function (mode) { }
    }
});
gantt_1.render();

var gantt_2 = new Gantt({
    parent_selector: '#gantt-2',
    tasks: tasks,
    date_format: "YYYY-MM-DD",
    events: {
        on_viewmode_change: function (mode) { }
    }
});
gantt_2.render();
gantt_2.set_view_mode('Half Day');

$(function() {
    $(".gantt-2 .btn-group").on("click", "button", function() {
        $btn = $(this);
        var mode = $btn.text();
        gantt_2.set_view_mode(mode);
        $btn.parent().find('button').removeClass('active');
        $btn.addClass('active');
    });
});

var gantt_3 = new Gantt({
    parent_selector: '#gantt-3',
    tasks: tasks,
    date_format: "YYYY-MM-DD",
    events: {
        bar_on_click: function (task) {
            console.log('bar_on_click', task);
        },
        bar_on_date_change: function (task, start, end) {
            console.log('bar_on_date_change', task, start, end);
        },
        bar_on_progress_change: function (task, progress) {
            console.log('bar_on_progress_change', task, progress);
        },
        on_viewmode_change: function (mode) {
            console.log('on_viewmode_change', mode);
        }
    }
});
gantt_3.render();
