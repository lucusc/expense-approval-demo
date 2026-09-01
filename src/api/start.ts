import { createApp } from './server';
import { createDb } from './db';

const db = createDb(process.env.DB_FILE || ':memory:');
const app = createApp(db);
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Expense Approval running on http://localhost:${port}`);
});
