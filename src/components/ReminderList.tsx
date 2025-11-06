import { useState } from 'react';
import { Reminder } from '../types';
import { ReminderItem } from './ReminderItem';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, CalendarDays, Infinity } from 'lucide-react';

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, reminder: Partial<Reminder>) => void;
}

type FilterType = '7days' | '1month' | 'all';

export function ReminderList({
  reminders,
  onToggleComplete,
  onDelete,
  onEdit,
}: ReminderListProps) {
  const [filter, setFilter] = useState<FilterType>('7days');

  const getFilteredReminders = () => {
    const now = new Date();
    const incomplete = reminders.filter((r) => r.status !== 'completed');

    if (filter === '7days') {
      const sevenDaysLater = new Date(now);
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
      return incomplete.filter((r) => new Date(r.next_trigger_at) <= sevenDaysLater);
    } else if (filter === '1month') {
      const oneMonthLater = new Date(now);
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);
      return incomplete.filter((r) => new Date(r.next_trigger_at) <= oneMonthLater);
    } else {
      return incomplete;
    }
  };

  const filteredReminders = getFilteredReminders();
  const sortedReminders = [...filteredReminders].sort(
    (a, b) => new Date(a.next_trigger_at).getTime() - new Date(b.next_trigger_at).getTime()
  );

  const completedReminders = reminders.filter((r) => r.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
        <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
          <TabsTrigger value="7days" className="gap-2">
            <Calendar className="h-4 w-4" />
            7 ngày
          </TabsTrigger>
          <TabsTrigger value="1month" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            1 tháng
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Infinity className="h-4 w-4" />
            Tất cả
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Upcoming Reminders */}
      <div className="space-y-3">
        <h2 className="text-slate-700">Sắp tới ({sortedReminders.length})</h2>
        {sortedReminders.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">Không có lời nhắc nào</p>
          </div>
        ) : (
          <div className="space-y-2">
            {sortedReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        )}
      </div>

      {/* Completed Reminders */}
      {completedReminders.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-slate-700">Đã hoàn thành ({completedReminders.length})</h2>
          <div className="space-y-2">
            {completedReminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggleComplete={onToggleComplete}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
