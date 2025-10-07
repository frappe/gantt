# Frappe Gantt Library - Architecture Documentation

## Overview

**Frappe Gantt** is a modern, interactive **Gantt chart** library built with **vanilla JavaScript** and **SVG**. It provides a highly customizable and extensible solution for project timeline visualization with features like **drag-and-drop** editing, **dependency management**, and multiple **view modes**.

### Key Terms Explained:
- **Gantt Chart**: A visual project management tool that shows tasks as horizontal bars on a timeline
- **Vanilla JavaScript**: Plain JavaScript without any frameworks (like React or Vue)
- **SVG (Scalable Vector Graphics)**: A web standard for creating graphics that scale perfectly at any size
- **Drag-and-Drop**: The ability to click and move elements with your mouse
- **Dependency Management**: Showing how tasks depend on each other (Task B can't start until Task A finishes)
- **View Modes**: Different ways to display time (by day, week, month, etc.)

## Core Architecture

### 1. Main Components

#### 1.1 Gantt Class (`src/index.js`)
The **main orchestrator class** that coordinates all components:

```javascript
class Gantt {
    constructor(wrapper, tasks, options) {
        this.setup_wrapper(wrapper);     // DOM setup - creates the HTML container
        this.setup_options(options);     // Configuration - sets up all the settings
        this.setup_tasks(tasks);         // Task processing - prepares your project data
        this.change_view_mode();         // View initialization - sets up the timeline view
        this.bind_events();              // Event handling - makes it interactive
    }
}
```

**Key Responsibilities:**
- **DOM element setup** and **SVG container creation** - Creates the visual area where the chart appears
- **Configuration management** with **defaults merging** - Combines your settings with built-in defaults
- **Task data processing** and **validation** - Checks and prepares your project tasks
- **Rendering orchestration** (grid, bars, arrows, dates) - Draws all the visual elements
- **Event handling** for user interactions - Responds to clicks, drags, etc.
- **View mode management** and switching - Changes between day/week/month views

### Beginner Explanation:
Think of the Gantt class as the "conductor of an orchestra" - it doesn't play the music itself, but it coordinates all the musicians (other components) to create a beautiful symphony (your Gantt chart).

#### 1.2 Bar Component (`src/bar.js`)
Represents individual **task bars** in the Gantt chart:

```javascript
class Bar {
    constructor(gantt, task) {
        this.set_defaults(gantt, task);    // Set up basic properties
        this.prepare_wrappers();           // Create the visual container
        this.prepare_helpers();            // Set up interactive elements
        this.refresh();                    // Draw the bar on screen
    }
}
```

**Features:**
- **Visual task representation** with **progress bars** - Shows each task as a colored rectangle
- **Drag-and-drop functionality** for date changes - Move tasks by clicking and dragging
- **Resize handles** for duration modification - Drag the edges to change task length
- **Progress handle** for completion tracking - Visual indicator of how much is done
- **Label positioning** and **overflow handling** - Smart text placement that doesn't overlap
- **Thumbnail/image support** - Can show small images in task bars
- **Interactive events** (click, hover, double-click) - Responds to user actions

### Beginner Explanation:
Each task in your project becomes a "bar" - like a horizontal rectangle on the timeline. You can drag it to change when it happens, resize it to change how long it takes, and see a progress indicator showing how much is completed.

#### 1.3 Arrow Component (`src/arrow.js`)
Manages **dependency arrows** between tasks:

```javascript
class Arrow {
    constructor(gantt, from_task, to_task) {
        this.calculate_path();    // Figure out the arrow's curved path
        this.draw();              // Draw the arrow on screen
    }
}
```

**Features:**
- **SVG path calculation** for **curved arrows** - Creates smooth, curved lines between tasks
- **Automatic positioning** based on task locations - Arrows automatically connect to the right spots
- **Collision detection** and **path optimization** - Avoids overlapping with other elements
- **Real-time updates** when tasks move - Arrows follow tasks when you drag them

### Beginner Explanation:
When Task A must finish before Task B can start, an arrow connects them. It's like a visual "road" showing the sequence of work. The arrow automatically curves around obstacles and updates when you move tasks around.

#### 1.4 Popup Component (`src/popup.js`)
Handles **task information popups**:

```javascript
class Popup {
    constructor(parent, popup_func, gantt) {
        this.make();    // Create and show the popup
    }
}
```

**Features:**
- **Customizable popup content** via function - You can design what information shows up
- **Title, subtitle, details, and actions sections** - Organized information display
- **Dynamic positioning** - Popup appears near your mouse cursor
- **Action button support** - Can include buttons for editing, deleting, etc.

### Beginner Explanation:
When you click on a task, a small window (popup) appears with detailed information about that task. It's like a "tooltip" but much more detailed, showing everything you need to know about the task and giving you buttons to take actions.

### 2. Utility Modules

#### 2.1 Date Utilities (`src/date_utils.js`)
**Comprehensive date manipulation library**:

```javascript
export default {
    parse_duration(duration),     // Parse strings like "1d", "2h" - converts "1d" to 1 day
    parse(date),                  // Parse various date formats - handles "2024-01-01", "Jan 1, 2024", etc.
    format(date, format, lang),   // Format dates with i18n support - shows dates in different languages
    diff(date_a, date_b, scale),  // Calculate differences - finds time between two dates
    add(date, qty, scale),        // Add time to dates - adds 5 days to a date
    start_of(date, scale),        // Get start of period - gets the first day of the month
    convert_scales(period, to),   // Convert between time units - converts days to hours
    // ... and more
}
```

**Key Features:**
- **Multi-language date formatting** using **Intl API** - Shows dates in different languages (English, Spanish, etc.)
- **Flexible duration parsing** (1d, 2h, 30min, etc.) - Understands shortcuts like "1d" for "1 day"
- **Time zone handling** - Works correctly across different time zones
- **Scale conversions** (days to hours, months to days, etc.) - Converts between different time units

### Beginner Explanation:
This is like a "smart calculator" for dates and times. It can understand different ways people write dates ("January 1, 2024" or "2024-01-01"), convert between time units (days to hours), and format dates in different languages. It's the "brain" that handles all the complex date math.

#### 2.2 SVG Utilities (`src/svg_utils.js`)
**SVG manipulation helpers**:

```javascript
export function createSVG(tag, attrs)     // Create SVG elements - makes shapes, lines, etc.
export function animateSVG(element, ...)  // SVG animations - makes things move smoothly
export function $(expr, con)              // DOM query helper - finds elements on the page
```

**Features:**
- **SVG element creation** with **attribute handling** - Creates visual elements like rectangles, circles, lines
- **Animation support** with **cubic-bezier easing** - Makes smooth, natural-looking movements
- **Event delegation utilities** - Efficiently handles clicks and other interactions
- **DOM manipulation helpers** - Tools for finding and modifying webpage elements

### Beginner Explanation:
SVG (Scalable Vector Graphics) is how the library draws all the visual elements - the task bars, arrows, grid lines, etc. These utilities are like "art tools" that help create and animate all the visual parts of the Gantt chart. Think of it as the "paintbrush and canvas" for the chart.

### 3. Configuration System

#### 3.1 Default Options (`src/defaults.js`)
**Comprehensive configuration** with **sensible defaults**:

```javascript
const DEFAULT_OPTIONS = {
    // Visual settings - how things look
    bar_height: 30,              // Height of task bars in pixels
    bar_corner_radius: 3,        // Rounded corners on task bars
    column_width: null,          // Width of time columns (auto if null)
    padding: 18,                 // Space around the chart
    
    // Behavior settings - how it behaves
    readonly: false,             // Can users edit tasks?
    readonly_dates: false,       // Can users change dates?
    readonly_progress: false,    // Can users change progress?
    move_dependencies: true,     // Do dependency arrows move with tasks?
    
    // View settings - how time is displayed
    view_mode: 'Day',            // Default time view (Day, Week, Month, etc.)
    view_modes: DEFAULT_VIEW_MODES,  // Available time views
    scroll_to: 'today',          // Where to start when chart loads
    
    // And many more...
};
```

### Beginner Explanation:
This is like the "settings menu" for the Gantt chart. It defines all the default behaviors - how tall the task bars are, whether users can edit things, what time view to start with, etc. You can override any of these settings when you create your chart.

#### 3.2 View Modes
**Predefined time scales** with **custom formatting**:

```javascript
const DEFAULT_VIEW_MODES = [
    { name: 'Hour', step: '1h', padding: '7d', ... },    // Show by hours
    { name: 'Day', step: '1d', padding: '7d', ... },     // Show by days
    { name: 'Week', step: '7d', padding: '1m', ... },    // Show by weeks
    { name: 'Month', step: '1m', padding: '2m', ... },   // Show by months
    { name: 'Year', step: '1y', padding: '2y', ... }     // Show by years
];
```

Each **view mode** defines:
- **`step`**: Time increment between columns - how much time each column represents
- **`padding`**: Additional time before/after tasks - extra space around your project
- **`column_width`**: Width of each time column - how wide each time slot appears
- **`lower_text`/`upper_text`**: Date formatting functions - how dates are displayed
- **`thick_line`**: Function to determine thick grid lines - which grid lines are emphasized

### Beginner Explanation:
View modes are like different "zoom levels" for your timeline. You can look at your project by the hour (for detailed daily planning), by the day (for weekly planning), by the month (for long-term planning), etc. Each mode shows the same tasks but with different time scales.

### 4. Rendering System

#### 4.1 Layer Architecture
SVG elements are organized in layers for proper z-ordering:

```javascript
const layers = ['grid', 'arrow', 'progress', 'bar'];
```

**Layer Order (bottom to top):**
1. **Grid Layer**: Background, rows, ticks, highlights
2. **Arrow Layer**: Dependency arrows
3. **Progress Layer**: Task progress indicators
4. **Bar Layer**: Task bars and labels

#### 4.2 Grid System
- **Header**: Sticky time axis with upper/lower text
- **Rows**: Task rows with alternating backgrounds
- **Ticks**: Vertical time markers
- **Highlights**: Holidays, weekends, ignored periods
- **Current Date**: Today indicator

#### 4.3 Task Rendering Pipeline
1. **Setup**: Calculate positions, dimensions, durations
2. **Draw**: Create SVG elements (bar, progress, handles, label)
3. **Bind**: Attach event listeners
4. **Update**: Real-time position updates during interactions

### 5. Event System

#### 5.1 User Interactions
- **Drag**: Move tasks horizontally
- **Resize**: Change task duration via handles
- **Progress**: Adjust completion percentage
- **Click/Hover**: Show popups
- **Scroll**: Infinite timeline extension
- **View Mode**: Switch between time scales

#### 5.2 Event Flow
```javascript
// Example: Task dragging
mousedown → calculate initial positions
mousemove → update visual positions (real-time)
mouseup   → finalize positions and trigger events
```

#### 5.3 Custom Events
The library triggers custom events for external handling:
- `date_change`: When task dates are modified
- `progress_change`: When task progress changes
- `click`: When tasks are clicked
- `hover`: When tasks are hovered
- `view_change`: When view mode changes

### 6. Styling Architecture

#### 6.1 CSS Variables System
Uses CSS custom properties for theming:

```css
:root {
    --g-bar-color: #fff;
    --g-progress-color: #dbdbdb;
    --g-text-dark: #171717;
    --g-border-color: #ebeff2;
    /* ... many more */
}
```

#### 6.2 Theme Support
- **Light Theme** (`src/styles/light.css`): Default bright theme
- **Dark Theme** (`src/styles/dark.css`): Dark mode support
- **Base Styles** (`src/styles/gantt.css`): Core layout and structure

#### 6.3 Responsive Design
- Flexible column widths
- Auto-sizing containers
- Responsive text positioning
- Scroll-based label movement

### 7. Advanced Features

#### 7.1 Ignored Periods
Exclude specific time periods from calculations:
```javascript
options.ignore = ['weekend', '2024-01-01', '2024-12-25'];
```

#### 7.2 Holiday Highlighting
Visual indicators for special dates:
```javascript
options.holidays = {
    '#fffddb': [{ name: 'New Year', date: '2024-01-01' }],
    'var(--g-weekend-highlight-color)': 'weekend'
};
```

#### 7.3 Infinite Scrolling
Dynamic timeline extension:
- Automatic padding when scrolling near edges
- Seamless infinite timeline experience
- Performance-optimized rendering

#### 7.4 Snap-to-Grid
Precise positioning with configurable intervals:
```javascript
options.snap_at = '1d';  // Snap to days
options.snap_at = '1h';  // Snap to hours
```

### 8. Build System

#### 8.1 Vite Configuration (`vite.config.js`)
Modern build setup with:
- ES modules output
- UMD compatibility
- CSS bundling
- Development server

#### 8.2 Output Formats
- **ES Module**: `frappe-gantt.es.js`
- **UMD**: `frappe-gantt.umd.js`
- **CSS**: `frappe-gantt.css`

### 9. API Design

#### 9.1 Constructor
```javascript
const gantt = new Gantt('#container', tasks, options);
```

#### 9.2 Public Methods
```javascript
gantt.update_options(newOptions);        // Update configuration
gantt.change_view_mode(mode);           // Switch view mode
gantt.scroll_current();                 // Scroll to today
gantt.update_task(id, details);         // Update specific task
gantt.refresh(newTasks);                // Replace all tasks
```

#### 9.3 Task Data Format
```javascript
const task = {
    id: 'task-1',                    // Unique identifier
    name: 'Task Name',               // Display name
    start: '2024-01-01',            // Start date
    end: '2024-01-05',              // End date (or use duration)
    duration: '4d',                 // Alternative to end
    progress: 50,                   // Completion percentage
    dependencies: 'task-0',         // Dependency IDs
    color: '#ff0000',              // Custom color
    custom_class: 'important'      // CSS class
};
```

### 10. Performance Considerations

#### 10.1 Rendering Optimizations
- SVG-based rendering for scalability
- Layer-based organization for efficient updates
- RequestAnimationFrame for smooth animations
- Minimal DOM manipulation

#### 10.2 Memory Management
- Event listener cleanup
- SVG element reuse where possible
- Efficient date calculations with caching

#### 10.3 Large Dataset Handling
- Virtual scrolling for many tasks
- Lazy rendering of off-screen elements
- Efficient dependency calculations

## Development Guidelines

### 1. Code Organization
- **Single Responsibility**: Each class has a clear purpose
- **Modular Design**: Utilities are separate from components
- **Event-Driven**: Components communicate via events
- **Configuration-Driven**: Behavior controlled via options

### 2. Extension Points
- **Custom View Modes**: Add new time scales
- **Custom Popups**: Define task information display
- **Custom Themes**: CSS variable overrides
- **Event Handlers**: React to user interactions

### 3. Testing Strategy
- Unit tests for utility functions
- Integration tests for component interactions
- Visual regression tests for rendering
- Performance tests for large datasets

This architecture provides a solid foundation for building sophisticated Gantt chart applications with extensive customization capabilities and excellent user experience.

## Glossary for Beginners

### Core Concepts
- **Gantt Chart**: A visual project management tool that shows tasks as horizontal bars on a timeline, making it easy to see what needs to be done when
- **Task**: A single piece of work in your project (like "Design logo" or "Write code")
- **Timeline**: The horizontal axis showing time progression (days, weeks, months)
- **Dependency**: A relationship between tasks where one must finish before another can start
- **Progress**: How much of a task is completed (usually shown as a percentage)

### Technical Terms
- **API (Application Programming Interface)**: The way you interact with the library - the methods and functions you can call
- **Constructor**: A special function that creates a new instance of a class (like creating a new Gantt chart)
- **DOM (Document Object Model)**: The structure of your webpage that the library modifies to show the chart
- **Event**: Something that happens when a user interacts with the chart (click, drag, hover)
- **Instance**: A specific copy of the Gantt chart (you can have multiple charts on one page)
- **Method**: A function that belongs to a class (like `gantt.refresh()`)
- **Module**: A separate file containing related code
- **Property**: A characteristic of an object (like the height of a task bar)
- **Rendering**: The process of drawing the visual elements on screen
- **SVG (Scalable Vector Graphics)**: A web standard for creating graphics that look crisp at any size
- **Utility**: A helper function that performs a common task (like calculating dates)

### User Interface Terms
- **Drag-and-Drop**: Clicking and moving elements with your mouse
- **Handle**: A small interactive area on a task bar for resizing or changing progress
- **Popup**: A small window that appears when you click on something
- **Readonly**: A mode where users can view but not edit the chart
- **Resize**: Changing the size of something by dragging its edges
- **Scroll**: Moving the view to see different parts of the timeline
- **View Mode**: Different ways to display time (by day, week, month, etc.)
- **Zoom**: Changing the level of detail in the timeline

### Data Terms
- **Configuration**: Settings that control how the chart behaves and looks
- **Default**: A pre-set value that's used unless you specify something else
- **Duration**: How long a task takes to complete
- **Format**: How data is structured or displayed
- **Parse**: Converting text or data into a format the computer can understand
- **Validation**: Checking that data is correct and complete

### Development Terms
- **Build System**: Tools that compile and package your code for production
- **CSS Variables**: Custom properties that make it easy to change colors and styles
- **ES Modules**: A modern way to organize and share code between files
- **Framework**: A collection of tools and rules for building applications
- **Library**: A collection of pre-written code that you can use in your projects
- **Vanilla JavaScript**: Plain JavaScript without any frameworks or libraries
- **Vite**: A modern build tool that helps develop and package web applications

This glossary should help you understand the technical terms used throughout this architecture document!
