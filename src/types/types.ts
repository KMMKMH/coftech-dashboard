export interface Translation {
    (key: string, options?: Record<string, unknown>): string;
}

export interface OptionType {
        value: string;
        label: string;
}