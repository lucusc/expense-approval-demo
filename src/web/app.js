const USERS = {
  'submitter-001': { id: 'submitter-001', role: 'Employee' },
  'approver-001': { id: 'approver-001', role: 'Employee' },
  'manager-001': { id: 'manager-001', role: 'Manager' },
};

const errorEl = document.getElementById('error');
const rowsEl = document.getElementById('rows');
const currentUserEl = document.getElementById('current-user');

function currentUser() {
  return USERS[currentUserEl.value];
}

async function load() {
  const res = await fetch('/expenses');
  const expenses = await res.json();
  rowsEl.innerHTML = '';
  for (const e of expenses) {
    const tr = document.createElement('tr');
    tr.setAttribute('data-testid', `row-${e.id}`);
    const actions = e.status === 'Pending'
      ? `<button data-testid="approve-${e.id}" data-id="${e.id}" class="approve">Approve</button>
         <button data-testid="reject-${e.id}" data-id="${e.id}" class="reject">Reject</button>`
      : '';
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.amount}</td>
      <td>${e.category}</td>
      <td class="status-${e.status}" data-testid="status-${e.id}">${e.status}</td>
      <td>${actions}</td>`;
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
    body: JSON.stringify({ amount, category, submitterId: currentUser().id }),
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
  const user = currentUser();

  let res;
  if (btn.classList.contains('approve')) {
    const statusEl = document.querySelector(`[data-testid="status-${id}"]`);
    statusEl.textContent = 'Approved';
    statusEl.className = 'status-Approved';
    res = await fetch(`/expenses/${id}/approval`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverId: user.id, approverRole: user.role }),
    });
  } else {
    res = await fetch(`/expenses/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approverId: user.id, approverRole: user.role, reason: 'Not allowed' }),
    });
  }
  if (!res.ok) {
    const body = await res.json();
    errorEl.textContent = body.error || 'Action failed';
    return;
  }
  await load();
});

currentUserEl.addEventListener('change', load);

load();
