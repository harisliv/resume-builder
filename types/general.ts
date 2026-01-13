import * as z from 'zod';

export const enumWithDefaultEmpty = <TValue extends string>(
  values: readonly [TValue, ...TValue[]]
) => z.union([z.enum(values), z.literal('')]);
