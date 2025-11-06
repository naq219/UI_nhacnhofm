export interface User {
  id: string;
  email: string;
  created: string;
  updated: string;
}

export interface AuthResponse {
  token: string;
  record: User;
}

export interface Reminder {
  id: string;
  user: string;
  title: string;
  description?: string;
  type: 'one_time' | 'recurring';
  calendar_type: 'solar' | 'lunar';
  next_trigger_at: string;
  trigger_time_of_day?: string;
  recurrence_pattern?: Record<string, any>;
  status: 'active' | 'paused' | 'completed';
  retry_interval_sec?: number;
  max_retries?: number;
  snooze_until?: string;
  created: string;
  updated: string;
}

export interface CreateReminderDTO {
  title: string;
  description?: string;
  type: 'one_time' | 'recurring';
  calendar_type: 'solar' | 'lunar';
  next_trigger_at: string;
  trigger_time_of_day?: string;
  status: 'active' | 'paused' | 'completed';
}