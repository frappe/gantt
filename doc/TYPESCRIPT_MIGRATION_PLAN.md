# TypeScript Migration Plan for Frappe Gantt Library

## Executive Summary

This document outlines a comprehensive plan to migrate the Frappe Gantt library from JavaScript to TypeScript, along with browser compatibility analysis for Safari and Edge browsers. The migration will be performed gradually to minimize disruption and ensure backward compatibility.

## Table of Contents

1. [TypeScript Migration Plan](#typescript-migration-plan)
2. [Browser Compatibility Analysis](#browser-compatibility-analysis)
3. [Implementation Timeline](#implementation-timeline)
4. [Risk Assessment](#risk-assessment)
5. [Testing Strategy](#testing-strategy)

---

## TypeScript Migration Plan

### Advantages of TypeScript Migration

#### 1. **Type Safety & Error Prevention**
- **Compile-time error detection**: Catch type mismatches, undefined variables, and API misuse before runtime
- **IntelliSense support**: Enhanced IDE support with autocomplete, parameter hints, and refactoring tools
- **Reduced runtime errors**: Prevent common JavaScript pitfalls like accessing properties on undefined objects

#### 2. **Better Developer Experience**
- **Enhanced IDE support**: Full IntelliSense, go-to-definition, and refactoring capabilities
- **Self-documenting code**: Type annotations serve as inline documentation
- **Easier refactoring**: Safe renaming and restructuring with confidence
- **Better debugging**: Clearer error messages and stack traces

#### 3. **Improved Maintainability**
- **Clear interfaces**: Well-defined contracts between modules and functions
- **Easier onboarding**: New developers can understand the codebase faster
- **Reduced cognitive load**: Types make code intent explicit
- **Better code organization**: Natural separation of concerns with interfaces

#### 4. **Enhanced API Design**
- **Strict API contracts**: Clear input/output types for all public methods
- **Better integration**: Easier integration with other TypeScript projects
- **Version compatibility**: Type definitions help maintain backward compatibility
- **Documentation generation**: Automatic API documentation from type definitions

#### 5. **Future-Proofing**
- **Modern JavaScript features**: Access to latest ECMAScript features with transpilation
- **Framework compatibility**: Better integration with modern frameworks (React, Vue, Angular)
- **Tooling ecosystem**: Access to rich TypeScript tooling and libraries
- **Performance optimizations**: Better tree-shaking and dead code elimination

### Migration Strategy

#### Phase 1: Setup and Configuration (Week 1-2)

**1.1 TypeScript Configuration**
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "allowJs": true,
    "checkJs": false,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**1.2 Build System Updates**
- Update Vite configuration to support TypeScript
- Add TypeScript compilation to build pipeline
- Configure dual output (ES modules + UMD) with type definitions

**1.3 Package.json Updates**
```json
{
  "scripts": {
    "build": "tsc && vite build",
    "build:types": "tsc --emitDeclarationOnly",
    "dev": "vite",
    "type-check": "tsc --noEmit",
    "lint": "eslint src/**/*.{js,ts}",
    "test": "jest"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "ts-node": "^10.9.0"
  }
}
```

#### Phase 2: Core Type Definitions (Week 3-4)

**2.1 Interface Definitions**
```typescript
// src/types/index.ts
export interface Task {
  id: string;
  name: string;
  start: string | Date;
  end?: string | Date;
  duration?: string;
  progress?: number;
  dependencies?: string | string[];
  color?: string;
  color_progress?: string;
  custom_class?: string;
  thumbnail?: string;
  description?: string;
  invalid?: boolean;
  // Internal properties (computed)
  _start?: Date;
  _end?: Date;
  _index?: number;
  actual_duration?: number;
  ignored_duration?: number;
}

export interface ViewMode {
  name: string;
  padding: string | [string, string];
  step: string;
  date_format: string;
  column_width?: number;
  lower_text?: string | ((date: Date, lastDate: Date | null, lang: string) => string);
  upper_text?: string | ((date: Date, lastDate: Date | null, lang: string) => string);
  upper_text_frequency?: number;
  thick_line?: (date: Date) => boolean;
  snap_at?: string;
}

export interface GanttOptions {
  arrow_curve?: number;
  auto_move_label?: boolean;
  bar_corner_radius?: number;
  bar_height?: number;
  container_height?: number | 'auto';
  column_width?: number | null;
  date_format?: string;
  upper_header_height?: number;
  lower_header_height?: number;
  snap_at?: string | null;
  infinite_padding?: boolean;
  holidays?: Record<string, string | ((date: Date) => boolean) | Array<{date: string, name?: string} | ((date: Date) => boolean)>>;
  ignore?: (string | ((date: Date) => boolean))[];
  language?: string;
  lines?: 'none' | 'horizontal' | 'vertical' | 'both';
  move_dependencies?: boolean;
  padding?: number;
  popup?: boolean | ((ctx: PopupContext) => string | false);
  popup_on?: 'click' | 'hover';
  readonly_progress?: boolean;
  readonly_dates?: boolean;
  readonly?: boolean;
  scroll_to?: string | Date | null;
  show_expected_progress?: boolean;
  today_button?: boolean;
  view_mode?: string;
  view_mode_select?: boolean;
  view_modes?: ViewMode[];
  on_view_change?: (mode: ViewMode) => void;
  on_date_change?: (task: Task, start: Date, end: Date) => void;
  on_progress_change?: (task: Task, progress: number) => void;
  on_click?: (task: Task) => void;
  on_double_click?: (task: Task) => void;
  on_hover?: (task: Task, x: number, y: number, event: Event) => void;
}

export interface PopupContext {
  task: Task;
  chart: Gantt;
  get_title: () => HTMLElement;
  set_title: (title: string) => void;
  get_subtitle: () => HTMLElement;
  set_subtitle: (subtitle: string) => void;
  get_details: () => HTMLElement;
  set_details: (details: string) => void;
  add_action: (html: string | ((task: Task) => string), func: (task: Task, chart: Gantt, event: Event) => void) => void;
}
```

**2.2 Utility Type Definitions**
```typescript
// src/types/utils.ts
export type DateScale = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond';
export type DurationString = `${number}${'y' | 'm' | 'd' | 'h' | 'min' | 's' | 'ms'}`;
export type DateFormat = 'YYYY-MM-DD' | 'YYYY-MM-DD HH:mm:ss' | 'YYYY-MM-DD HH:mm:ss.SSS' | string;

export interface Duration {
  duration: number;
  scale: DateScale;
}

export interface DateValues {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}
```

#### Phase 3: Gradual File Migration (Week 5-8)

**3.1 Migration Order (Low Risk to High Risk)**
1. `src/types/` - Type definitions (new files)
2. `src/date_utils.js` → `src/date_utils.ts`
3. `src/svg_utils.js` → `src/svg_utils.ts`
4. `src/defaults.js` → `src/defaults.ts`
5. `src/arrow.js` → `src/arrow.ts`
6. `src/popup.js` → `src/popup.ts`
7. `src/bar.js` → `src/bar.ts`
8. `src/index.js` → `src/index.ts`

**3.2 Migration Process for Each File**
```typescript
// Example: date_utils.ts migration
import { DateScale, Duration, DateValues, DurationString } from './types/utils';

export interface DateUtils {
  parse_duration(duration: DurationString): Duration;
  parse(date: string | Date, date_separator?: string, time_separator?: RegExp): Date;
  to_string(date: Date, with_time?: boolean): string;
  format(date: Date, date_format?: string, lang?: string): string;
  diff(date_a: Date, date_b: Date, scale?: DateScale): number;
  today(): Date;
  now(): Date;
  add(date: Date, qty: number, scale: DateScale): Date;
  start_of(date: Date, scale: DateScale): Date;
  clone(date: Date): Date;
  get_date_values(date: Date): number[];
  convert_scales(period: DurationString, to_scale: DateScale): number;
  get_days_in_month(date: Date): number;
  get_days_in_year(date: Date): number;
}

const date_utils: DateUtils = {
  // Implementation with proper typing
};

export default date_utils;
```

**3.3 Backward Compatibility**
- Maintain existing JavaScript API
- Provide type definitions for JavaScript users
- Gradual migration allows mixed codebase during transition

#### Phase 4: Main Class Migration (Week 9-10)

**4.1 Gantt Class TypeScript Migration**
```typescript
// src/index.ts
import { Task, GanttOptions, ViewMode, PopupContext } from './types';
import date_utils from './date_utils';
import { $, createSVG } from './svg_utils';
import Arrow from './arrow';
import Bar from './bar';
import Popup from './popup';
import { DEFAULT_OPTIONS, DEFAULT_VIEW_MODES } from './defaults';
import './styles/gantt.css';

export default class Gantt {
  private $svg: SVGElement;
  private $container: HTMLElement;
  private $popup_wrapper: HTMLElement;
  private $header?: HTMLElement;
  private $upper_header?: HTMLElement;
  private $lower_header?: HTMLElement;
  private $side_header?: HTMLElement;
  private $current_highlight?: HTMLElement;
  private $current_ball_highlight?: HTMLElement;
  private $extras?: HTMLElement;
  private $adjust?: HTMLElement;
  private $current?: HTMLElement;
  private $today_button?: HTMLButtonElement;

  private tasks: Task[];
  private bars: Bar[];
  private arrows: Arrow[];
  private popup?: Popup;
  private layers: Record<string, SVGElement>;
  private dates: Date[];
  private dependency_map: Record<string, string[]>;
  private config: GanttConfig;
  private options: GanttOptions;
  private original_options?: GanttOptions;
  private gantt_start: Date;
  private gantt_end: Date;
  private grid_height: number;
  private current_date: Date;
  private bar_being_dragged: boolean | null = null;
  private upperTexts: HTMLElement[];

  constructor(wrapper: string | HTMLElement | SVGElement, tasks: Task[], options?: Partial<GanttOptions>) {
    this.setup_wrapper(wrapper);
    this.setup_options(options);
    this.setup_tasks(tasks);
    this.change_view_mode();
    this.bind_events();
  }

  // All methods with proper typing...
}

// Static properties with proper typing
Gantt.VIEW_MODE = {
  HOUR: DEFAULT_VIEW_MODES[0],
  QUARTER_DAY: DEFAULT_VIEW_MODES[1],
  HALF_DAY: DEFAULT_VIEW_MODES[2],
  DAY: DEFAULT_VIEW_MODES[3],
  WEEK: DEFAULT_VIEW_MODES[4],
  MONTH: DEFAULT_VIEW_MODES[5],
  YEAR: DEFAULT_VIEW_MODES[6],
} as const;

export { Gantt };
export type { Task, GanttOptions, ViewMode, PopupContext };
```

#### Phase 5: Testing and Validation (Week 11-12)

**5.1 Type Checking**
- Full TypeScript compilation without errors
- Strict type checking enabled
- No `any` types in production code

**5.2 Integration Testing**
- Verify all existing functionality works
- Test with existing JavaScript consumers
- Validate type definitions accuracy

**5.3 Performance Testing**
- Compare bundle sizes (JS vs TS)
- Measure compilation time
- Validate runtime performance

---

## Browser Compatibility Analysis

### Current Compatibility Issues

#### 1. **Modern JavaScript Features**

**Issues Found:**
- `String.prototype.replaceAll()` - Used extensively (lines 184, 194, 113, 119, 1579)
- `Element.prototype.closest()` - Used in event delegation (line 104)
- `Element.prototype.matches()` - Used in closest implementation (line 115)
- `Element.prototype.scrollTo()` - Used for smooth scrolling (lines 931, 1244, 1256)
- `SVGElement.prototype.getBBox()` - Used for SVG measurements (lines 1060, 1065, 464, 465, 545, 689)

**Browser Support:**
- `replaceAll()`: Safari 13.1+, Edge 85+
- `closest()`: Safari 6+, Edge 12+
- `matches()`: Safari 7+, Edge 12+
- `scrollTo()`: Safari 14+, Edge 79+
- `getBBox()`: Safari 3+, Edge 12+

#### 2. **Event Handling**

**Issues Found:**
- `document.createEvent()` and `event.initEvent()` - Deprecated but still used (lines 30-31)
- Modern `addEventListener` usage is compatible

**Recommendations:**
- Replace deprecated event creation with `new Event()` or `new CustomEvent()`
- Add polyfills for older browsers if needed

#### 3. **Safari-Specific Issues**

**Current Safari Detection:**
```javascript
// Line 151 in bar.js
if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent))
```

**Issues:**
- User agent detection is unreliable
- Safari-specific corner radius handling suggests rendering differences

### Compatibility Solutions

#### 1. **Polyfills and Fallbacks**

**For `replaceAll()`:**
```typescript
// src/polyfills/string.ts
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function(search: string | RegExp, replace: string | Function): string {
    if (search instanceof RegExp) {
      if (!search.global) {
        throw new TypeError('replaceAll must be called with a global RegExp');
      }
      return this.replace(search, replace);
    }
    return this.split(search).join(replace);
  };
}
```

**For `scrollTo()`:**
```typescript
// src/polyfills/element.ts
if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = function(options?: ScrollToOptions | number, y?: number): void {
    if (typeof options === 'number' && typeof y === 'number') {
      this.scrollLeft = options;
      this.scrollTop = y;
    } else if (typeof options === 'object' && options !== null) {
      if (options.left !== undefined) this.scrollLeft = options.left;
      if (options.top !== undefined) this.scrollTop = options.top;
      if (options.behavior === 'smooth') {
        // Implement smooth scrolling fallback
        this.scrollToSmooth(options.left || this.scrollLeft, options.top || this.scrollTop);
      }
    }
  };
}
```

#### 2. **Feature Detection**

**Replace User Agent Detection:**
```typescript
// src/utils/browser.ts
export const BrowserSupport = {
  replaceAll: typeof String.prototype.replaceAll === 'function',
  scrollTo: typeof Element.prototype.scrollTo === 'function',
  closest: typeof Element.prototype.closest === 'function',
  matches: typeof Element.prototype.matches === 'function',
  getBBox: typeof SVGElement.prototype.getBBox === 'function',
  
  // Feature detection instead of user agent
  isSafari: (() => {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
           (navigator.vendor && navigator.vendor.indexOf('Apple') > -1);
  })(),
  
  isEdge: (() => {
    return /Edg\//i.test(navigator.userAgent);
  })()
};
```

#### 3. **Conditional Code Execution**

**Update bar.js corner radius logic:**
```typescript
// Instead of user agent detection
const cornerRadius = BrowserSupport.isSafari ? this.corner_radius : this.corner_radius + 2;
```

#### 4. **Modern Event Handling**

**Replace deprecated event creation:**
```typescript
// src/svg_utils.ts - Update animateSVG function
export function animateSVG(svgElement: SVGElement, attr: string, from: number, to: number): void {
  const animatedSvgElement = getAnimationElement(svgElement, attr, from, to);

  if (animatedSvgElement === svgElement) {
    // Use modern event creation
    const event = new Event('click', { bubbles: true, cancelable: true });
    animatedSvgElement.dispatchEvent(event);
  }
}
```

### Browser Support Matrix

| Feature | Chrome | Firefox | Safari | Edge | IE11 |
|---------|--------|---------|--------|------|------|
| ES6 Modules | ✅ 61+ | ✅ 60+ | ✅ 10.1+ | ✅ 16+ | ❌ |
| Arrow Functions | ✅ 45+ | ✅ 22+ | ✅ 10+ | ✅ 12+ | ❌ |
| Template Literals | ✅ 41+ | ✅ 34+ | ✅ 9+ | ✅ 12+ | ❌ |
| Destructuring | ✅ 49+ | ✅ 41+ | ✅ 8+ | ✅ 12+ | ❌ |
| Classes | ✅ 49+ | ✅ 45+ | ✅ 9+ | ✅ 13+ | ❌ |
| replaceAll() | ✅ 85+ | ✅ 77+ | ✅ 13.1+ | ✅ 85+ | ❌ |
| scrollTo() | ✅ 61+ | ✅ 36+ | ✅ 14+ | ✅ 79+ | ❌ |
| closest() | ✅ 41+ | ✅ 35+ | ✅ 6+ | ✅ 12+ | ❌ |
| getBBox() | ✅ 1+ | ✅ 1.5+ | ✅ 3+ | ✅ 12+ | ✅ 9+ |

### Recommended Minimum Browser Versions

**For TypeScript Migration:**
- Chrome 85+ (ES2020 support)
- Firefox 78+ (ES2020 support)
- Safari 14+ (ES2020 support)
- Edge 85+ (Chromium-based)

**For Current JavaScript Version:**
- Chrome 61+ (ES6 modules)
- Firefox 60+ (ES6 modules)
- Safari 10.1+ (ES6 modules)
- Edge 16+ (ES6 modules)

---

## Implementation Timeline

### Week 1-2: Setup and Configuration
- [ ] Install TypeScript and configure build system
- [ ] Set up dual output (JS + TS definitions)
- [ ] Create initial type definitions
- [ ] Update package.json and build scripts

### Week 3-4: Core Type Definitions
- [ ] Define all interfaces and types
- [ ] Create utility type definitions
- [ ] Set up strict TypeScript configuration
- [ ] Validate type definitions with existing code

### Week 5-6: Utility Modules Migration
- [ ] Migrate `date_utils.js` to TypeScript
- [ ] Migrate `svg_utils.js` to TypeScript
- [ ] Migrate `defaults.js` to TypeScript
- [ ] Add comprehensive type annotations

### Week 7-8: Component Migration
- [ ] Migrate `arrow.js` to TypeScript
- [ ] Migrate `popup.js` to TypeScript
- [ ] Migrate `bar.js` to TypeScript
- [ ] Ensure all components are properly typed

### Week 9-10: Main Class Migration
- [ ] Migrate `index.js` to TypeScript
- [ ] Add comprehensive class typing
- [ ] Implement strict type checking
- [ ] Validate API compatibility

### Week 11-12: Testing and Validation
- [ ] Full type checking validation
- [ ] Integration testing with existing consumers
- [ ] Performance benchmarking
- [ ] Documentation updates

---

## Risk Assessment

### High Risk
- **Breaking changes in public API**: Mitigated by maintaining JavaScript compatibility
- **Build system complexity**: Mitigated by gradual migration approach
- **Bundle size increase**: Mitigated by proper tree-shaking configuration

### Medium Risk
- **Type definition accuracy**: Mitigated by comprehensive testing
- **Performance impact**: Mitigated by benchmarking and optimization
- **Developer learning curve**: Mitigated by documentation and training

### Low Risk
- **Browser compatibility**: Already addressed with polyfills
- **Third-party integration**: Maintained through backward compatibility
- **Documentation updates**: Planned as part of migration

---

## Testing Strategy

### 1. **Type Safety Testing**
- Enable strict TypeScript compilation
- Zero `any` types in production code
- Comprehensive interface validation

### 2. **Functional Testing**
- All existing functionality preserved
- No regression in behavior
- Performance benchmarks maintained

### 3. **Integration Testing**
- Test with existing JavaScript consumers
- Validate type definitions accuracy
- Cross-browser compatibility testing

### 4. **Automated Testing**
- CI/CD pipeline with TypeScript compilation
- Automated type checking
- Performance regression testing

---

## Conclusion

The TypeScript migration will significantly improve the Frappe Gantt library's maintainability, developer experience, and type safety. The gradual migration approach minimizes risks while providing immediate benefits. Browser compatibility issues are well-documented and can be addressed with appropriate polyfills and feature detection.

The migration timeline of 12 weeks allows for thorough testing and validation while maintaining the library's stability and backward compatibility. The investment in TypeScript will pay dividends in reduced bugs, improved developer productivity, and better long-term maintainability.
