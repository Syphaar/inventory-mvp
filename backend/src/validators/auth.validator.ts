export function validateLoginInput(data: {
  email: unknown;
  password: unknown;
}): string[] {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required and must be a string");
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required and must be a string");
  }

  if (typeof data.email === "string" && data.email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Email format is invalid");
    }
  }

  if (typeof data.password === "string" && data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
}

export function validateRegisterInput(data: {
  name: unknown;
  email: unknown;
  password: unknown;
}): string[] {
  const errors: string[] = [];

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!data.email || typeof data.email !== "string") {
    errors.push("Email is required and must be a string");
  }

  if (!data.password || typeof data.password !== "string") {
    errors.push("Password is required and must be a string");
  }

  if (typeof data.email === "string" && data.email.length > 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Email format is invalid");
    }
  }

  if (typeof data.password === "string" && data.password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  return errors;
}
