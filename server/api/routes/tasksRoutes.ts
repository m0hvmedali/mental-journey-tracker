import { Router } from 'express';
import { createGoogleTaskAndEvent } from '../../services/tasksService';

export const tasksRouter = Router();

// In-memory store as requested
export const internalTasksStore: any[] = [];

// GET tasks
tasksRouter.get('/', (req, res) => {
  res.json({ success: true, data: internalTasksStore });
});

// POST new task
tasksRouter.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const task = await createGoogleTaskAndEvent(token, req.body);
    internalTasksStore.push(task);

    res.json({ success: true, data: task });
  } catch (err: any) {
    console.error('Task Create Error:', err);
    if (err.status === 401 || err.status === 403) {
      return res.status(err.status).json({ error: 'Google Auth Error', status: err.status });
    }
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// DELETE task
tasksRouter.delete('/:id', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const idx = internalTasksStore.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Task not found' });
    const task = internalTasksStore[idx];

    // Delete from Google Tasks
    if (task.gTaskListId && task.gTaskId) {
      await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${task.gTaskListId}/tasks/${task.gTaskId}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });
    }

    // Delete from Google Calendar
    if (task.gCalEventId) {
      await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${task.gCalEventId}`, {
        method: 'DELETE',
        headers: { Authorization: token }
      });
    }

    internalTasksStore.splice(idx, 1);
    res.json({ success: true });
  } catch (err: any) {
    console.error('Task Delete Error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
