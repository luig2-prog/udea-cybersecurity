import { Request, Response } from 'express';
import { taskStore } from '../models/taskModel';

export const getAllTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const tasks = await taskStore.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error in getAllTasks controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const task = await taskStore.getTaskById(id);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(task);
  } catch (error) {
    console.error('Error in getTaskById controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, completed } = req.body;
    
    if (!title || title.trim() === '') {
      res.status(400).json({ message: 'Title is required' });
      return;
    }
    
    const newTask = await taskStore.createTask({
      title,
      description: description || '',
      completed: completed || false
    });
    
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error in createTask controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    if (title !== undefined && title.trim() === '') {
      res.status(400).json({ message: 'Title cannot be empty' });
      return;
    }
    
    const updatedTask = await taskStore.updateTask(id, {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(completed !== undefined && { completed })
    });
    
    if (!updatedTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error in updateTask controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await taskStore.deleteTask(id);
    
    if (!deleted) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }
    
    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteTask controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
