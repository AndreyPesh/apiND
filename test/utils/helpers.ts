import request from 'supertest';

const BASE_URL = 'http://localhost:3000/';

export const requestApp = request(BASE_URL);
