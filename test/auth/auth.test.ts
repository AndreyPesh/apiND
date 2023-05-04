import { requestApp } from '../utils/helpers';

describe('Auth users', () => {
  test('It should response with status 404', async () => {
    const response = await requestApp.get('/unknown/url');
    expect(response.statusCode).toBe(404);
  });
  test('It should response 404 status', async () => {
    return requestApp.get('api/user').then((response) => {
      expect(response.statusCode).toBe(404);
      expect(response.body).toEqual({"message": "Message error", "status": "error"});
    });
  });
});
