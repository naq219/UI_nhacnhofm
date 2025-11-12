import { apiClient } from './client';
import { Reminder, CreateReminderDTO } from '../types';

export const remindersAPI = {
  async getAll(): Promise<{ items: Reminder[] }> {
    const response = await apiClient.get('/api/reminders/mine');
    return { items: response.data };
  },

  async getById(id: string): Promise<Reminder> {
    return apiClient.get(`/api/reminders/${id}`);
  },

  async create(data: CreateReminderDTO): Promise<Reminder> {
    const res = await apiClient.post('/api/reminders', data);
    return res.data;
  },

  async update(id: string, data: Partial<CreateReminderDTO>): Promise<Reminder> {
    return apiClient.put(`/api/reminders/${id}`, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return apiClient.delete(`/api/reminders/${id}`);
  },

  async snooze(id: string, duration: number): Promise<{ success: boolean }> {
    return apiClient.post(`/api/reminders/${id}/snooze`, { duration });
  },

  async complete(id: string): Promise<{ success: boolean }> {
    return apiClient.post(`/api/reminders/${id}/complete`, {});
  },
};