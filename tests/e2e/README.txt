# E2E tests are generated live during the session by a Playwright test agent.
# See README.md "Layer 3" and requirements.md (start with R4).
#
# To enable Playwright first:
#   npx playwright install
#
# Then, with the app running (npm run start), point the agent at
# http://localhost:3000 and ask it to author the R4 journey:
#   submit an expense -> see it Pending -> approve -> see Approved
