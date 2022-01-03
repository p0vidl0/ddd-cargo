export const nullSafe = <T>(actual: T, safe: T): T => (actual == null ? safe : actual);
