import date_utils from './date_utils';

const DEFAULT_VIEW_MODES = [
    {
        name: 'Hour',
        padding: '7d',
        step: '1h',
        lower_text: 'HH',
        upper_text: (d, ld, lang) =>
            !ld || d.getDate() !== ld.getDate()
                ? date_utils.format(d, 'D MMMM', lang)
                : '',
        upper_text_frequency: 24,
    },
    {
        name: 'Quarter Day',
        padding: '7d',
        step: '6h',
        format_string: 'YYYY-MM-DD HH',
        lower_text: 'HH',
        upper_text: (d, ld, lang) =>
            !ld || d.getDate() !== ld.getDate()
                ? date_utils.format(d, 'D MMM', lang)
                : '',
        upper_text_frequency: 4,
    },
    {
        name: 'Half Day',
        padding: '7d',
        step: '12h',
        format_string: 'YYYY-MM-DD HH',
        lower_text: 'HH',
        upper_text: (d, ld, lang) =>
            !ld || d.getDate() !== ld.getDate()
                ? d.getMonth() !== d.getMonth()
                    ? date_utils.format(d, 'D MMM', lang)
                    : date_utils.format(d, 'D', lang)
                : '',
        upper_text_frequency: 2,
    },
    {
        name: 'Day',
        padding: '14d',
        format_string: 'YYYY-MM-DD',
        step: '1d',
        lower_text: (d, ld, lang) =>
            !ld || d.getDate() !== ld.getDate()
                ? date_utils.format(d, 'D', lang)
                : '',
        upper_text: (d, ld, lang) =>
            !ld || d.getMonth() !== ld.getMonth()
                ? date_utils.format(d, 'MMMM', lang)
                : '',
        thick_line: (d) => d.getDay() === 1,
    },
    {
        name: 'Week',
        padding: '1m',
        step: '7d',
        column_width: 140,
        lower_text: (d, ld, lang) =>
            d.getMonth() !== ld.getMonth()
                ? date_utils.format(d, 'D MMM', lang)
                : date_utils.format(d, 'D', lang),
        upper_text: (d, ld, lang) =>
            !ld || d.getMonth() !== ld.getMonth()
                ? date_utils.format(d, 'MMMM', lang)
                : '',
        thick_line: (d) => d.getDate() >= 1 && d.getDate() <= 7,
        upper_text_frequency: 4,
    },
    {
        name: 'Month',
        padding: '2m',
        step: '1m',
        column_width: 120,
        format_string: 'YYYY-MM',
        lower_text: 'MMMM',
        upper_text: (d, ld, lang) =>
            !ld || d.getFullYear() !== ld.getFullYear()
                ? date_utils.format(d, 'YYYY', lang)
                : '',
        thick_line: (d) => d.getMonth() % 3 === 0,
        default_snap: '7d',
    },
    {
        name: 'Year',
        padding: '2y',
        step: '1y',
        column_width: 120,
        format_string: 'YYYY',
        upper_text: 'YYYY',
        default_snap: '30d',
    },
];

const DEFAULT_OPTIONS = {
    header_height: 65,
    column_width: 30,
    view_modes: DEFAULT_VIEW_MODES,
    bar_height: 30,
    bar_corner_radius: 3,
    arrow_curve: 5,
    padding: 18,
    view_mode: 'Day',
    date_format: 'YYYY-MM-DD',
    move_dependencies: true,
    show_expected_progress: false,
    popup: null,
    popup_on: 'hover',
    language: 'en',
    readonly: false,
    progress_readonly: false,
    dates_readonly: false,
    scroll_to: 'start',
    lines: 'both',
    auto_move_label: true,
    today_button: true,
    view_mode_select: false,
    default_snap: '1d',
    holiday_highlight: { green: 'weekend' },
    ignore: ['weekend'],
};

export { DEFAULT_OPTIONS, DEFAULT_VIEW_MODES };
