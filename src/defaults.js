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
        padding: '14d',
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
    arrow_curve: 5,
    auto_move_label: false,
    bar_corner_radius: 3,
    bar_height: 30,
    container_height: 300,
    column_width: null,
    date_format: 'YYYY-MM-DD',
    snap_at: null,
    infinite_padding: false,
    header_height: 65,
    holidays: { '#fff7ed': 'weekend' },
    ignore: [],
    language: 'en',
    lines: 'both',
    move_dependencies: true,
    padding: 18,
    popup: null,
    popup_on: 'hover',
    readonly_progress: false,
    readonly_dates: false,
    readonly: false,
    scroll_to: 'today',
    show_expected_progress: false,
    today_button: true,
    view_mode: 'Day',
    view_mode_select: false,
    view_modes: DEFAULT_VIEW_MODES,
};

export { DEFAULT_OPTIONS, DEFAULT_VIEW_MODES };
