import { Todo, PainPoint, CalendarEvent, EventData } from "./demo";

const read = <T>(k: string, d: T): T =>
    JSON.parse(localStorage.getItem(k) ?? JSON.stringify(d));

const write = <T>(k: string, v: T) =>
    localStorage.setItem(k, JSON.stringify(v));

export const demoStore = {
    todos: {
        all: () => read('todos', [] as Todo[]),
        add: (text: string) => {
            const list = read<Todo[]>('todos', []);
            list.push({ id: Date.now(), text, status: 0 });
            write('todos', list);
        },
        update: (id: number) => {
            const list = read<Todo[]>('todos', []).map(t =>
                t.id === id ? { ...t, status: t.status ? 0 : 1 } : t
            );
            write('todos', list);
        },
        remove: (id: number) => {
            write('todos', read<Todo[]>('todos', []).filter(x => x.id !== id));
        }
    },
    painPoints: {
        all: (): PainPoint[] => read('painPoints', []),
        add: (p: Omit<PainPoint, 'id'>) => {
            const list = read<PainPoint[]>('painPoints', []);
            const id = list.length ? Math.max(...list.map(x => x.id)) + 1 : 1;
            list.unshift({ id, ...p });
            write('painPoints', list);
        },
        update: (p: PainPoint) => {
            const list = read<PainPoint[]>('painPoints', []).map(x => x.id === p.id ? p : x);
            write('painPoints', list);
        },
        remove: (id: number) => {
            write('painPoints', read<PainPoint[]>('painPoints', []).filter(x => x.id !== id));
        },
    },

    calendarEvents: {
        all: (): CalendarEvent[] => read('calendarEvents', []),
        range: (s: string, e: string) => {
            const S = new Date(s).getTime(), E = new Date(e).getTime();
            return read<CalendarEvent[]>('calendarEvents', []).filter(ev => {
                const t = new Date(ev.start).getTime();
                return t >= S && t < E;
            });
        },
        add: (d: EventData) => {
            const list = read<CalendarEvent[]>('calendarEvents', []);
            list.push({
                id: d.id ?? `event_${Date.now()}`,
                title: d.title,
                start: d.start,
                end: d.end,
                allDay: d.allDay,
                extendedProps: {
                    description: d.description ?? null,
                    type: d.type ?? 'calendar',
                },
            });
            write('calendarEvents', list);
        },
        update: (id: string, u: Partial<CalendarEvent>) => {
            const list = read<CalendarEvent[]>('calendarEvents', []).map(ev => ev.id === id ? { ...ev, ...u } : ev);
            write('calendarEvents', list);
        },
        remove: (id: string) =>
            write('calendarEvents', read<CalendarEvent[]>('calendarEvents', []).filter(ev => ev.id !== id)),
    },
};
