function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function toCamelCase(key: string) {
  return key.replace(/_([a-z])/g, (_, char: string) => char.toUpperCase());
}

function toSnakeCase(key: string) {
  return key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);
}

export function camelizeKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => camelizeKeys(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.entries(value).reduce(
      (acc, [key, nestedValue]) => {
        acc[toCamelCase(key)] = camelizeKeys(nestedValue);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as T;
  }

  return value;
}

export function snakeCaseKeys<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => snakeCaseKeys(item)) as T;
  }

  if (isPlainObject(value)) {
    return Object.entries(value).reduce(
      (acc, [key, nestedValue]) => {
        acc[toSnakeCase(key)] = snakeCaseKeys(nestedValue);
        return acc;
      },
      {} as Record<string, unknown>,
    ) as T;
  }

  return value;
}
