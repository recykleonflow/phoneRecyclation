import { PreauthMiddleware } from './preauth.middleware';

describe('PreauthMiddleware', () => {
  it('should be defined', () => {
    expect(new PreauthMiddleware()).toBeDefined();
  });
});
