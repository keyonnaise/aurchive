import { Request } from 'express';
import * as Zod from 'zod';
import { NetworkError } from '../errors';

export default async function validateRequest<T extends Zod.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<Zod.infer<T>> {
  const result = await schema.parseAsync(req).catch(() => {
    throw new NetworkError(400, '잘못된 요청입니다. 요청 구조를 확인해주세요.');
  });

  return result;
}
