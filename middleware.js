// Вход по логину и паролю для всего сайта (Vercel Routing Middleware).
// Логин и пароль задаются в Vercel: Settings → Environment Variables:
//   BASIC_USER = логин
//   BASIC_PASS = пароль
// Если переменные не заданы, сайт закрыт для всех. Так данные не утекут по ошибке.

export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const user = process.env.BASIC_USER;
  const pass = process.env.BASIC_PASS;
  const header = request.headers.get('authorization') || '';

  if (user && pass && header.startsWith('Basic ')) {
    try {
      const decoded = atob(header.slice(6));
      const i = decoded.indexOf(':');
      if (i > -1 && decoded.slice(0, i) === user && decoded.slice(i + 1) === pass) {
        return; // пароль верный: отдаём страницу
      }
    } catch (e) {
      // битый заголовок: просим пароль заново
    }
  }

  return new Response('Нужен логин и пароль', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Pulse registry", charset="UTF-8"',
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
