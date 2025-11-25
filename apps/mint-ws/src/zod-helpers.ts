import { ZodError } from "zod";

export function formatZodErrors(error: ZodError) {
  return error.issues.map((e) => {
    const path = e.path.join(".");
    const message = e.message;

    return `• ${path || "(root)"}: ${message}`;
  }).join("\n");
}
