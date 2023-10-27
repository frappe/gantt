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
            <div class="subtitle"></div>
            <div class="pointer"></div>
        `;

        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.pointer = this.parent.querySelector('.pointer');
    }

    show(options) {
        if (this.is_showing) return;
        if (!options.target_element) {
            throw new Error('target_element is required to show popup');
        }
        if (!options.position) {
            options.position = 'left';
        }
        const target_element = options.target_element;

        if (this.custom_html) {
            let html = this.custom_html(options.task);
            html += '<div class="pointer"></div>';
            this.parent.innerHTML = html;
            this.pointer = this.parent.querySelector('.pointer');
        } else {
            // set data
            this.title.innerHTML = options.title;
            this.subtitle.innerHTML = options.subtitle;
            this.parent.style.width = this.parent.clientWidth + 'px';
        }

        // set position
        let position_meta;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        } else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }

        if (options.position === 'left') {
            this.parent.style.left =
                position_meta.x + (position_meta.width + 8) + 'px';
            this.parent.style.top = position_meta.y + 'px';

            this.pointer.style.transform = 'rotateZ(90deg)';
            this.pointer.style.left = '-4px';
            this.pointer.style.top = '2px';
        }
        if (options.position === 'bottom') {
            const middle_popup = this.parent.clientWidth / 2;
            this.parent.style.left = (options.x - middle_popup) + 'px';
            this.parent.style.top = (position_meta.y + position_meta.height + 10) + 'px';

            this.pointer.style.transform = 'rotateZ(180deg)';
            this.pointer.style.left = middle_popup + 'px';
            this.pointer.style.top = '-10px';
        }

        // show
        this.parent.style.opacity = 1;
        this.is_showing = true;
    }

    hide() {
        this.parent.style.opacity = 0;
        this.parent.style.left = 0;
        this.is_showing = false;
    }
}
