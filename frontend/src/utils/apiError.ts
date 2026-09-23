import { ERROR_MESSAGES } from "../constants/errorMessages";

export const toApiError = (body: unknown, fallbackCode = "VALIDATION_FAILED") => {
  const code = (body as { code?: string })?.code ?? fallbackCode;
  const message =
    ERROR_MESSAGES[code as keyof typeof ERROR_MESSAGES] ??
    (body as { message?: string })?.message ??
    code;
  return Object.assign(new Error(message), { code });
};
