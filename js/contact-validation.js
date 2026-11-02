"use strict";
const form = document.getElementById("interest-form");
const validationRules = [
  { id: "full-name", check: value => value.length >= 2, message: "Enter your full name (at least 2 characters)." },
  { id: "email", check: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), message: "Enter a valid email address, such as name@example.com." },
  { id: "interest", check: value => value !== "", message: "Choose an interest type." },
  { id: "availability", check: value => value !== "", message: "Choose your availability." },
  { id: "message", check: value => value.length >= 10, message: "Write at least 10 characters in your message." }
];
function validateField(rule) {
  const input = document.getElementById(rule.id);
  const error = document.getElementById(`${rule.id}-error`);
  const valid = rule.check(input.value.trim());
  error.textContent = valid ? "" : rule.message;
  input.setAttribute("aria-invalid", String(!valid));
  if (valid) input.removeAttribute("aria-describedby");
  else input.setAttribute("aria-describedby", error.id);
  return valid;
}
if (form) {
  for (const rule of validationRules) {
    const input = document.getElementById(rule.id);
    input.addEventListener(input.tagName === "SELECT" ? "change" : "input", () => validateField(rule));
  }
  form.addEventListener("submit", event => {
    event.preventDefault(); // Educational demonstration: no backend submission exists.
    const results = validationRules.map(rule => ({ rule, valid: validateField(rule) }));
    const firstInvalid = results.find(result => !result.valid);
    const result = document.getElementById("form-result");
    if (firstInvalid) {
      result.textContent = "Please correct the highlighted fields before continuing.";
      document.getElementById(firstInvalid.rule.id).focus();
    } else {
      result.textContent = "All fields passed validation. This educational demo does not send your inquiry.";
    }
  });
}
