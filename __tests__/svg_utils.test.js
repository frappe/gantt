import { $, createSVG, animateSVG } from '../src/svg_utils.js';

describe('svg_utils', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('$', () => {
        test('should find element by selector', () => {
            container.innerHTML = '<div class="test"></div>';
            const element = $('.test');
            expect(element).toBeTruthy();
            expect(element.className).toBe('test');
        });

        test('should find element within context', () => {
            const context = document.createElement('div');
            context.innerHTML = '<span class="test"></span>';
            const element = $('.test', context);
            expect(element).toBeTruthy();
            expect(element.tagName.toLowerCase()).toBe('span');
        });

        test('should return null for non-existent element', () => {
            const element = $('.non-existent');
            expect(element).toBeNull();
        });

        test('should return element if passed directly', () => {
            const div = document.createElement('div');
            const result = $(div);
            expect(result).toBe(div);
        });
    });

    describe('createSVG', () => {
        test('should create SVG element with basic attributes', () => {
            const rect = createSVG('rect', {
                x: 10,
                y: 20,
                width: 100,
                height: 50
            });
            expect(rect.tagName.toLowerCase()).toBe('rect');
            expect(rect.getAttribute('x')).toBe('10');
            expect(rect.getAttribute('y')).toBe('20');
            expect(rect.getAttribute('width')).toBe('100');
            expect(rect.getAttribute('height')).toBe('50');
        });

        test('should append element to parent', () => {
            const parent = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            const rect = createSVG('rect', {
                append_to: parent
            });
            expect(parent.children[0]).toBe(rect);
        });

        test('should set innerHTML', () => {
            const text = createSVG('text', {
                innerHTML: 'Test Text'
            });
            expect(text.innerHTML).toBe('Test Text');
        });

        test('should handle clipPath attribute', () => {
            const rect = createSVG('rect', {
                clipPath: 'test-clip'
            });
            expect(rect.getAttribute('clip-path')).toBe('url(#test-clip)');
        });
    });

    describe('animateSVG', () => {
        test('should create animate element for new animation', () => {
            const rect = createSVG('rect');
            animateSVG(rect, 'width', '0', '100');
            const animate = rect.querySelector('animate');
            expect(animate).toBeTruthy();
            expect(animate.getAttribute('attributeName')).toBe('width');
            expect(animate.getAttribute('from')).toBe('0');
            expect(animate.getAttribute('to')).toBe('100');
        });

        test('should update existing animation', () => {
            const rect = createSVG('rect');
            const animate = createSVG('animate', {
                append_to: rect
            });
            animateSVG(rect, 'width', '0', '100');
            expect(animate.getAttribute('attributeName')).toBe('width');
            expect(animate.getAttribute('from')).toBe('0');
            expect(animate.getAttribute('to')).toBe('100');
        });
    });

    describe('event handling', () => {
        test('should bind event listener', () => {
            const element = document.createElement('button');
            const handler = jest.fn();
            $.bind(element, 'click', handler);
            
            element.click();
            expect(handler).toHaveBeenCalled();
        });

        test('should handle multiple event types', () => {
            const element = document.createElement('button');
            const handler = jest.fn();
            $.bind(element, 'mousedown mouseup', handler);
            
            element.dispatchEvent(new Event('mousedown'));
            element.dispatchEvent(new Event('mouseup'));
            expect(handler).toHaveBeenCalledTimes(2);
        });

        test('should delegate events', () => {
            container.innerHTML = '<div class="parent"><button class="child">Click</button></div>';
            const handler = jest.fn();
            $.delegate(container, 'click', '.child', handler);
            
            const button = container.querySelector('.child');
            button.click();
            expect(handler).toHaveBeenCalled();
        });

        test('should remove event listener', () => {
            const element = document.createElement('button');
            const handler = jest.fn();
            $.bind(element, 'click', handler);
            $.off(element, 'click', handler);
            
            element.click();
            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('$.closest', () => {
        test('should find closest matching ancestor', () => {
            container.innerHTML = '<div class="parent"><span class="child"><button>Click</button></span></div>';
            const button = container.querySelector('button');
            const parent = $.closest('.parent', button);
            
            expect(parent).toBeTruthy();
            expect(parent.className).toBe('parent');
        });

        test('should return null if no match found', () => {
            const element = document.createElement('div');
            const result = $.closest('.non-existent', element);
            expect(result).toBeNull();
        });
    });

    describe('$.attr', () => {
        test('should set single attribute', () => {
            const element = document.createElement('div');
            $.attr(element, 'data-test', 'value');
            expect(element.getAttribute('data-test')).toBe('value');
        });

        test('should set multiple attributes', () => {
            const element = document.createElement('div');
            $.attr(element, {
                'data-test1': 'value1',
                'data-test2': 'value2'
            });
            expect(element.getAttribute('data-test1')).toBe('value1');
            expect(element.getAttribute('data-test2')).toBe('value2');
        });

        test('should get attribute value', () => {
            const element = document.createElement('div');
            element.setAttribute('data-test', 'value');
            const result = $.attr(element, 'data-test');
            expect(result).toBe('value');
        });
    });
}); 