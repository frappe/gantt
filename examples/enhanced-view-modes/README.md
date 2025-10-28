# Enhanced View Modes Feature

## Overview
This enhancement improves the view mode switching experience in Frappe Gantt by adding always-visible view mode buttons and automatic scrolling to today when changing views.

## Features

### 1. View Mode Buttons
- **Always Visible**: View mode buttons (Day, Week, Month, Year) are displayed in the header by default
- **Clean UI**: Buttons are styled with a modern, segmented control design
- **Active State**: The current view mode is highlighted
- **Customizable**: Choose which view modes to display as buttons

### 2. Auto-Scroll to Today
- **Automatic Centering**: When changing view modes, the chart automatically scrolls to center on today's date
- **Immediate Context**: Users always see the current timeframe when switching views
- **Configurable**: Can be disabled if you prefer to maintain scroll position

## Implementation

### Usage

```javascript
const gantt = new Gantt('#gantt', tasks, {
    // Enable view mode buttons (default: true)
    view_mode_buttons: true,

    // Specify which buttons to show (default: ['Day', 'Week', 'Month', 'Year'])
    view_mode_buttons_list: ['Day', 'Week', 'Month', 'Year'],

    // Auto-scroll to today when changing view modes (default: true)
    auto_scroll_to_today: true,

    // Also supports the legacy dropdown
    view_mode_select: false,

    // Enable Today button
    today_button: true
});
```

### Configuration Options

#### `view_mode_buttons`
- Type: `boolean`
- Default: `true`
- Description: Show/hide the view mode button group

#### `view_mode_buttons_list`
- Type: `Array<string>`
- Default: `['Day', 'Week', 'Month', 'Year']`
- Description: Specify which view modes to show as buttons

#### `auto_scroll_to_today`
- Type: `boolean`
- Default: `true`
- Description: Automatically scroll to today when changing view modes

### Programmatic Control

```javascript
// Change view mode programmatically
gantt.change_view_mode('Week', true);

// Update button states manually
gantt.update_view_mode_buttons('Week');
```

## Styling

The view mode buttons can be customized via CSS:

```css
.view-mode-buttons {
    /* Container styles */
    background-color: #f0f0f0;
    padding: 2px;
    border-radius: 8px;
}

.view-mode-button {
    /* Individual button styles */
    padding: 4px 10px;
    border-radius: 6px;
}

.view-mode-button.active {
    /* Active button styles */
    background-color: white;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
```

## Browser Compatibility
- All modern browsers (Chrome, Firefox, Safari, Edge)
- Keyboard shortcuts work in all browsers
- Mouse wheel zoom requires browsers that support the `wheel` event

## Migration from Legacy

If you're currently using the dropdown selector (`view_mode_select`), you can:
1. Keep both UI elements active during transition
2. The new buttons work alongside the existing dropdown
3. Both update synchronously when view mode changes

```javascript
const gantt = new Gantt('#gantt', tasks, {
    view_mode_select: true,  // Keep dropdown
    view_mode_buttons: true  // Add new buttons
});
```

## Accessibility
- Focus states for buttons
- Works with screen readers
- Respects system preferences for reduced motion

## Performance
- No impact on rendering performance
- Smooth transitions between view modes
- Auto-scroll is efficient and doesn't affect performance

## Future Enhancements
Potential improvements that could be added:
1. Touch gestures for mobile devices
2. View mode presets (save custom configurations)
3. Animated transitions between views
4. Mini-map navigation
5. View-specific settings persistence
6. Remember last scroll position per view mode