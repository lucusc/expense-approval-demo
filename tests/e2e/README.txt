# The R1 seed is both a meaningful smoke test and the setup for generated tests.
# See README.md "Layer 3" and requirements.md (extend it with R4).
#
# To enable Playwright first:
#   npx playwright install
#
# With the app running (npm run start), point the agent at
# http://localhost:3000 and ask it to extend the seed into the R4 journey:
#   submit an expense -> see it Pending -> approve -> see Approved
