import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'NOT_AUTH';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
