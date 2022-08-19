const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

describe('isLoggedIn', () => {
  const res = {
    status: jest.fn(() => res),
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test('로그인 되어 있으면 isLoggedIn 이 next 를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
  test('로그인 되어 있지 않으면 isLoggedIn 이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isLoggedIn(req, res, next);
    expect(res.redirect).toBeCalledWith('/');
  });
});

describe('isNotLoggedIn', () => {
  const res = {
    status: jest.fn(() => res),
    redirect: jest.fn(),
  };
  const next = jest.fn();

  test('로그인 되어 있으면 isNotLoggedIn 이 에러를 응답해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    isNotLoggedIn(req, res, next);
    const message = encodeURIComponent('로그인한 상태입니다.');
    expect(res.redirect).toBeCalledWith(`/?error=${message}`);
  });
  test('로그인 되어 있지 않으면 isNotLoggedIn 이 next 를 호출해야 함', () => {
    const req = {
      isAuthenticated: jest.fn(() => false),
    };
    isNotLoggedIn(req, res, next);
    expect(next).toBeCalledTimes(1);
  });
});
