export const createBusinessError = (status: number, code: string, message: string) =>
  Object.assign(new Error(message), { status, code });
