import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { expect, test, vi } from 'vitest';

const html = readFileSync('src/web/index.html', 'utf8').replace(
  '<script src="app.js"></script>',
  '',
);
const app = readFileSync('src/web/app.js', 'utf8');

test('R4 a successful approval is shown in the UI', async () => {
  const pending = {
    id: 101,
    amount: 75,
    category: 'Travel',
    submitterId: 'submitter-001',
    status: 'Pending',
    reason: null,
    approverId: null,
  };
  let approved = false;
  const fetch = vi.fn(async (url, options) => {
    if (options?.method === 'POST') {
      approved = true;
      return { ok: true, json: async () => ({ ...pending, status: 'Approved' }) };
    }
    return {
      ok: true,
      json: async () => [{ ...pending, status: approved ? 'Approved' : 'Pending' }],
    };
  });
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  dom.window.fetch = fetch;
  dom.window.eval(app);

  await vi.waitFor(() => expect(dom.window.document.querySelector('.approve')).not.toBeNull());
  dom.window.document.getElementById('current-user').value = 'approver-001';
  dom.window.document.querySelector('.approve').click();

  await vi.waitFor(() =>
    expect(dom.window.document.querySelector('[data-testid="status-101"]').textContent).toBe(
      'Approved',
    ),
  );
});
