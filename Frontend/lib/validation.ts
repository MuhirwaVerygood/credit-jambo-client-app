export interface ValidationResult {
  valid: boolean
  message?: string
}

export function validateAmount(amount: number): ValidationResult {
  if (isNaN(amount) || amount <= 0) {
    return { valid: false, message: "Amount must be a positive number" }
  }
  if (amount > 1000000000) {
    return { valid: false, message: "Amount is too large" }
  }
  return { valid: true }
}

export function validatePhoneNumber(phone: string): ValidationResult {
  // Rwanda phone number format: +250 XXX XXX XXX or 07XX XXX XXX
  const phoneRegex = /^(\+250|0)[7][0-9]{8}$/
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return { valid: false, message: "Invalid phone number format" }
  }
  return { valid: true }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "")
}

export function validateFullName(name: string): ValidationResult {
  if (name.length < 2) {
    return { valid: false, message: "Name must be at least 2 characters" }
  }
  if (name.length > 100) {
    return { valid: false, message: "Name is too long" }
  }
  return { valid: true }
}