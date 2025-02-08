# Frappe Gantt Technical Specifications

## Overview
Frappe Gantt is an open-source JavaScript Gantt chart library designed for web applications. Originally developed as a component for ERPNext, it has evolved into a standalone solution for creating interactive and visually appealing Gantt charts with zero dependencies.

## Core Features

### Timeline Visualization
- Interactive horizontal bar representation of tasks
- Multiple view modes (Day, Week, Month, Year) with customizable time scales
- Flexible scrolling and navigation options
- Built-in "Today" button for quick navigation
- Infinite scrolling capability with configurable padding

### Task Management
- Drag-and-drop task scheduling
- Visual progress indication
- Customizable task bar appearance (height, corner radius, colors)
- Interactive task duration modification
- Support for task dependencies

### Holiday and Weekend Handling
- Configurable holiday highlighting
- Weekend marking with custom colors
- Option to exclude holidays/weekends from progress calculations
- Customizable holiday definitions and appearances

### Popup System
- Configurable popup triggers (click/hover)
- Customizable popup content and formatting
- Support for custom actions within popups
- Dynamic content updates
- HTML-based content customization

## Technical Specifications

### Installation

```bash
npm install frappe-gantt
```

### Required Files
- frappe-gantt.umd.js
- frappe-gantt.css

### Configuration Options

#### Core Settings
- `arrow_curve`: Integer (default: 5) - Curve radius for dependency arrows
- `bar_height`: Integer (default: 30) - Height of task bars
- `bar_corner_radius`: Integer (default: 3) - Corner radius of task bars
- `container_height`: "auto" or Integer - Container height
- `date_format`: String (default: "YYYY-MM-DD") - Date display format
- `language`: String (default: "en") - Interface language

#### View Configuration
- `column_width`: Integer (default: 45) - Timeline column width
- `view_mode`: String ("Day"|"Week"|"Month"|"Year") - Default view mode
- `view_mode_select`: Boolean - Enable/disable view mode selection

#### Header Configuration
- `upper_header_height`: Integer (default: 45) - Upper header height
- `lower_header_height`: Integer (default: 30) - Lower header height

#### Interaction Settings
- `readonly`: Boolean - Disable all editing
- `readonly_dates`: Boolean - Disable date editing
- `readonly_progress`: Boolean - Disable progress editing
- `move_dependencies`: Boolean - Enable automatic dependency movement

#### Visual Elements
- `lines`: String ("none"|"vertical"|"horizontal"|"both") - Grid line display
- `padding`: Integer (default: 18) - Task bar padding
- `popup_on`: String ("click"|"hover") - Popup trigger event

### View Modes Configuration
Each view mode can be configured with:
- `name`: String - View mode identifier
- `padding`: Interval - Time padding
- `step`: Interval - Column interval
- `lower_text`: String/Function - Lower header text format
- `upper_text`: String/Function - Upper header text format
- `upper_text_frequency`: Number - Upper text update frequency
- `thick_line`: Function - Line thickness determination

### API Methods

#### Core Methods
- `update_options(new_options)`: Update chart configuration
- `change_view_mode(view_mode, maintain_pos)`: Switch view mode
- `scroll_current()`: Scroll to current date
- `update_task(task_id, new_details)`: Update specific task

#### Task Object Structure
```javascript
{
    id: String,
    name: String,
    start: Date/String,
    end: Date/String,
    progress: Number,
    dependencies: Array
}
```

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6 compatibility required

## Dependencies
- Zero external dependencies
- Self-contained JavaScript and CSS

## Performance Considerations
- Efficient DOM manipulation for smooth scrolling
- Optimized rendering for large datasets
- Memory management for infinite scrolling

## Customization
- Custom CSS support for styling
- Extensible view mode system
- Configurable popup system
- Custom holiday definitions
- Language localization support