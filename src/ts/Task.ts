export default interface Task {
    _end: Date;
    _index: number;
    _start: Date;
    custom_class: string;
    dependencies: string | string[];
    end: any;
    id: any;
    invalid: boolean;
    name: string;
    progress: number;
    start: any;
}