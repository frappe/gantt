export function $(expr, con) {
    return typeof expr === 'string'
        ? (con || document).querySelector(expr)
        : expr || null;
}

export function createSVG(tag, attrs) {
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (let attr in attrs) {
        if (attr === 'append_to') {
            const parent = attrs.append_to;
            parent.appendChild(svgElement);
        } else if (attr === 'innerHTML') {
            svgElement.innerHTML = attrs.innerHTML;
        } else {
            svgElement.setAttribute(attr, attrs[attr]);
        }
    }
    return svgElement;
}

export function animateSVG(svgElement, attr, from, to) {
    const animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

    if (animatedSvgElement === svgElement) {
        // triggered 2nd time programmatically
        // trigger artificial click event
        const event = new Event('click', {
            bubbles: true,
            cancelable: true,
        });

        animatedSvgElement.dispatchEvent(event);
    }
}

export function getX(element: SVGRectElement) : number {
    console.log("in getX");
    console.log(element);
    console.log(element.x);
    return  element.x.baseVal.value;
}

export function getY(element: SVGRectElement) : number {
    return element.y.baseVal.value;
}

export function getWidth(element: SVGRectElement) : number {
    return element.width.baseVal.value;
}

export function getHeight(element: SVGRectElement) : number {
    return element.height.baseVal.value;
}

export function getEndX(element: SVGRectElement) : number {
    return element.y.baseVal.value + getHeight(element);
}

function getAnimationElement(
    svgElement,
    attr,
    from,
    to,
    dur = '0.4s',
    begin = '0.1s'
) {
    const animEl = svgElement.querySelector('animate');
    if (animEl) {
        $.attr(animEl, null,{
            attributeName: attr,
            from,
            to,
            dur,
            begin: 'click + ' + begin, // artificial click
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
        values: from + ';' + to,
        keyTimes: '0; 1',
        keySplines: cubic_bezier('ease-out'),
    });
    svgElement.appendChild(animateElement);

    return svgElement;
}

function cubic_bezier(name) {
    return {
        ease: '.25 .1 .25 1',
        linear: '0 0 1 1',
        'ease-in': '.42 0 1 1',
        'ease-out': '0 0 .58 1',
        'ease-in-out': '.42 0 .58 1',
    }[name];
}

$.on = (element, event, selector, callback) => {
    if (!callback) {
        callback = selector;
        $.bind(element, event, callback);
    } else {
        $.delegate(element, event, selector, callback);
    }
};

$.off = (element, event, handler) => {
    element.removeEventListener(event, handler);
};

$.bind = (element, event, callback) => {
    event.split(/\s+/).forEach(function (event) {
        element.addEventListener(event, callback);
    });
};

$.delegate = (element, event, selector, callback) => {
    element.addEventListener(event, function (e) {
        const delegatedTarget = e.target.closest(selector);
        if (delegatedTarget) {
            e.delegatedTarget = delegatedTarget;
            callback.call(this, e, delegatedTarget);
        }
    });
};

$.closest = (selector, element) => {
    if (!element) return null;

    if (element.matches(selector)) {
        return element;
    }

    return $.closest(selector, element.parentNode);
};

$.attr = (element, attr, value) => {
    if (!value && typeof attr === 'string') {
        return element.getAttribute(attr);
    }

    if (typeof attr === 'object') {
        for (let key in attr) {
            $.attr(element, key, attr[key]);
        }
        return;
    }

    element.setAttribute(attr, value);
};
