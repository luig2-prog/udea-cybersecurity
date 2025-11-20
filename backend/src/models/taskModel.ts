import { pool } from '../config/db';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

class TaskStore {
  async getAllTasks(): Promise<Task[]> {
    try {
      const result = await pool.request().query(
        'SELECT id, title, description, completed, createdAt FROM Tasks ORDER BY createdAt DESC'
      );
      return result.recordset;
    } catch (error) {
      console.error('Error getting all tasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | undefined> {
    try {
      const result = await pool.request()
        .input('id', id)
        .query('SELECT id, title, description, completed, createdAt FROM Tasks WHERE id = @id');
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error getting task by ID:', error);
      throw error;
    }
  }

  async createTask(task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> {
    try {
      const id = Date.now().toString();
      const result = await pool.request()
        .input('id', id)
        .input('title', task.title)
        .input('description', task.description || '')
        .input('completed', task.completed || false)
        .query(
          'INSERT INTO Tasks (id, title, description, completed) ' +
          'VALUES (@id, @title, @description, @completed); ' +
          'SELECT id, title, description, completed, createdAt FROM Tasks WHERE id = @id'
        );
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

  async updateTask(id: string, updatedTask: Partial<Omit<Task, 'id' | 'createdAt'>>): Promise<Task | null> {
    try {
      const setClause = Object.entries(updatedTask)
        .map(([key, _]) => `${key} = @${key}`)
        .join(', ');
      
      if (!setClause) {
        return null;
      }
      
      const request = pool.request().input('id', id);
      
      Object.entries(updatedTask).forEach(([key, value]) => {
        request.input(key, value);
      });
      
      const result = await request.query(
        `UPDATE Tasks SET ${setClause} WHERE id = @id; ` +
        'SELECT id, title, description, completed, createdAt FROM Tasks WHERE id = @id'
      );
      
      if (result.recordset.length === 0) {
        return null;
      }
      
      return result.recordset[0];
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const result = await pool.request()
        .input('id', id)
        .query('DELETE FROM Tasks WHERE id = @id');
      
      return result.rowsAffected[0] > 0;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
}

export const taskStore = new TaskStore();
