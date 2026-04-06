# date-fns

date-fns is a modern JavaScript date utility library that provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript dates in a browser and Node.js. It follows a functional programming paradigm with immutable, pure functions and is built with TypeScript support from the ground up.

---

## Overview

date-fns is a **modern date utility library** for JavaScript, designed as an alternative to Moment.js. It offers a modular, functional approach to date manipulation with excellent TypeScript support, tree-shaking capabilities, and a consistent API.

### Key Features

- **Modular** - Import only what you need
- **Functional** - Pure functions, no side effects
- **Immutable** - Returns new dates, never mutates
- **TypeScript** - Built with TypeScript, fully typed
- **Tree-shakeable** - Only bundle what you use
- **I18n** - Supports 80+ locales
- **FP** - Functional programming submodule
- **Reliable** - Comprehensive test coverage (100%)

### When to Use date-fns

date-fns is ideal for:

- Formatting dates for display
- Parsing dates from user input
- Date arithmetic and calculations
- Working with timezones
- Date comparisons and validation
- Calendar and scheduling features
- Date range operations

---

## Getting Started

### Installation

```bash
npm install date-fns
# or
yarn add date-fns
# or
pnpm add date-fns
```

### Quick Start

```typescript
import { format, addDays, differenceInDays, isValid } from 'date-fns';

// Format a date
const formatted = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
// => '2024-03-15 14:30:00'

// Add days
const nextWeek = addDays(new Date(), 7);

// Calculate difference
const daysLeft = differenceInDays(nextWeek, new Date());
// => 7

// Validate date
const isValidDate = isValid(new Date('invalid'));
// => false
```

---

## Core Concepts

### Date Representation

date-fns uses native JavaScript `Date` objects:

```typescript
// Unix timestamp (milliseconds)
const timestamp = Date.now();

// Date object
const date = new Date();

// ISO string
const isoString = new Date().toISOString();

// All valid inputs for date-fns
format(new Date(), 'yyyy-MM-dd');
format(Date.now(), 'yyyy-MM-dd');
format('2024-03-15', 'yyyy-MM-dd');
```

### Function Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| Display | Format dates | `format`, `formatDistance`, `formatRelative` |
| Query | Check date properties | `isValid`, `isBefore`, `isAfter`, `isSameDay` |
| Get | Extract date components | `getYear`, `getMonth`, `getDay` |
| Set | Modify date components | `setYear`, `setMonth`, `setDay` |
| Add/Sub | Date arithmetic | `addDays`, `subMonths`, `addYears` |
| Difference | Compare dates | `differenceInDays`, `differenceInHours` |
| Compare | Date comparisons | `compareAsc`, `compareDesc` |
| Operations | Complex operations | `closestTo`, `min`, `max` |

---

## Date Formatting

### Basic Formatting

```typescript
import { format } from 'date-fns';

const date = new Date(2024, 2, 15, 14, 30, 0);

// Common formats
format(date, 'yyyy-MM-dd');           // => '2024-03-15'
format(date, 'MM/dd/yyyy');           // => '03/15/2024'
format(date, 'dd MMM yyyy');          // => '15 Mar 2024'
format(date, 'EEEE, MMMM do, yyyy');  // => 'Friday, March 15th, 2024'
format(date, 'yyyy-MM-dd HH:mm:ss');  // => '2024-03-15 14:30:00'
format(date, 'h:mm a');               // => '2:30 PM'
```

### Format Tokens

| Token | Description | Example |
|-------|-------------|---------|
| `yyyy` | 4-digit year | 2024 |
| `yy` | 2-digit year | 24 |
| `MMMM` | Full month name | March |
| `MMM` | Short month name | Mar |
| `MM` | Month number (zero-padded) | 03 |
| `M` | Month number | 3 |
| `dd` | Day of month (zero-padded) | 15 |
| `d` | Day of month | 15 |
| `EEEE` | Full day name | Friday |
| `EEE` | Short day name | Fri |
| `HH` | Hours 24h (zero-padded) | 14 |
| `H` | Hours 24h | 14 |
| `hh` | Hours 12h (zero-padded) | 02 |
| `h` | Hours 12h | 2 |
| `mm` | Minutes (zero-padded) | 30 |
| `ss` | Seconds (zero-padded) | 00 |
| `a` | AM/PM | PM |
| `O` | Timezone | GMT-5 |

### Distance Formatting

```typescript
import { formatDistance, formatDistanceToNow, formatRelative } from 'date-fns';

const date = new Date(2024, 2, 10);
const now = new Date(2024, 2, 15);

// Distance between two dates
formatDistance(date, now);
// => '5 days'

formatDistance(date, now, { addSuffix: true });
// => '5 days ago'

// Distance to now
formatDistanceToNow(date);
// => '5 days ago'

// Relative formatting
formatRelative(date, now);
// => 'last Friday at 12:00 AM'
```

### Formatting with Locales

```typescript
import { format } from 'date-fns';
import { es, fr, de, ja } from 'date-fns/locale';

const date = new Date(2024, 2, 15);

format(date, 'EEEE, MMMM do, yyyy', { locale: es });
// => 'viernes, 15 de marzo de 2024'

format(date, 'EEEE, MMMM do, yyyy', { locale: fr });
// => 'vendredi, 15 mars 2024'

format(date, 'EEEE, MMMM do, yyyy', { locale: ja });
// => '金曜日, 3月 15日, 2024'
```

---

## Date Parsing

### Basic Parsing

```typescript
import { parse, parseISO } from 'date-fns';

// Parse from specific format
const date = parse('15/03/2024', 'dd/MM/yyyy', new Date());
// => Date object for March 15, 2024

// Parse ISO string
const fromISO = parseISO('2024-03-15T14:30:00.000Z');
// => Date object

// Parse with reference date (for incomplete strings)
const parsed = parse('March', 'MMMM', new Date(2024, 0, 1));
// => Date object for March 2024
```

### Parse Patterns

```typescript
import { parse } from 'date-fns';

// Common patterns
parse('2024-03-15', 'yyyy-MM-dd', new Date());
parse('15/03/2024', 'dd/MM/yyyy', new Date());
parse('03/15/2024', 'MM/dd/yyyy', new Date());
parse('15-Mar-2024', 'dd-MMM-yyyy', new Date());
parse('2024-03-15 14:30', 'yyyy-MM-dd HH:mm', new Date());
```

### Safe Parsing

```typescript
import { parse, isValid } from 'date-fns';

function safeParse(dateString: string, format: string): Date | null {
  const parsed = parse(dateString, format, new Date());
  return isValid(parsed) ? parsed : null;
}

const result = safeParse('invalid', 'yyyy-MM-dd');
// => null

const valid = safeParse('2024-03-15', 'yyyy-MM-dd');
// => Date object
```

---

## Date Arithmetic

### Adding Time

```typescript
import { addDays, addMonths, addYears, addHours, addMinutes, addSeconds } from 'date-fns';

const date = new Date(2024, 2, 15);

addDays(date, 7);        // => 2024-03-22
addMonths(date, 2);      // => 2024-05-15
addYears(date, 1);       // => 2025-03-15
addHours(date, 5);       // => 2024-03-15 05:00
addMinutes(date, 30);    // => 2024-03-15 00:30
addSeconds(date, 90);    // => 2024-03-15 00:01:30
```

### Subtracting Time

```typescript
import { subDays, subMonths, subYears, subHours, subMinutes, subWeeks } from 'date-fns';

const date = new Date(2024, 2, 15);

subDays(date, 7);        // => 2024-03-08
subWeeks(date, 2);       // => 2024-03-01
subMonths(date, 1);      // => 2024-02-15
subYears(date, 1);       // => 2023-03-15
```

### Complex Arithmetic

```typescript
import { add, sub } from 'date-fns';

const date = new Date(2024, 2, 15);

// Add multiple units
add(date, { years: 1, months: 2, days: 3 });
// => 2025-05-18

// Subtract multiple units
sub(date, { weeks: 2, days: 3 });
// => 2024-02-27
```

### Start/End of Period

```typescript
import {
  startOfDay, endOfDay,
  startOfWeek, endOfWeek,
  startOfMonth, endOfMonth,
  startOfYear, endOfYear,
  startOfQuarter, endOfQuarter
} from 'date-fns';

const date = new Date(2024, 2, 15, 14, 30);

startOfDay(date);        // => 2024-03-15 00:00:00
endOfDay(date);          // => 2024-03-15 23:59:59

startOfWeek(date);       // => 2024-03-10 00:00:00 (Sunday)
endOfWeek(date);         // => 2024-03-16 23:59:59

startOfMonth(date);      // => 2024-03-01 00:00:00
endOfMonth(date);        // => 2024-03-31 23:59:59

startOfQuarter(date);    // => 2024-01-01 00:00:00
endOfQuarter(date);      // => 2024-03-31 23:59:59

startOfYear(date);       // => 2024-01-01 00:00:00
endOfYear(date);        // => 2024-12-31 23:59:59
```

---

## Date Comparison

### Basic Comparisons

```typescript
import { isBefore, isAfter, isEqual, isSameDay, isSameMonth, isSameYear } from 'date-fns';

const date1 = new Date(2024, 2, 15);
const date2 = new Date(2024, 2, 20);
const date3 = new Date(2024, 2, 15);

isBefore(date1, date2);    // => true
isAfter(date2, date1);      // => true
isEqual(date1, date3);      // => true

isSameDay(date1, date3);     // => true
isSameMonth(date1, date2);  // => true
isSameYear(date1, date2);   // => true
```

### Range Checking

```typescript
import { isWithinInterval, isPast, isFuture, isToday, isYesterday, isTomorrow } from 'date-fns';

const date = new Date(2024, 2, 15);

// Check if date is within interval
isWithinInterval(date, {
  start: new Date(2024, 2, 1),
  end: new Date(2024, 2, 31)
});
// => true

// Relative checks
isPast(date);       // Check if date is in the past
isFuture(date);     // Check if date is in the future
isToday(date);      // Check if date is today
isYesterday(date);  // Check if date was yesterday
isTomorrow(date);   // Check if date is tomorrow
```

### Comparing Multiple Dates

```typescript
import { compareAsc, compareDesc, min, max, closestTo } from 'date-fns';

const dates = [
  new Date(2024, 2, 15),
  new Date(2024, 2, 10),
  new Date(2024, 2, 20),
];

// Sort ascending
dates.sort(compareAsc);
// => [Mar 10, Mar 15, Mar 20]

// Sort descending
dates.sort(compareDesc);
// => [Mar 20, Mar 15, Mar 10]

// Get earliest date
min(dates);
// => Mar 10

// Get latest date
max(dates);
// => Mar 20

// Find closest date to target
closestTo(new Date(2024, 2, 12), dates);
// => Mar 10
```

---

## Date Difference

### Difference Functions

```typescript
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInYears,
  differenceInCalendarDays,
  differenceInBusinessDays
} from 'date-fns';

const date1 = new Date(2024, 2, 15);
const date2 = new Date(2024, 3, 20);

// Time differences
differenceInDays(date2, date1);       // => 36
differenceInHours(date2, date1);      // => 864
differenceInMinutes(date2, date1);  // => 51840

// Calendar differences
differenceInMonths(date2, date1);   // => 1
differenceInYears(date2, date1);    // => 0

// Business days (excludes weekends)
differenceInBusinessDays(date2, date1);
// => 26

// Calendar days (ignores time)
differenceInCalendarDays(date2, date1);
// => 36
```

---

## Week Operations

### Week Number

```typescript
import { getWeek, getISOWeek, setWeek, setISOWeek } from 'date-fns';

const date = new Date(2024, 2, 15);

// Get week number
getWeek(date);         // => 11 (local week)
getISOWeek(date);      // => 11 (ISO week)

// Set week number
setWeek(date, 20);     // => 2024-05-13
setISOWeek(date, 20);  // => 2024-05-13
```

### Week Options

```typescript
import { getWeek, startOfWeek, endOfWeek } from 'date-fns';

const date = new Date(2024, 2, 15);

// Week starts on Sunday (default in US)
startOfWeek(date, { weekStartsOn: 0 });
// => 2024-03-10

// Week starts on Monday
startOfWeek(date, { weekStartsOn: 1 });
// => 2024-03-11

// First week contains at least 4 days
getWeek(date, { firstWeekContainsDate: 4 });
```

---

## Internationalization

### Locale Setup

```typescript
import { format, parse } from 'date-fns';
import { enUS, es, fr, de, it, pt, ja, zhCN, ar, ru } from 'date-fns/locale';

const date = new Date(2024, 2, 15);

// Spanish
format(date, 'EEEE, d MMMM yyyy', { locale: es });
// => 'viernes, 15 de marzo de 2024'

// French
format(date, 'EEEE d MMMM yyyy', { locale: fr });
// => 'vendredi 15 mars 2024'

// German
format(date, 'EEEE, d. MMMM yyyy', { locale: de });
// => 'Freitag, 15. März 2024'
```

### Locale-aware Distance

```typescript
import { formatDistance } from 'date-fns';
import { es, fr } from 'date-fns/locale';

const date = new Date(2024, 2, 10);
const now = new Date(2024, 2, 15);

formatDistance(date, now, { locale: es });
// => '5 días'

formatDistance(date, now, { locale: fr });
// => '5 jours'
```

### Dynamic Locale Loading

```typescript
import { format } from 'date-fns';

async function formatWithLocale(date: Date, localeCode: string) {
  const locale = await import(`date-fns/locale/${localeCode}`);
  return format(date, 'PPP', { locale: locale.default });
}

const formatted = await formatWithLocale(new Date(), 'es');
```

---

## Timezone Handling

### UTC Operations

```typescript
import {
  formatUTC,
  parseISO,
  startOfDay,
  addHours
} from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Note: For full timezone support, use date-fns-tz
import { zonedTimeToUtc, utcToZonedTime, format } from 'date-fns-tz';

// Convert local time to UTC
const utcDate = zonedTimeToUtc('2024-03-15 14:30:00', 'America/New_York');

// Convert UTC to specific timezone
const zonedDate = utcToZonedTime(new Date(), 'America/Los_Angeles');

// Format with timezone
const formatted = format(zonedDate, 'yyyy-MM-dd HH:mm:ss zzz', {
  timeZone: 'America/Los_Angeles'
});
```

### Timezone Considerations

```typescript
// Working with UTC dates
function toUTCDate(localDate: Date, timeZone: string): Date {
  return zonedTimeToUtc(localDate, timeZone);
}

// Display in user's timezone
function displayInTimeZone(utcDate: Date, timeZone: string): string {
  const zonedDate = utcToZonedTime(utcDate, timeZone);
  return format(zonedDate, 'PPP ppp', { timeZone });
}
```

---

## Functional Programming (FP)

### Curried Functions

```typescript
import { addDays, format, parse } from 'date-fns/fp';

// Curried functions
const add7Days = addDays(7);
const formatISO = format('yyyy-MM-dd');
const parseISO = parse('yyyy-MM-dd');

// Usage
const nextWeek = add7Days(new Date());
const formatted = formatISO(new Date());
const parsed = parseISO('2024-03-15');
```

### Function Composition

```typescript
import { pipe } from 'date-fns/fp';
import { addDays, format, parse } from 'date-fns';

// Using lodash-fp or ramda with date-fns
import { flow } from 'lodash/fp';

const processDate = flow(
  parse('yyyy-MM-dd', new Date()),
  addDays(7),
  format('PPP')
);

const result = processDate('2024-03-15');
// => 'March 22nd, 2024'
```

---

## Common Patterns

### Date Range Generation

```typescript
import { eachDayOfInterval, format } from 'date-fns';

function generateDateRange(start: Date, end: Date): string[] {
  const days = eachDayOfInterval({ start, end });
  return days.map(day => format(day, 'yyyy-MM-dd'));
}

const range = generateDateRange(
  new Date(2024, 2, 1),
  new Date(2024, 2, 10)
);
// => ['2024-03-01', '2024-03-02', ..., '2024-03-10']
```

### Age Calculation

```typescript
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

function calculateAge(birthDate: Date): { years: number; months: number; days: number } {
  const now = new Date();
  const years = differenceInYears(now, birthDate);
  const months = differenceInMonths(now, birthDate) % 12;
  const days = differenceInDays(now, birthDate) % 30;

  return { years, months, days };
}

const age = calculateAge(new Date(1990, 5, 15));
// => { years: 33, months: 9, days: 0 }
```

### Date Validation

```typescript
import { isValid, isBefore, isAfter, parseISO } from 'date-fns';

interface DateRangeValidation {
  startDate: string;
  endDate: string;
}

function validateDateRange({ startDate, endDate }: DateRangeValidation): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (!isValid(start)) {
    errors.push('Invalid start date');
  }

  if (!isValid(end)) {
    errors.push('Invalid end date');
  }

  if (errors.length === 0 && !isBefore(start, end)) {
    errors.push('Start date must be before end date');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
```

### Scheduling Helper

```typescript
import { addDays, isWeekend, nextMonday, format } from 'date-fns';

function getNextBusinessDay(date: Date, days: number): Date {
  let result = addDays(date, days);

  while (isWeekend(result)) {
    result = nextMonday(result);
  }

  return result;
}

const dueDate = getNextBusinessDay(new Date(), 3);
console.log(format(dueDate, 'PPP'));
```

### Group by Date

```typescript
import { format, parseISO } from 'date-fns';

function groupByDate<T extends { date: string }>(
  items: T[],
  formatStr: string = 'yyyy-MM-dd'
): Record<string, T[]> {
  return items.reduce((groups, item) => {
    const date = parseISO(item.date);
    const key = format(date, formatStr);

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

// Usage
const events = [
  { id: 1, date: '2024-03-15', title: 'Event 1' },
  { id: 2, date: '2024-03-15', title: 'Event 2' },
  { id: 3, date: '2024-03-16', title: 'Event 3' },
];

const grouped = groupByDate(events);
// => { '2024-03-15': [...], '2024-03-16': [...] }
```

---

## Integration with React

### Custom Hook

```typescript
import { useState, useCallback } from 'react';
import { format, parseISO, isValid } from 'date-fns';

interface UseDateInputReturn {
  value: string;
  date: Date | null;
  isValid: boolean;
  onChange: (value: string) => void;
  formatted: string;
}

function useDateInput(
  initialValue: string = '',
  formatStr: string = 'yyyy-MM-dd'
): UseDateInputReturn {
  const [value, setValue] = useState(initialValue);

  const date = parseISO(value);
  const isValidDate = isValid(date) && value !== '';

  const onChange = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  const formatted = isValidDate ? format(date, 'PPP') : '';

  return {
    value,
    date: isValidDate ? date : null,
    isValid: isValidDate,
    onChange,
    formatted,
  };
}

// Usage
function DateInput() {
  const { value, onChange, formatted, isValid } = useDateInput();

  return (
    <div>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isValid && <span>{formatted}</span>}
    </div>
  );
}
```

### Date Range Picker

```typescript
import { useState } from 'react';
import { format, isBefore, isAfter, isSameDay, addDays } from 'date-fns';

interface DateRange {
  start: Date | null;
  end: Date | null;
}

function DateRangePicker() {
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const handleDateClick = (date: Date) => {
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else if (isBefore(date, range.start)) {
      setRange({ start: date, end: range.start });
    } else {
      setRange({ ...range, end: date });
    }
  };

  const isInRange = (date: Date) => {
    if (!range.start) return false;
    if (!range.end && hoverDate) {
      return isAfter(date, range.start) && isBefore(date, hoverDate);
    }
    if (range.end) {
      return isAfter(date, range.start) && isBefore(date, range.end);
    }
    return false;
  };

  return (
    <div>
      {/* Calendar rendering logic */}
      <p>
        {range.start && format(range.start, 'MMM d, yyyy')}
        {range.end && ` - ${format(range.end, 'MMM d, yyyy')}`}
      </p>
    </div>
  );
}
```

---

## TypeScript Support

### Type Definitions

```typescript
import type { Locale, FormatOptions } from 'date-fns';

// Function types
type DateInput = Date | number | string;
type DateFormatter = (date: DateInput, format: string, options?: FormatOptions) => string;
type DateParser = (dateString: string, format: string, referenceDate: DateInput) => Date;

// Custom function with types
const safeFormat: DateFormatter = (date, format, options) => {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return 'Invalid Date';
  }
  return format(parsed, format, options);
};
```

### Generic Date Helpers

```typescript
import { format, isValid } from 'date-fns';

class DateHelper<T extends Record<string, any>> {
  constructor(private dateField: keyof T) {}

  formatItem(item: T, formatStr: string): string {
    const date = new Date(item[this.dateField] as string);
    return isValid(date) ? format(date, formatStr) : 'Invalid Date';
  }

  sortByDate(items: T[]): T[] {
    return [...items].sort((a, b) => {
      const dateA = new Date(a[this.dateField] as string).getTime();
      const dateB = new Date(b[this.dateField] as string).getTime();
      return dateA - dateB;
    });
  }
}

// Usage
interface Event {
  id: number;
  title: string;
  eventDate: string;
}

const eventHelper = new DateHelper<Event>('eventDate');
```

---

## Performance Optimization

### Memoization

```typescript
import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';

function DateList({ items }: { items: Array<{ id: number; date: string }> }) {
  const formattedDates = useMemo(() => {
    return items.map(item => ({
      ...item,
      formatted: format(parseISO(item.date), 'PPP'),
    }));
  }, [items]);

  return (
    <ul>
      {formattedDates.map(item => (
        <li key={item.id}>{item.formatted}</li>
      ))}
    </ul>
  );
}
```

### Batch Processing

```typescript
import { format } from 'date-fns';

function batchFormatDates(
  dates: Date[],
  formatStr: string,
  batchSize: number = 100
): string[] {
  const results: string[] = [];

  for (let i = 0; i < dates.length; i += batchSize) {
    const batch = dates.slice(i, i + batchSize);
    const formatted = batch.map(date => format(date, formatStr));
    results.push(...formatted);

    // Yield to event loop
    if (i + batchSize < dates.length) {
      setTimeout(() => {}, 0);
    }
  }

  return results;
}
```

---

## Best Practices

### Date Storage

```typescript
// Store dates as ISO strings in UTC
const storedDate = new Date().toISOString();
// => '2024-03-15T14:30:00.000Z'

// Parse when retrieving
const date = parseISO(storedDate);
```

### Immutable Operations

```typescript
// Always create new dates, never mutate
const original = new Date(2024, 2, 15);
const modified = addDays(original, 7);

console.log(original);  // => 2024-03-15 (unchanged)
console.log(modified);  // => 2024-03-22 (new date)
```

### Consistent Formatting

```typescript
// Create a date formatting utility
export const DateFormats = {
  short: 'yyyy-MM-dd',
  medium: 'MMM d, yyyy',
  long: 'EEEE, MMMM do, yyyy',
  iso: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
  display: 'PPP',  // date-fns builtin
  displayWithTime: 'PPP p',  // date-fns builtin
} as const;

export function formatDate(
  date: Date | string | number,
  formatKey: keyof typeof DateFormats = 'medium'
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  if (!isValid(dateObj)) return 'Invalid Date';
  return format(dateObj, DateFormats[formatKey]);
}
```

### Error Handling

```typescript
import { isValid, parseISO } from 'date-fns';

function safeParseDate(dateInput: unknown): Date | null {
  if (dateInput instanceof Date) {
    return isValid(dateInput) ? dateInput : null;
  }

  if (typeof dateInput === 'string') {
    const parsed = parseISO(dateInput);
    return isValid(parsed) ? parsed : null;
  }

  if (typeof dateInput === 'number') {
    const date = new Date(dateInput);
    return isValid(date) ? date : null;
  }

  return null;
}
```

---

## Troubleshooting

### Common Issues

**Invalid Date warnings:**
- Check input format matches expected format
- Verify date string is parseable
- Use `isValid()` before operations

**Timezone confusion:**
- Use `date-fns-tz` for timezone handling
- Store dates in UTC
- Convert to local time only for display

**Locale not working:**
- Import locale correctly: `import { es } from 'date-fns/locale'`
- Pass locale in options: `{ locale: es }`
- For dynamic imports, use `await import()`

### Debug Helper

```typescript
import { isValid, format } from 'date-fns';

function debugDate(date: unknown): void {
  console.log('Input:', date);
  console.log('Type:', typeof date);
  console.log('Instance of Date:', date instanceof Date);

  if (date instanceof Date) {
    console.log('Is Valid:', isValid(date));
    console.log('ISO String:', date.toISOString());
    console.log('Formatted:', format(date, 'yyyy-MM-dd HH:mm:ss'));
  }
}
```

---

## Migration

### From Moment.js

**Before (Moment.js):**
```javascript
import moment from 'moment';

const formatted = moment().format('YYYY-MM-DD');
const future = moment().add(7, 'days');
const diff = moment().diff(moment('2024-01-01'), 'days');
```

**After (date-fns):**
```typescript
import { format, addDays, differenceInDays, parseISO } from 'date-fns';

const formatted = format(new Date(), 'yyyy-MM-dd');
const future = addDays(new Date(), 7);
const diff = differenceInDays(new Date(), parseISO('2024-01-01'));
```

**Key Differences:**
- Moment mutates dates; date-fns is immutable
- Moment is a single large package; date-fns is modular
- Moment has built-in timezone; date-fns uses date-fns-tz
- Moment has a wrapper object; date-fns uses native Date

---

## Resources

- [Official Documentation](https://date-fns.org/)
- [GitHub Repository](https://github.com/date-fns/date-fns)
- [FP Submodule Guide](https://date-fns.org/docs/FP-Guide)
- [Timezone Documentation](https://date-fns.org/docs/Time-Zones)

---

## Version Information

- **Current Version:** 3.x (v4 coming soon)
- **License:** MIT
- **Browser Support:** Modern browsers, IE11+ (v2)
- **Node.js:** 12+
- **Bundle Size:** ~10KB for common functions (tree-shaken)
