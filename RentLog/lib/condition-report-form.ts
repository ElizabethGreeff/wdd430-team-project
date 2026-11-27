// Shared by the Server Action and the client form ("use server" files may only export async functions).

export interface ConditionReportFormState {
    message: string | null;
    /** Field name → messages, e.g. "room-kitchen-photos" or "reportDate". */
    errors: Record<string, string[]>;
    /** Text the user typed, so the form can refill itself after a failed submit. */
    values?: Record<string, string>;
}

export const initialConditionReportFormState: ConditionReportFormState = { message: null, errors: {} };
