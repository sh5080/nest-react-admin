import { Request } from 'express';

export interface AuthRequest extends Request {
  user: AuthRequest;
  userId: bigint;
  role: number;
}

export interface FileRequest {
  file: Express.Multer.File[] & Request;
}

export type UpdateImage = Record<string, string>;
