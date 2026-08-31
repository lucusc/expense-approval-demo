// Minimal front-end for the demo. Two fixed users so segregation-of-duties (R5)
// is demonstrable: submitter = "alice", approver = "bob".
const SUBMITTER = 'alice';
const APPROVER = 'bob';

const errorEl = document.getElementById('error');
const rowsEl = document.getElementById('rows');

async function load() {
  const res = await fetch('/expenses');
  const expenses = await res.json();
  rowsEl.innerHTML = '';
  for (const e of expenses) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-testid', `row-${e.id}`);
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.amount}</td>
      <td>${e.category}</td>
      <td class="status-${e.status}" data-testid="status-${e.id}">${e.status}</td>
      <td>
        <button data-testid="approve-${e.id}" data-id="${e.id}" class="approve">Approve</button>
        <button data-testid="reject-${e.id}" data-id="${e.id}" class="reject">Reject</button>
      </td>`;
    rowsEl.appendChild(tr);
  }
}

document.getElementById('submit-form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  errorEl.textContent = '';
  const amount = Number(document.getElementById('amount').value);
  const category = document.getElementById('category').value;
  const res = await fetch('/expenses', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, category, submitterId: SUBMITTER }),
  });
  if (!res.ok) {
    const body = await res.json();
    errorEl.textContent = body.error || 'Submit failed';
    return;
  }
  document.getElementById('amount').value = '';
  await load();
});

rowsEl.addEventListener('click', async (ev) => {
  const btn = ev.target.closest('button');
  if (!btn) return;
  errorEl.textContent = '';
  const id = btn.getAttribute('data-id');
  const approverRole = document.getElementById('approver-role').value;

  let res;
  if (btn.classList.contains('approve')) {
    res = await fetch(`/expenses/${id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverId: APPROVER, approverRole }),
    });
  } else {
    res = await fetch(`/expenses/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverId: APPROVER, approverRole, reason: 'Not allowed' }),
    });
  }
  if (!res.ok) {
    const body = await res.json();
    errorEl.textContent = body.error || 'Action failed';
    return;
  }
  await load();
});

load();
