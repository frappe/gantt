function parseColorToRGB(color) {
    color = color.trim();

    // HEX (#RRGGBB or #RGB)
    if (color.startsWith('#')) {
        let hex = color.slice(1);
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((c) => c + c)
                .join('');
        }
        if (hex.length === 6) {
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);
            return [r, g, b];
        }
    }

    // RGB or RGBA (e.g., rgb(255, 87, 51) or rgba(255, 87, 51, 0.8))
    const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (rgbMatch) {
        return [
            parseInt(rgbMatch[1]),
            parseInt(rgbMatch[2]),
            parseInt(rgbMatch[3]),
        ];
    }

    // HSL or HSLA (e.g., hsl(15, 100%, 50%) or hsla(15, 100%, 50%, 0.8))
    const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
    if (hslMatch) {
        const h = parseInt(hslMatch[1]);
        const s = parseInt(hslMatch[2]) / 100;
        const l = parseInt(hslMatch[3]) / 100;

        // Convert HSL to RGB
        const a = s * Math.min(l, 1 - l);
        const f = (n) => {
            const k = (n + h / 30) % 12;
            return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        };
        return [
            Math.round(f(0) * 255),
            Math.round(f(8) * 255),
            Math.round(f(4) * 255),
        ];
    }

    // Invalid format
    return null;
}

export default {
    getTextColorForBackground(color) {
        // Convert any color format to RGB
        const rgb = parseColorToRGB(color);
        if (!rgb) {
            throw new Error(`Invalid color format: ${color}`);
        }

        // Normalize RGB values to [0, 1]
        const [rNorm, gNorm, bNorm] = rgb.map((c) => c / 255);

        // Calculate luminance
        const rL =
            rNorm <= 0.03928
                ? rNorm / 12.92
                : Math.pow((rNorm + 0.055) / 1.055, 2.4);
        const gL =
            gNorm <= 0.03928
                ? gNorm / 12.92
                : Math.pow((gNorm + 0.055) / 1.055, 2.4);
        const bL =
            bNorm <= 0.03928
                ? bNorm / 12.92
                : Math.pow((bNorm + 0.055) / 1.055, 2.4);

        const luminance = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;

        // Choose black or white text based on luminance
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    },
};
