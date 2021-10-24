export function $(expr: string | Element, con?: Element): Element {
  return typeof expr === 'string'
    ? (con || document).querySelector(expr)
    : expr || null;
}

$.on = (
  element: Element, event: string,
  selector: string | EventListenerOrEventListenerObject,
  callback?: EventListenerOrEventListenerObject,
): void => {
  if (typeof selector === 'function' || typeof selector === 'object') {
    // eslint-disable-next-line no-param-reassign
    callback = selector;
    $.bind(element, event, callback);
  } else {
    $.delegate(element, event, selector, callback);
  }
};

$.off = (
  element: Element, event: string, handler: EventListenerOrEventListenerObject,
): void => {
  element.removeEventListener(event, handler);
};

$.bind = (
  element: Element, event: string, callback: EventListenerOrEventListenerObject,
): void => {
  event.split(/\s+/).forEach((e) => {
    element.addEventListener(e, callback);
  });
};

$.delegate = (
  element: Element, event: string, selector: string,
  callback: EventListenerOrEventListenerObject,
): void => {
  // eslint-disable-next-line func-names
  element.addEventListener(event, function (e: Event) {
    // @ts-ignore
    const delegatedTarget = e.target.closest(selector);
    if (delegatedTarget) {
      // @ts-ignore
      e.delegatedTarget = delegatedTarget;
      // @ts-ignore
      callback.call(this, e, delegatedTarget);
    }
  });
};

$.closest = (selector: string, element: Element): Element => {
  if (!element) return null;

  if (element.matches(selector)) {
    return element;
  }

  return $.closest(selector, element.parentElement);
};

$.attr = (
  element: Element, attr: Record<string, string | number> | string, value?: string | number,
): string | null => {
  if (!value && typeof attr === 'string') {
    return element.getAttribute(attr);
  }

  if (typeof attr === 'object') {
    Object.keys(attr).forEach((key) => {
      $.attr(element, key, attr[key]);
    });
    return null;
  }

  element.setAttribute(attr, value as string);
  return null;
};

function cubicBezier(name: 'ease' | 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out'): string {
  return {
    ease: '.25 .1 .25 1',
    linear: '0 0 1 1',
    'ease-in': '.42 0 1 1',
    'ease-out': '0 0 .58 1',
    'ease-in-out': '.42 0 .58 1',
  }[name];
}

export type CreateSVGAttrs = Record<string, string | number | Element>
& { append_to?: Element };

export function createSVG(tag: string, attrs: CreateSVGAttrs): SVGElement {
  const elem = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.keys(attrs).forEach((attr) => {
    if (attr === 'append_to') {
      const parent = attrs.append_to;
      parent.appendChild(elem);
    } else {
      const val = attrs[attr] as string;
      if (attr === 'innerHTML') {
        elem.innerHTML = val;
      } else {
        elem.setAttribute(attr, val);
      }
    }
  });
  return elem;
}

function getAnimationElement(
  svgElement: SVGElement,
  attr: string,
  from: number,
  to: number,
  dur = '0.4s',
  begin = '0.1s',
): SVGElement {
  const animEl = svgElement.querySelector('animate');
  if (animEl) {
    $.attr(animEl, {
      attributeName: attr,
      from,
      to,
      dur,
      begin: `click + ${begin}`, // artificial click
    });
    return svgElement;
  }

  const animateElement = createSVG('animate', {
    attributeName: attr,
    from,
    to,
    dur,
    begin,
    calcMode: 'spline',
    values: `${from};${to}`,
    keyTimes: '0; 1',
    keySplines: cubicBezier('ease-out'),
  });
  svgElement.appendChild(animateElement);

  return svgElement;
}

export function animateSVG(svgElement: SVGElement, attr: string, from: number, to: number): void {
  const animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

  if (animatedSvgElement === svgElement) {
    // triggered 2nd time programmatically
    // trigger artificial click event
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    // const event = document.createEvent('HTMLEvents') as MouseEvent;
    // event.initEvent('click', true, true);
    // event.eventName = 'click';
    animatedSvgElement.dispatchEvent(event);
  }
}
