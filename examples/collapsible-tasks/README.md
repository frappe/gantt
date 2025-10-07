# Collapsible Dependent Tasks Feature

## Overview
This implementation adds the ability to collapse and expand dependent tasks in the Frappe Gantt chart. Tasks that have dependencies can be collapsed to hide all their dependent tasks, making it easier to focus on high-level tasks and manage complex project hierarchies.

## Features Implemented

### 1. Collapse/Expand Toggle Button
- Tasks that have dependents display a collapse/expand button (−/+) on the left side of the task bar
- Click the button to toggle between collapsed and expanded states
- Visual feedback with appropriate icons (− for expanded, + for collapsed)

### 2. Dependency Tracking
- Automatically detects which tasks have dependents
- Recursively identifies all dependent tasks (including nested dependencies)
- Maintains collapsed state across re-renders

### 3. Smart Visibility Management
- When a task is collapsed, all its dependent tasks are hidden
- Arrows (dependencies) are also hidden for invisible tasks
- The chart layout automatically adjusts to remove gaps from hidden tasks

### 4. Dynamic Layout Adjustment
- Grid height automatically recalculates based on visible tasks
- Task positions are updated to maintain proper spacing
- No visual gaps when tasks are hidden

## Implementation Details

### Modified Files

1. **src/index.js**
   - Added `collapsed_tasks` Set to track collapsed state
   - Added `tasks_with_dependents` Set to identify collapsible tasks
   - Implemented `get_all_dependent_tasks()` for recursive dependency tracking
   - Implemented `toggle_task_collapse()` for state management
   - Implemented `is_task_visible()` to check task visibility
   - Modified `make_bars()` to handle visible/hidden tasks
   - Modified `make_arrows()` to only show arrows for visible tasks
   - Added `bind_collapse_buttons()` for event handling
   - Updated grid calculations to use visible task count

2. **src/bar.js**
   - Modified `draw_label()` to add collapse/expand button for tasks with dependents
   - Button includes visual styling and click target

## Usage

### Basic Usage
```javascript
const tasks = [
    {
        id: 'task1',
        name: 'Main Task',
        start: '2025-10-01',
        end: '2025-10-05',
        dependencies: []
    },
    {
        id: 'task2',
        name: 'Dependent Task',
        start: '2025-10-06',
        end: '2025-10-10',
        dependencies: ['task1']
    }
];

const gantt = new Gantt('#gantt', tasks);
```

### Programmatic Control
```javascript
// Toggle collapse state of a task
gantt.toggle_task_collapse('task1');

// Check if a task is visible
const isVisible = gantt.is_task_visible('task2');

// Get all dependent tasks
const dependents = gantt.get_all_dependent_tasks('task1');

// Check which tasks have dependents
const collapsibleTasks = Array.from(gantt.tasks_with_dependents);
```

## Demo
Open `collapsible-tasks-demo.html` in a browser to see the feature in action. The demo includes:
- A project with multiple tasks and dependencies
- Tasks with nested dependencies
- Visual demonstration of collapse/expand functionality

To run the demo:
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Open http://localhost:5173/collapsible-tasks-demo.html

## Browser Compatibility
This feature uses standard JavaScript and SVG, so it should work in all modern browsers that support the base Frappe Gantt library.

## Future Enhancements
Potential improvements that could be added:
1. Collapse/expand all buttons
2. Keyboard shortcuts for collapse/expand
3. Animation transitions when collapsing/expanding
4. Persistence of collapsed state (localStorage)
5. Indentation to show task hierarchy visually
6. Option to collapse by task groups or categories