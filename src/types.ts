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

export interface RecurrencePattern {
  type: 'interval_based' | 'daily' | 'weekly' | 'monthly' | 'lunar_last_day_of_month';
  frequency?: 'minute' | 'hour' | 'day' | 'week' | 'month';
  interval?: number;
  day_of_week?: number; // 0 (Chủ nhật) đến 6 (Thứ 7)
  day_of_month?: number; // 1-31
  base_on?: 'creation' | 'completion';
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
  recurrence_pattern?: RecurrencePattern;
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
  recurrence_pattern?: RecurrencePattern;
  status: 'active' | 'paused' | 'completed';
  retry_interval_sec?: number;
  max_retries?: number;
  snooze_until?: string;
}