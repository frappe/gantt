export default class Popup {
    constructor(parent, popup_func, gantt) {
        this.parent = parent;
        this.popup_func = popup_func;
        this.gantt = gantt;

        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="details"></div>
            <div class="actions"></div>
        `;
        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.details = this.parent.querySelector('.details');
        this.actions = this.parent.querySelector('.actions');
    }

    show({ x, y, task, target }) {
        this.actions.innerHTML = '';
        let html = this.popup_func({
            task,
            chart: this.gantt,
            set_title: (title) => (this.title.innerHTML = title),
            set_subtitle: (subtitle) => (this.subtitle.innerHTML = subtitle),
            set_details: (details) => (this.details.innerHTML = details),
            add_action: (html, func) => {
                let action = this.gantt.create_el({
                    classes: 'action-btn',
                    type: 'button',
                    append_to: this.actions,
                });
                if (typeof html === 'function') html = html(task);
                action.innerHTML = html;
                action.onclick = (e) => func(task, this.gantt, e);
            },
        });

        if (html) this.parent.innerHTML = html;

        // set position
        let position_meta;
        if (target instanceof HTMLElement) {
            position_meta = target.getBoundingClientRect();
        } else if (target instanceof SVGElement) {
            position_meta = target.getBBox();
        }

        this.parent.style.left = x + 10 + 'px';
        this.parent.style.top = y - 10 + 'px';
        this.parent.classList.remove('hide');
    }

    hide() {
        this.parent.classList.add('hide');
    }
}
