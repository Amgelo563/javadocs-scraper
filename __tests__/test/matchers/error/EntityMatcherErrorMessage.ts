import { formatWithOptions } from 'util';

function smartJoin(arr: string[]): string {
  if (!arr.length) return '';

  let result = arr[0];
  for (let i = 1; i < arr.length; i++) {
    const curr = arr[i];
    const last = result[result.length - 1];

    const separator = last.endsWith('#') ? '' : '.';
    result += separator + curr;
  }

  return result;
}

export function generateErrorMessage(options: {
  path: string[];
  got: unknown;
  expected: unknown;
  extra?: string;
  typeofMissmatch?: boolean;
  depth?: number;
}): string {
  const { typeofMissmatch: typeMissmatch = false, depth = 1 } = options;

  const expected =
    typeof options.expected === 'string'
      ? `“${options.expected}”`
      : options.expected;
  const got =
    typeof options.got === 'string' ? `“${options.got}”` : options.got;

  const expectedValue = formatWithOptions({ colors: true, depth }, expected);
  const gotValue = formatWithOptions({ colors: true, depth }, got);

  const parts: string[] = [];

  if (typeMissmatch) {
    parts.push(`Type at ${smartJoin(options.path)} does not match:`);
    parts.push(`Expected value (${typeof options.expected}): ${expectedValue}`);
    parts.push(`Got value (${typeof options.got}): ${gotValue}`);
  } else {
    parts.push(`Value at ${smartJoin(options.path)} does not match:`);
    parts.push(`Expected: ${expectedValue}`);
    parts.push(`Got: ${gotValue}`);
  }

  if (options.extra) {
    parts.push(`Note: ${options.extra}`);
  }

  return parts.join('\n');
}
