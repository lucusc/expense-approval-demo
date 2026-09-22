---
applyTo: "tests/**/*,e2e/**/*"
---

# Testing instructions

- Take expected values only from `requirements.md` or `openapi.yaml`.
- Include the applicable requirement ID in every test name.
- Use a real temporary SQLite database for integration tests.
- Do not mock repositories.
- Assert observable output and stored state.
- Use role-based Playwright locators.
- Use Playwright web-first assertions.
- Do not use fixed waits.
- Use fixed synthetic builders for test data.
- Before creating many tests, ask for a test list to be reviewed.
