import request from 'supertest';
import http from 'http';
import app from '../src/index';

jest.mock('../src/config/db', () => {
  const mockRequest = {
    input: jest.fn().mockReturnThis(),
    query: jest.fn(),
  };
  return {
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
    pool: {
      connect: jest.fn().mockResolvedValue(undefined),
      request: jest.fn(() => mockRequest),
      close: jest.fn().mockResolvedValue(undefined),
    },
  };
});

import { pool, initializeDatabase } from '../src/config/db';

let server: http.Server;

describe('Task API Routes', () => {
  beforeAll(async () => {
    await initializeDatabase();
    server = app.listen(0);
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    await pool.close();
  });

  const getMockQuery = () => (pool.request() as any).query as jest.Mock;

  beforeEach(() => {
    getMockQuery().mockReset();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'This is a test task',
      };

      const expectedTaskResponse = {
        id: 'mock-id-123',
        ...taskData,
        completed: false,
      };

      getMockQuery().mockResolvedValueOnce({
        recordset: [expectedTaskResponse],
      });

      const response = await request(app)
        .post('/api/tasks')
        .send(taskData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toHaveProperty('id', expectedTaskResponse.id);
      expect(response.body.title).toBe(expectedTaskResponse.title);
      expect(response.body.description).toBe(expectedTaskResponse.description);
      expect(response.body.completed).toBe(expectedTaskResponse.completed);

      expect(getMockQuery()).toHaveBeenCalledTimes(1);
    });

    it('should return 400 if title is not provided', async () => {
      const taskDataWithoutTitle = {
        description: 'This is a test task without title',
      };

      await request(app)
        .post('/api/tasks')
        .send(taskDataWithoutTitle)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(getMockQuery()).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/tasks', () => {
    it('should return 200 with all tasks', async () => {
      const expectedTaskResponse = {
        id: '1',
        title: 'First task',
        description: 'This is the first task in the database',
        completed: false,
      };

      getMockQuery().mockResolvedValueOnce({
        recordset: [expectedTaskResponse],
      });

      const response = await request(app)
        .get('/api/tasks')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual([expectedTaskResponse]);

      expect(getMockQuery()).toHaveBeenCalledTimes(1);
    });
  });

});
