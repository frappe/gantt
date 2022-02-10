export default class Popup {
    constructor(parent, custom_html, gantt) {
        this.parent = parent;
        this.custom_html = custom_html;
        //  add gantt for dependency action
        this.gantt = gantt;
        this.make();
    }

    make() {
        this.parent.innerHTML = `
            <div class="title"></div>
            <div class="subtitle"></div>
            <div class="pointer"></div>
            <div class="add-dependency-action"></div>
        `;

        this.hide();

        this.title = this.parent.querySelector('.title');
        this.subtitle = this.parent.querySelector('.subtitle');
        this.action = this.parent.querySelector('.add-dependency-action');
        this.pointer = this.parent.querySelector('.pointer');
    }

    show(options) {
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
            this.action = this.parent.querySelector('.add-dependency-action');
        } else {
            // set data
            this.title.innerHTML = options.title;
            this.subtitle.innerHTML = options.subtitle;
        }

        //  add action to popup
        if(this.gantt.options.allow_dependency_editing){
            if(this.custom_html === null){
            	// TODO translate
            	this.action.textContent = 'Add Dependency';
            }
            
            var popup = this;
            
            // add eventlistener to action button
            this.action.onclick = function() {
                var bar = popup.gantt.get_bar(options.task.id);
                bar.group.classList.toggle('selected-for-dependency');
                
                popup.gantt.dependency_bar = bar;
                popup.hide();
            };
            
        }else{
            this.action.remove();
        }
            
        //  fix popup overlaying bars
        this.parent.style.display = 'block';
        
        // set position
        let position_meta;
        if (target_element instanceof HTMLElement) {
            position_meta = target_element.getBoundingClientRect();
        } else if (target_element instanceof SVGElement) {
            position_meta = options.target_element.getBBox();
        }

        if (options.position === 'left') {
            this.parent.style.left =
                position_meta.x + (position_meta.width + 10) + 'px';
            this.parent.style.top = position_meta.y + 'px';

            this.pointer.style.transform = 'rotateZ(90deg)';
            this.pointer.style.left = '-7px';
            this.pointer.style.top = '2px';
        }
    }

    hide() {

    	this.parent.style.display = 'none';
      this.parent.style.left = 0;

    }
}
