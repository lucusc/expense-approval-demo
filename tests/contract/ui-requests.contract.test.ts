import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { parse } from 'yaml';
import { expect, test, vi } from 'vitest';

test('R4 UI approval request method and path exist in the API contract', async () => {
  const html = readFileSync('src/web/index.html', 'utf8').replace(
    '<script src="app.js"></script>',
    '',
  );
  const app = readFileSync('src/web/app.js', 'utf8');
  const pending = {
    id: 101,
    amount: 75,
    category: 'Travel',
    submitterId: 'submitter-001',
    status: 'Pending',
    reason: null,
    approverId: null,
  };
  const requests: Array<{ url: string; method: string }> = [];
  const fetch = vi.fn(async (url: string, options?: RequestInit) => {
    requests.push({ url, method: options?.method ?? 'GET' });
    return { ok: true, json: async () => [pending] };
  });
  const dom = new JSDOM(html, { runScripts: 'outside-only', url: 'http://localhost/' });
  dom.window.fetch = fetch as unknown as typeof dom.window.fetch;
  dom.window.eval(app);

  await vi.waitFor(() => expect(dom.window.document.querySelector('.approve')).not.toBeNull());
  (dom.window.document.getElementById('current-user') as HTMLSelectElement).value = 'approver-001';
  (dom.window.document.querySelector('.approve') as HTMLButtonElement).click();
  await vi.waitFor(() => expect(requests.some((request) => request.method === 'POST')).toBe(true));

  const approval = requests.find((request) => request.method === 'POST')!;
  const path = new URL(approval.url, 'http://localhost').pathname.replace(/\/\d+\//, '/{id}/');
  const contract = parse(readFileSync('openapi.yaml', 'utf8'));
  expect(contract.paths[path]?.[approval.method.toLowerCase()]).toBeDefined();
});
