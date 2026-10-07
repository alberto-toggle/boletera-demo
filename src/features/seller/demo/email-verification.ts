// Demo only: no email is sent and this is not an authentication mechanism.
export const DEMO_EMAIL_CODE = "123456";
const challenges = new Map<
  string,
  { email: string; expiresAt: number; sentAt: number }
>();
export function sendEmailCode(saleId: string, email: string): string | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Escribe un correo válido.";
  const previous = challenges.get(saleId);
  if (previous?.email === email && Date.now() - previous.sentAt < 30_000)
    return "Espera 30 segundos antes de reenviar el código.";
  challenges.set(saleId, {
    email,
    sentAt: Date.now(),
    expiresAt: Date.now() + 300_000,
  });
  return null;
}
export function verifyEmailCode(
  saleId: string,
  email: string,
  code: string,
): string | null {
  const challenge = challenges.get(saleId);
  if (!challenge || challenge.email !== email)
    return "Solicita un código para este correo.";
  if (Date.now() > challenge.expiresAt)
    return "El código venció. Solicita uno nuevo.";
  if (code !== DEMO_EMAIL_CODE)
    return "El código no coincide. Revisa los seis dígitos.";
  return null;
}
