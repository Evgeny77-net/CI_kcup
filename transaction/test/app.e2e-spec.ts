describe('Cross-Service E2E: Auth Registration, JWT & Account Sync', () => {
  const accountUrl = process.env.ACCOUNT_SERVICE_URL || 'http://account:3001';
  const authUrl = process.env.AUTH_SERVICE_URL || 'http://auth:3002';

  it('should register user in Auth, issue JWT, login, and create Account automatically', async () => {
    const email = `jwt_user_${Date.now()}@example.com`;
    const password = 'SecurePassword123!';

    // 1. Регистрация в сервисе auth
    const regRes = await fetch(`${authUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: 'JWT Student' }),
    });

    expect(regRes.status).toBe(201);
    const regData = await regRes.json();
    expect(regData.accessToken).toBeDefined();
    expect(regData.accessToken.split('.').length).toBe(3); // Проверка формата JWT (header.payload.signature)

    // 2. Вход (Login) по паролю и получение нового токена
    const loginRes = await fetch(`${authUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    expect(loginRes.status).toBe(201);
    const loginData = await loginRes.json();
    expect(loginData.accessToken).toBeDefined();

    // 3. Проверяем, что сервис account автоматически создал профиль и начислил бонусный баланс 100
    const accRes = await fetch(`${accountUrl}/accounts`);
    const accounts = await accRes.json();
    const createdAccount = accounts.find((a: any) => a.email === email);

    expect(createdAccount).toBeDefined();
    expect(createdAccount.name).toBe('JWT Student');
    expect(Number(createdAccount.balance)).toBe(100);
  });
});
