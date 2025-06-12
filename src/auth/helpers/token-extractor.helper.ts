export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return null;

  const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
  return token.startsWith('Bearer ') ? token.replace('Bearer ', '') : null;
}
