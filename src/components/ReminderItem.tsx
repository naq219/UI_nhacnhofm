import { useState, useRef, useEffect } from 'react';
import { Reminder } from '../types';
import { Check, Clock, Repeat, Star, Trash2, Edit3, Moon } from 'lucide-react';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Button } from './ui/button';
import { EditReminderDialog } from './EditReminderDialog';
import { motion, useMotionValue, useTransform } from 'motion/react';

interface ReminderItemProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, reminder: Partial<Reminder>) => void;
}

export function ReminderItem({
  reminder,
  onToggleComplete,
  onDelete,
  onEdit,
}: ReminderItemProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0], [1, 0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    const timeStr = date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const dateStr = date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    if (days === 0 && diff > 0) {
      return `Hôm nay ${timeStr}`;
    } else if (days === 1) {
      return `Ngày mai ${timeStr}`;
    } else if (days > 1 && days < 7) {
      return `${days} ngày nữa - ${timeStr}`;
    } else {
      return `${dateStr} ${timeStr}`;
    }
  };

  const handleDragEnd = () => {
    const currentX = x.get();
    // Chỉ reset về vị trí ban đầu, không tự động xóa
    x.set(0);
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Action Buttons Background */}
      <motion.div
        className="absolute right-0 top-0 flex h-full items-center gap-2 pr-4"
        style={{ opacity }}
      >
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
          onClick={() => setIsEditDialogOpen(true)}
        >
          <Edit3 className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 text-red-600 hover:bg-red-100 hover:text-red-700"
          onClick={() => onDelete(reminder.id)}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </motion.div>

      {/* Swipeable Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className={`relative rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md ${
          reminder.isCompleted ? 'opacity-60' : ''
        }`}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="pt-0.5">
            <Checkbox
              checked={reminder.status === 'completed'}
              onCheckedChange={() => onToggleComplete(reminder.id)}
              className="h-5 w-5"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p
              className={`${
                reminder.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'
              }`}
            >
              {reminder.title}
            </p>
            {reminder.status !== 'completed' && (
              <Star className="h-4 w-4 flex-shrink-0 fill-amber-400 text-amber-400" />
            )}
            </div>

            {/* Time and Type */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5 text-xs">
                <Clock className="h-3 w-3" />
                {formatTime(reminder.next_trigger_at)}
              </Badge>

              {reminder.calendar_type === 'lunar' && (
                <Badge variant="outline" className="gap-1.5 border-indigo-200 bg-indigo-50 text-xs text-indigo-700">
                  <Moon className="h-3 w-3" />
                  Âm lịch
                </Badge>
              )}

              {reminder.type === 'recurring' && (
                <Badge variant="secondary" className="gap-1.5 text-xs">
                  <Repeat className="h-3 w-3" />
                  Lặp lại
                </Badge>
              )}

              {reminder.status === 'completed' && (
                <Badge variant="default" className="gap-1.5 bg-green-600 text-xs">
                  <Check className="h-3 w-3" />
                  Hoàn thành
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Edit Dialog */}
      <EditReminderDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        reminder={reminder}
        onEditReminder={(updated) => {
          onEdit(reminder.id, updated);
          setIsEditDialogOpen(false);
        }}
      />
    </div>
  );
}