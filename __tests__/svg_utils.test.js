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

        test('should create complex SVG structure', () => {
            const svg = createSVG('svg', {
                width: 200,
                height: 100
            });
            const g = createSVG('g', {
                class: 'group',
                append_to: svg
            });
            const circle = createSVG('circle', {
                cx: 50,
                cy: 50,
                r: 25,
                append_to: g
            });

            expect(svg.children[0]).toBe(g);
            expect(g.children[0]).toBe(circle);
            expect(circle.getAttribute('r')).toBe('25');
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

        test('should handle multiple attribute animations', () => {
            const rect = createSVG('rect');

            // Create width animation
            animateSVG(rect, 'width', '0', '100');
            const widthAnim = rect.querySelector('animate');
            expect(widthAnim.getAttribute('attributeName')).toBe('width');
            expect(widthAnim.getAttribute('from')).toBe('0');
            expect(widthAnim.getAttribute('to')).toBe('100');

            // Update to height animation
            animateSVG(rect, 'height', '0', '50');
            expect(widthAnim.getAttribute('attributeName')).toBe('height');
            expect(widthAnim.getAttribute('from')).toBe('0');
            expect(widthAnim.getAttribute('to')).toBe('50');
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

        test('should handle event delegation with nested elements', () => {
            container.innerHTML = `
                <div class="parent">
                    <div class="child">
                        <span class="grandchild">Click me</span>
                    </div>
                </div>
            `;
            const handler = jest.fn();
            $.delegate(container, 'click', '.child', handler);

            const span = container.querySelector('.grandchild');
            span.click();
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

        test('should handle multiple class selectors', () => {
            container.innerHTML = '<div class="parent class1"><span class="child"><button>Click</button></span></div>';
            const button = container.querySelector('button');
            const parent = $.closest('.parent.class1', button);

            expect(parent).toBeTruthy();
            expect(parent.classList.contains('parent')).toBe(true);
            expect(parent.classList.contains('class1')).toBe(true);
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

        test('should handle boolean attributes', () => {
            const element = document.createElement('input');
            $.attr(element, 'disabled', true);
            expect(element.hasAttribute('disabled')).toBe(true);
        });

        test('should handle numeric attributes', () => {
            const element = document.createElement('div');
            $.attr(element, 'data-number', 42);
            expect(element.getAttribute('data-number')).toBe('42');
        });
    });
}); 