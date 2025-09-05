export type Todo = { id: number; text: string; status: number };
export type PainPoint = {
    id: number;
    tag: string;
    title: string;
    status: number;
    level: number;
    description: string;
    possible_solution_description: string;
    possible_solution_result: string;
};

export type EventData = {
    id?: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    description?: string;
    type?: string;
}

export type CalendarEventRow = {
    id: string;
    title: string;
    start_date: string;
    end_date: string;
    all_day: number;
    description: string | null;
    type: string;
}

export type CalendarEvent = {
    id: string;
    title: string;
    start: string;
    end: string;
    allDay: boolean;
    extendedProps: {
        type: string;
        description: string | null;
    };
}

export type EventUpdates = {
    title?: string;
    start?: string;
    end?: string;
    allDay?: boolean;
    description?: string;
    type?: string;
}

export type Expense = {
    id: number;
    amount: number;
    category: string;
    subCategory: string;
    paymentMethod: string;
    date: string;
    timeOfDay: string;
    area: string;
    satisfication: number;
}