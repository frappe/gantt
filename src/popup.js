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

    escape_html(value) {
        return `${value ?? ''}`
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    normalize_dependency_id(dep) {
        if (typeof dep === 'string') {
            return dep;
        }

        return dep?.id;
    }

    get_dependency_type_label(type = 'finish-start') {
        const labels = {
            'finish-start': 'Finish → Start (FS)',
            'finish-finish': 'Finish → Finish (FF)',
            'start-start': 'Start → Start (SS)',
            'start-finish': 'Start → Finish (SF)',
        };

        return labels[type] || labels['finish-start'];
    }

    get_dependencies_html(task) {
        const dependencies = task.dependencies || [];

        const predecessors = dependencies
            .map((dep) => {
                const dependencyId = this.normalize_dependency_id(dep);

                const dependencyType =
                    typeof dep === 'string'
                        ? 'finish-start'
                        : dep.type || 'finish-start';

                const dependencyTask = this.gantt.get_task(dependencyId);

                return {
                    id: dependencyId,
                    name: dependencyTask?.name || dependencyId,
                    type: dependencyType,
                };
            })
            .filter((dep) => dep.id);

        const successors = this.gantt.tasks
            .filter((candidateTask) => {
                return (candidateTask.dependencies || []).some((dep) => {
                    const dependencyId = this.normalize_dependency_id(dep);
                    return dependencyId === task.id;
                });
            })
            .map((candidateTask) => {
                const dependency = (candidateTask.dependencies || []).find((dep) => {
                    const dependencyId = this.normalize_dependency_id(dep);
                    return dependencyId === task.id;
                });

                const dependencyType =
                    typeof dependency === 'string'
                        ? 'finish-start'
                        : dependency?.type || 'finish-start';

                return {
                    id: candidateTask.id,
                    name: candidateTask.name || candidateTask.id,
                    type: dependencyType,
                };
            });

        const renderList = (title, items, emptyText) => {
            if (!items.length) {
                return `
                    <div class="popup-dependency-section">
                        <strong>${title}</strong>
                        <div class="popup-dependency-empty">${emptyText}</div>
                    </div>
                `;
            }

            return `
                <div class="popup-dependency-section">
                    <strong>${title}</strong>
                    <ul class="popup-dependency-list">
                        ${items
                            .map((item) => {
                                return `
                                    <li>
                                        <span class="popup-dependency-name">
                                            ${this.escape_html(item.name)}
                                        </span>
                                        <span class="popup-dependency-type">
                                            — ${this.escape_html(
                                                this.get_dependency_type_label(item.type),
                                            )}
                                        </span>
                                    </li>
                                `;
                            })
                            .join('')}
                    </ul>
                </div>
            `;
        };

        return `
            <div class="popup-dependencies">
                ${renderList(
                    'Depends on:',
                    predecessors,
                    'None',
                )}

                ${renderList(
                    'Dependent tasks:',
                    successors,
                    'None',
                )}
            </div>
        `;
    }

    append_dependencies_to_details(task) {
        if (!this.details) return;

        const dependenciesHtml = this.get_dependencies_html(task);

        this.details.innerHTML += dependenciesHtml;
    }

    show({ x, y, task, target }) {
        if (!this.actions || !this.parent.contains(this.actions)) {
            this.actions = document.createElement('div');
            this.actions.classList.add('actions');
            this.parent.appendChild(this.actions);
        }

        this.actions.innerHTML = '';

        let html;

        if (this.popup_func) {
            html = this.popup_func({
                task,
                chart: this.gantt,
                get_title: () => this.title,
                set_title: (title) => (this.title.innerHTML = title),
                get_subtitle: () => this.subtitle,
                set_subtitle: (subtitle) => (this.subtitle.innerHTML = subtitle),
                get_details: () => this.details,
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

            if (html === false) return;

            if (html) {
                this.parent.innerHTML = html;
            } else {
                this.append_dependencies_to_details(task);
            }
        } else {
            this.title.innerHTML = task.name || '';
            this.subtitle.innerHTML = `${task.start || ''} → ${task.end || ''}`;
            this.details.innerHTML = `
                <div>
                    <strong>Progress:</strong> ${task.progress || 0}%
                </div>
            `;

            this.append_dependencies_to_details(task);
        }

        if (this.actions && this.actions.innerHTML === '') {
            this.actions.remove();
        } else if (this.actions && !this.parent.contains(this.actions)) {
            this.parent.appendChild(this.actions);
        }

        this.parent.style.left = x + 10 + 'px';
        this.parent.style.top = y - 10 + 'px';
        this.parent.classList.remove('hide');
    }

    hide() {
        this.parent.classList.add('hide');
    }
}