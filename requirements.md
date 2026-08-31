# Expense Approval — Requirements

These requirement IDs are the yardstick for "meaningful". Every generated test
should trace to one of them; every requirement should be covered at the right
layer(s).

R1  A user can submit an expense (amount, category); it starts as Pending.
R2  Amount must be > 0 and <= 10,000; invalid amounts are rejected with a clear error.
R3  Category must be one of: Travel, Meals, Equipment, Other.
R4  An approver can approve a Pending expense; it then shows Approved.
R5  A user cannot approve their own expense (segregation of duties).
R6  Expenses over 1,000 require a Manager to approve.
R7  An approver can reject a Pending expense with a required reason; a decided
    (already Approved or Rejected) expense cannot be changed.
