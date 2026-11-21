describe('Cross-Service E2E: Account Creation', () => {
  const accountUrl = process.env.ACCOUNT_SERVICE_URL || 'http://account:3001';

  it('should create a real user in Account service and persist in Postgres', async () => {
    const email = `user_${Date.now()}@example.com`;

    // 1. Отправляем запрос на создание пользователя в сервис account
    const createRes = await fetch(`${accountUrl}/accounts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        name: 'Test User',
        balance: 500,
      }),
    });

    expect(createRes.status).toBe(201);
    const createdUser = await createRes.json();
    expect(createdUser.id).toBeDefined();
    expect(createdUser.email).toBe(email);
    expect(Number(createdUser.balance)).toBe(500);

    // 2. Проверяем, что пользователь реально сохранился в БД Postgres
    const listRes = await fetch(`${accountUrl}/accounts`);
    expect(listRes.status).toBe(200);
    const users = await listRes.json();
    expect(users.some((u: any) => u.email === email)).toBe(true);
  });
});
