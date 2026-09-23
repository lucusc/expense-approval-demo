---
description: Validate the API contract
---

Propose the smallest contract test list by operation and requirement ID, then
wait for review before writing tests. For UI approval coverage, execute the
real browser module under jsdom, capture its outgoing request method and path,
normalize the concrete expense ID to `{id}`, and validate that operation
against `openapi.yaml`. Take all expected behavior from the contract rather
than application code.
