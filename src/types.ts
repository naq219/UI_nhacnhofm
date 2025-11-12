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
  // Theo tài liệu: hỗ trợ các kiểu sau
  type: 'daily' | 'weekly' | 'monthly' | 'lunar_last_day_of_month' | 'interval_seconds';
  // Khoảng lặp chung cho daily/weekly/monthly
  interval?: number;
  // Trường cho weekly
  day_of_week?: number; // 0 (Chủ nhật) đến 6 (Thứ 7)
  // Trường cho monthly
  day_of_month?: number; // 1-31
  // Trường cho interval_seconds
  interval_seconds?: number;
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
  // Giữ các trường cũ để tương thích UI hiện tại (không gửi khi tạo)
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
  // Theo tài liệu: client gửi next_action_at (hoặc for_test)
  next_action_at: string;
  recurrence_pattern?: RecurrencePattern;
  repeat_strategy?: 'none' | 'crp_until_complete';
  status: 'active' | 'paused' | 'completed';
  // Trường CRP
  crp_interval_sec?: number;
  max_crp?: number;
  // Không gửi trigger_time_of_day từ client
  // Hỗ trợ test nhanh
  for_test?: number;
  snooze_until?: string;
}