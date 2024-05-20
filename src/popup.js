export default class Popup {
    constructor(parent, custom_html) {
        this.parent = parent;
        this.custom_html = custom_html;
        this.is_showing = false;
        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="description"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

        this.hide();

        this.title = this.parent.querySelector('.title');
        this.description = this.parent.querySelector('.description');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.pointer = this.parent.querySelector('.pointer');
    }

    show(options, container, scroll) {
        if (this.is_showing) return;
        if (!options.target_element) {
            throw new Error('target_element is required to show popup');
        }

        const target_element = options.target_element;
        this.target_element = options.target_element;
        const width = this.compute_width(options.title.length);

        if (this.custom_html) {
            let html = this.custom_html(options.task);
            html += '<div class="pointer"></div>';
            this.parent.innerHTML = html;
            this.pointer = this.parent.querySelector('.pointer');
        } else {
            // set data
            this.title.innerHTML = options.title;

            this.description.innerHTML = options.description;
            if (options.description === '')
                this.description.classList.remove('description');
            else
                this.description.classList.add('description');

            this.subtitle.innerHTML = options.subtitle;
            if (options.subtitle === '')
                this.subtitle.classList.remove('subtitle');
            else
                this.subtitle.classList.add('subtitle');

            this.parent.style.width = width + 'px';
        }

        // set position
        let position_meta;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        } else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }
        const middle_popup = width / 2;

        if (options.e.clientY + this.parent.clientHeight + 20 > container.offsetHeight + container.offsetTop) {
            this.parent.style.left = (options.e.clientX - middle_popup) + 'px';
            if (options.target_element.localName === 'text')
                this.parent.style.top = (parseInt(options.e.toElement.getAttribute('y')) + container.offsetTop - scroll - this.parent.offsetHeight - 20) + 'px';
            else
                this.parent.style.top = (parseInt(options.e.toElement.getAttribute('y')) + container.offsetTop - scroll - this.parent.offsetHeight - 10) + 'px';
            this.pointer.style.transform = 'rotateZ(0deg)';
            this.pointer.style.left = middle_popup + 'px';
            this.pointer.style.top = (this.parent.offsetHeight + 0.5) + 'px';
        } else {
            this.parent.style.left = (options.e.clientX - middle_popup) + 'px';
            if (options.target_element.localName === 'text')
                this.parent.style.top = (parseInt(options.e.toElement.getAttribute('y')) + container.offsetTop + 15 - scroll) + 'px';
            else
                this.parent.style.top = (parseInt(options.e.toElement.getAttribute('y')) + container.offsetTop + 30 - scroll) + 'px';
            this.pointer.style.transform = 'rotateZ(180deg)';
            this.pointer.style.left = middle_popup + 'px';
            this.pointer.style.top = '-10px';
        }

        if (parseFloat(this.parent.style.left) < container.offsetLeft) {
            this.parent.style.left = container.offsetLeft + 'px';
            this.pointer.style.left = options.e.clientX - container.offsetLeft + 'px';
        }

        // show
        this.parent.style.opacity = 1;
        this.is_showing = true;
    }

    compute_width(title_length) {
        let width;
        const char_width = 6;

        if (title_length < 20)
            width = 20 * char_width;
        else
            width = title_length * char_width;

        return width;
    }

    hide() {
        this.parent.style.opacity = 0;
        this.parent.style.left = 0;
        this.is_showing = false;
    }
}
