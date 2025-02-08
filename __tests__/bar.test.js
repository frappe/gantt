import Bar from '../src/bar';
import date_utils from '../src/date_utils';
import { createSVG } from '../src/svg_utils';

// Mock SVG utils
jest.mock('../src/svg_utils');

// Mock date_utils
jest.mock('../src/date_utils');

// Mock svg_utils before importing Bar
jest.mock('../src/svg_utils', () => {
    const mockElement = {
        addEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        getBoundingClientRect: () => ({
            left: 0,
            top: 0,
            width: 100,
            height: 20
        }),
        setAttribute: jest.fn(),
        getAttribute: jest.fn(attr => {
            switch(attr) {
                case 'x': return '0';
                case 'y': return '0';
                case 'width': return '100';
                case 'height': return '20';
                default: return '';
            }
        }),
        appendChild: jest.fn(),
        querySelector: jest.fn(),
        querySelectorAll: jest.fn(() => []),
        classList: {
            add: jest.fn(),
            remove: jest.fn(),
            contains: jest.fn()
        },
        getBBox: () => ({
            x: 0,
            y: 0,
            width: 100,
            height: 20
        })
    };
    
    return {
        $: {
            on: (element, event, handler) => {
                element.addEventListener(event, handler);
                return handler;
            },
            attr: jest.fn(),
            closest: jest.fn()
        },
        createSVG: jest.fn().mockReturnValue(mockElement),
        animateSVG: jest.fn()
    };
});

describe('Bar', () => {
    let gantt;
    let task;
    let bar;
    let container;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();
        jest.useFakeTimers();
        
        // Setup date_utils mock implementations
        date_utils.convert_scales.mockImplementation((duration, unit) => {
            const days = parseInt(duration);
            return unit === 'hour' ? days * 24 : days;
        });

        date_utils.diff.mockImplementation((date_a, date_b, scale = 'day') => {
            const diffTime = Math.abs(date_a - date_b);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            switch (scale) {
                case 'hour': return diffDays * 24;
                case 'day': return diffDays;
                case 'month': return Math.floor(diffDays / 30);
                case 'year': return Math.floor(diffDays / 365);
                default: return diffDays;
            }
        });

        date_utils.add.mockImplementation((date, count, unit) => {
            const result = new Date(date);
            switch (unit) {
                case 'hour': result.setHours(result.getHours() + count); break;
                case 'day': result.setDate(result.getDate() + count); break;
                case 'month': result.setMonth(result.getMonth() + count); break;
                case 'year': result.setFullYear(result.getFullYear() + count); break;
                case 'second': result.setSeconds(result.getSeconds() + count); break;
            }
            return result;
        });
        
        // Create container
        container = document.createElement('div');
        document.body.appendChild(container);

        // Mock createSVG implementation
        createSVG.mockImplementation((tag, attrs) => {
            const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
            elem.getBBox = jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 20 });
            elem.getWidth = jest.fn().mockReturnValue(100);
            elem.getX = jest.fn().mockReturnValue(0);
            elem.getY = jest.fn().mockReturnValue(0);
            elem.getEndX = jest.fn().mockReturnValue(100);
            
            if (attrs) {
                Object.entries(attrs).forEach(([key, value]) => {
                    if (key === 'append_to') {
                        attrs.append_to.appendChild(elem);
                    } else if (key === 'innerHTML') {
                        elem.innerHTML = value;
                    } else {
                        elem.setAttribute(key, value);
                    }
                });
            }
            return elem;
        });

        // Setup mock gantt chart
        gantt = {
            options: {
                bar_height: 20,
                padding: 10,
                date_format: 'YYYY-MM-DD',
                language: 'en',
                bar_corner_radius: 3,
                arrow_curve: 5,
                show_expected_progress: false,
                readonly: false,
                readonly_dates: false,
                readonly_progress: false,
                popup_on: 'click'
            },
            config: {
                column_width: 30,
                step: 24,
                unit: 'hour',
                date_format: 'YYYY-MM-DD',
                header_height: 50,
                ignored_positions: [],
                ignored_dates: []
            },
            create_el: jest.fn((opts) => {
                const el = document.createElement('div');
                if (opts.classes) el.className = opts.classes;
                el.getBBox = jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 20 });
                el.getWidth = jest.fn().mockReturnValue(100);
                return el;
            }),
            trigger_event: jest.fn(),
            gantt_start: new Date('2024-01-01'),
            get_ignored_region: jest.fn(() => []),
            show_popup: jest.fn(),
            hide_popup: jest.fn(),
            $svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
            $container: container,
            $lower_header: document.createElement('div'),
            layers: {
                grid: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                date: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                arrow: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                progress: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                bar: document.createElementNS('http://www.w3.org/2000/svg', 'g'),
                details: document.createElementNS('http://www.w3.org/2000/svg', 'g')
            }
        };

        // Setup SVG container
        Object.values(gantt.layers).forEach(layer => {
            gantt.$svg.appendChild(layer);
            layer.getBBox = jest.fn().mockReturnValue({ x: 0, y: 0, width: 100, height: 20 });
            layer.getWidth = jest.fn().mockReturnValue(100);
        });

        container.appendChild(gantt.$svg);
        container.appendChild(gantt.$lower_header);

        // Setup mock task
        task = {
            id: 'Task1',
            name: 'Test Task',
            start: '2024-01-01',
            end: '2024-01-05',
            progress: 50,
            dependencies: [],
            custom_class: '',
            _start: new Date('2024-01-01T00:00:00.000Z'),
            _end: new Date('2024-01-05T00:00:00.000Z'),
            _index: 0
        };

        bar = new Bar(gantt, task);
    });

    afterEach(() => {
        document.body.removeChild(container);
        jest.useRealTimers();
    });

    describe('initialization and setup', () => {
        test('should initialize with correct defaults', () => {
            expect(bar.gantt).toBe(gantt);
            expect(bar.task).toBe(task);
            expect(bar.action_completed).toBe(false);
            expect(bar.height).toBe(gantt.options.bar_height);
        });

        test('should prepare wrappers correctly', () => {
            bar.prepare_values();
            bar.draw();
            expect(bar.group).toBeTruthy();
            expect(bar.bar_group).toBeTruthy();
            expect(bar.handle_group).toBeTruthy();
            expect(bar.group.classList.contains('bar-wrapper')).toBe(true);
        });

        test('should compute correct positions', () => {
            bar.prepare_values();
            expect(bar.x).toBe(0); // Start date matches gantt start
            expect(bar.y).toBe(gantt.config.header_height + gantt.options.padding / 2);
        });
    });

    describe('progress handling', () => {
        test('should handle progress updates with validation', () => {
            task.progress = -10;
            bar.prepare_values();
            expect(task.progress).toBe(0);

            task.progress = 150;
            bar.prepare_values();
            expect(task.progress).toBe(100);
        });

        test('should calculate progress width correctly', () => {
            bar.prepare_values();
            bar.draw();
            const progress_width = bar.calculate_progress_width();
            expect(progress_width).toBeGreaterThan(0);
        });

        test('should update expected progress bar when enabled', () => {
            gantt.options.show_expected_progress = true;
            bar.prepare_values();
            bar.draw();
            expect(bar.$expected_bar_progress).toBeTruthy();
        });

        test('should handle progress changes', () => {
            bar.prepare_values();
            bar.draw();
            bar.progress_changed();
            expect(gantt.trigger_event).toHaveBeenCalledWith('progress_change', [task, task.progress]);
        });
    });

    describe('bar position and updates', () => {
        test('should handle bar position updates with dependencies', () => {
            task.dependencies = ['Task2'];
            bar.prepare_values();
            bar.draw();
            
            gantt.get_bar = jest.fn().mockReturnValue({
                $bar: { getX: () => 150 }
            });
            
            bar.update_bar_position({ x: 100 });
            expect(bar.$bar.getAttribute('x')).not.toBe('100');
        });

        test('should update bar position and width', () => {
            bar.prepare_values();
            bar.draw();
            
            bar.update_bar_position({ x: 50, width: 150 });
            expect(bar.$bar.getAttribute('x')).toBe('50');
            expect(bar.$bar.getAttribute('width')).toBe('150');
        });

        test('should handle date changes', () => {
            bar.prepare_values();
            bar.draw();
            
            const mockEndDate = new Date('2024-01-04T23:59:59.000Z');
            date_utils.add.mockImplementation((date, count, unit) => {
                if (unit === 'second' && count === -1) return mockEndDate;
                return date;
            });
            
            bar.date_changed();
            expect(gantt.trigger_event).toHaveBeenCalledWith('date_change', [
                bar.task,
                new Date('2024-01-01T00:00:00.000Z'),
                mockEndDate
            ]);
        });
    });

    describe('event handling', () => {
        beforeEach(() => {
            // Mock SVG element methods
            const mockSVGElement = {
                getX: function() { return +this.getAttribute('x') || 0; },
                getY: function() { return +this.getAttribute('y') || 0; },
                getWidth: function() { return +this.getAttribute('width') || 0; },
                getHeight: function() { return +this.getAttribute('height') || 0; },
                getEndX: function() { return this.getX() + this.getWidth(); }
            };
            
            // Mock the group element with all necessary methods
            const mockElement = {
                addEventListener: jest.fn((event, handler) => {
                    mockElement[`on${event}`] = handler;
                }),
                dispatchEvent: jest.fn((event) => {
                    const handler = mockElement[`on${event.type}`];
                    if (handler) handler(event);
                }),
                getBoundingClientRect: () => ({
                    left: 0,
                    top: 0,
                    width: 100,
                    height: 20
                }),
                setAttribute: jest.fn(),
                getAttribute: jest.fn(attr => {
                    switch(attr) {
                        case 'x': return '0';
                        case 'y': return '0';
                        case 'width': return '100';
                        case 'height': return '20';
                        default: return '';
                    }
                }),
                appendChild: jest.fn(),
                querySelector: jest.fn(() => ({
                    ...mockElement,
                    getBBox: () => ({
                        x: 0,
                        y: 0,
                        width: 100,
                        height: 20
                    })
                })),
                querySelectorAll: jest.fn(() => []),
                classList: {
                    add: jest.fn(),
                    remove: jest.fn(),
                    contains: jest.fn()
                },
                getBBox: () => ({
                    x: 0,
                    y: 0,
                    width: 100,
                    height: 20
                }),
                ...mockSVGElement
            };
            
            // Set up the bar with mocked elements
            bar.prepare_values();
            bar.draw();
            
            // Ensure the group is properly mocked
            bar.group = mockElement;
            
            // Mock the $bar element
            bar.$bar = {
                ...mockElement,
                getX: jest.fn().mockReturnValue(0),
                getY: jest.fn().mockReturnValue(0),
                getWidth: jest.fn().mockReturnValue(100),
                getHeight: jest.fn().mockReturnValue(20),
                getEndX: jest.fn().mockReturnValue(100)
            };
            
            // Mock the bar_group element
            bar.bar_group = mockElement;
        });

        test('should handle click events', () => {
            const event = new MouseEvent('click');
            
            // Set up the bar's event handlers
            bar.bind();
            
            // Trigger the click event directly
            bar.group.dispatchEvent(event);
            
            expect(gantt.trigger_event).toHaveBeenCalledWith('click', [task]);
        });

        test('should handle hover events', () => {
            const event = new MouseEvent('mouseover', {
                screenX: 100,
                screenY: 100
            });
            
            // Set up all event handlers
            bar.bind();
            
            // Trigger the mouseover event directly
            bar.group.dispatchEvent(event);
            
            // Wait for any async operations
            jest.runAllTimers();
            
            expect(gantt.trigger_event).toHaveBeenCalledWith('hover', [task, 100, 100, event]);
        });

        test('should handle popup on hover', () => {
            // Create event with proper properties
            const event = new MouseEvent('mouseenter', {
                offsetX: 50,
                offsetY: 25,
                layerX: 50,  // Fallback for offsetX
                layerY: 25   // Fallback for offsetY
            });
            
            // Add offsetX/offsetY properties since they might not be set by the constructor
            Object.defineProperties(event, {
                offsetX: { value: 50 },
                offsetY: { value: 25 },
                layerX: { value: 50 },
                layerY: { value: 25 }
            });
            
            // Enable popup on hover
            gantt.options.popup_on = 'hover';
            
            // Set up all event handlers
            bar.bind();
            
            // Trigger the mouseenter event directly
            bar.group.dispatchEvent(event);
            
            // Wait for hover timeout
            jest.runAllTimers();
            
            expect(gantt.show_popup).toHaveBeenCalledWith(expect.objectContaining({
                x: 50,
                y: 25,
                task: task
            }));
        });
    });

    describe('visual elements', () => {
        test('should create thumbnail when specified', () => {
            task.thumbnail = 'test-image.jpg';
            bar.prepare_values();
            bar.draw();
            
            const image = bar.group.querySelector('.bar-img');
            expect(image).toBeTruthy();
            expect(image.getAttribute('href')).toBe('test-image.jpg');
        });

        test('should handle invalid task state', () => {
            const invalid_task = { ...task, invalid: true };
            const invalid_bar = new Bar(gantt, invalid_task);
            invalid_bar.prepare_values();
            invalid_bar.draw();
            expect(invalid_bar.$bar.classList.contains('bar-invalid')).toBe(true);
        });

        test('should handle custom class', () => {
            task.custom_class = 'custom-task';
            const custom_bar = new Bar(gantt, task);
            custom_bar.prepare_values();
            custom_bar.draw();
            expect(custom_bar.group.classList.contains('custom-task')).toBe(true);
        });
    });

    describe('readonly states', () => {
        test('should handle readonly mode', () => {
            gantt.options.readonly = true;
            const readonly_bar = new Bar(gantt, task);
            readonly_bar.prepare_values();
            readonly_bar.draw();
            expect(readonly_bar.handle_group.children.length).toBe(0);
        });

        test('should handle readonly_progress', () => {
            gantt.options.readonly_progress = true;
            const progress_bar = new Bar(gantt, task);
            progress_bar.prepare_values();
            progress_bar.draw();
            const progressHandles = progress_bar.handle_group.querySelectorAll('.handle.progress');
            expect(progressHandles.length).toBe(0);
        });

        test('should handle readonly_dates', () => {
            gantt.options.readonly_dates = true;
            const dates_bar = new Bar(gantt, task);
            dates_bar.prepare_values();
            dates_bar.draw();
            const dateHandles = dates_bar.handle_group.querySelectorAll('.handle.left, .handle.right');
            expect(dateHandles.length).toBe(0);
        });
    });
}); 