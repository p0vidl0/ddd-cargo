type DateParam = string | number | Date | undefined;

export const date = (value?: DateParam) => (value === undefined ? new Date() : new Date(value));
