import { supabase } from '@/supabaseClient';
import { authService } from './authService';

export const tasksService = {
  /**
   * Get the current user ID securely.
   */
  async getUserId() {
    try {
      const user = await authService.getCurrentUser();
      return user?.id || null;
    } catch {
      return null;
    }
  },

  /**
   * Fetch all tasks for the current user
   */
  async getTasks() {
    const userId = await this.getUserId();
    if (!userId) {
      // Fallback for non-logged in or legacy
      const local = localStorage.getItem('user_tasks');
      return local ? JSON.parse(local) : [];
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Failed to fetch tasks from Supabase, falling back to local storage', error);
      const local = localStorage.getItem('user_tasks');
      return local ? JSON.parse(local) : [];
    }

    return data || [];
  },

  /**
   * Add a new task
   */
  async addTask(taskData) {
    const userId = await this.getUserId();
    const newTask = {
      id: `task_${Date.now()}`,
      ...taskData,
      completed: false,
      created_at: new Date().toISOString()
    };

    if (!userId) {
      const local = localStorage.getItem('user_tasks');
      const tasks = local ? JSON.parse(local) : [];
      tasks.unshift(newTask);
      localStorage.setItem('user_tasks', JSON.stringify(tasks));
      return newTask;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ ...newTask, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Toggle a task's completion status
   */
  async toggleTask(taskId, completed) {
    const userId = await this.getUserId();
    if (!userId) {
      const local = localStorage.getItem('user_tasks');
      const tasks = local ? JSON.parse(local) : [];
      const updatedTasks = tasks.map(t => t.id === taskId ? { ...t, completed } : t);
      localStorage.setItem('user_tasks', JSON.stringify(updatedTasks));
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  },

  /**
   * Delete a task
   */
  async deleteTask(taskId) {
    const userId = await this.getUserId();
    if (!userId) {
      const local = localStorage.getItem('user_tasks');
      const tasks = local ? JSON.parse(local) : [];
      const updatedTasks = tasks.filter(t => t.id !== taskId);
      localStorage.setItem('user_tasks', JSON.stringify(updatedTasks));
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', userId);

    if (error) throw error;
  }
};
