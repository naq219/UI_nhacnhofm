import { SetStateAction, useState } from 'react';
import { Reminder, CreateReminderDTO } from '../types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Calendar as CalendarIcon, Star, Clock, Repeat, Sun, Moon, AlertCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface CreateReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReminder: (reminderData: CreateReminderDTO) => void;
}

export function CreateReminderDialog({
  open,
  onOpenChange,
  onCreateReminder,
}: CreateReminderDialogProps) {
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState('12:00');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [isRecurring, setIsRecurring] = useState(false);
  const [repeatType, setRepeatType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom'>('daily');
  const [customRepeat, setCustomRepeat] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [enableRetry, setEnableRetry] = useState(false);
  const [retryIntervalSec, setRetryIntervalSec] = useState(300);
  const [maxRetries, setMaxRetries] = useState(3);
  const [retryType, setRetryType] = useState<'daily' | 'weekly' | 'monthly' | 'custom'>('daily');
  const [customRetry, setCustomRetry] = useState('');

  const handleQuickTime = (minutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    setDate(now);
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    setTime(`${hours}:${mins}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      toast.error('Vui lòng nhập nội dung nhắc nhở');
      return;
    }

    const [hours, minutes] = time.split(':').map(Number);
    const startTime = new Date(date);
    startTime.setHours(hours, minutes, 0, 0);

    let repeatInterval = '';
    let repeatUnit: 'daily' | 'weekly' | 'monthly' | 'yearly' | undefined;
    let repeatValue: number | undefined;

    if (isRecurring) {
      if (repeatType === 'daily') {
        repeatInterval = 'Mỗi ngày';
        repeatUnit = 'day';
        repeatValue = 1;
      } else if (repeatType === 'weekly') {
        repeatInterval = 'Mỗi tuần';
        repeatUnit = 'week';
        repeatValue = 1;
      } else if (repeatType === 'monthly') {
        repeatInterval = 'Mỗi tháng';
        repeatUnit = 'month';
        repeatValue = 1;
      } else if (repeatType === 'yearly') {
        repeatInterval = 'Mỗi năm';
        repeatUnit = 'year';
        repeatValue = 1;
      } else if (repeatType === 'custom' && customRepeat) {
        const match = customRepeat.match(/^(\d+)([pgnth])$/i);
        if (match) {
          repeatValue = parseInt(match[1]);
          const unit = match[2].toLowerCase();
          if (unit === 'p') {
            repeatUnit = 'minute';
            repeatInterval = `${repeatValue} phút`;
          } else if (unit === 'g') {
            repeatUnit = 'hour';
            repeatInterval = `${repeatValue} giờ`;
          } else if (unit === 'n') {
            repeatUnit = 'day';
            repeatInterval = `${repeatValue} ngày`;
          } else if (unit === 't') {
            repeatUnit = 'week';
            repeatInterval = `${repeatValue} tuần`;
          } else if (unit === 'h') {
            repeatUnit = 'month';
            repeatInterval = `${repeatValue} tháng`;
          }
        } else {
          toast.error('Định dạng không hợp lệ. Ví dụ: 1p, 2g, 3n, 1t, 6h');
          return;
        }
      }
    }

    onCreateReminder({
      title: content,
      description: '',
      type: isRecurring ? 'recurring' : 'one_time',
      calendar_type: calendarType,
      next_trigger_at: startTime.toISOString(),
      recurrence_pattern: isRecurring ? {
        frequency: repeatUnit,
        interval: repeatValue
      } : undefined,
      status: 'active',
      retry_interval_sec: enableRetry ? retryIntervalSec : undefined,
      max_retries: enableRetry ? maxRetries : undefined,
    });
    toast.success('Đã tạo nhắc nhở mới');
    handleReset();
    onOpenChange(false);
  };

  const handleReset = () => {
    setContent('');
    setDate(new Date());
    setTime('12:00');
    setCalendarType('solar');
    setIsRecurring(false);
    setRepeatType('daily');
    setCustomRepeat('');
    setIsImportant(false);
    setEnableRetry(false);
    setRetryIntervalSec(300);
    setMaxRetries(3);
    setRetryType('daily');
    setCustomRetry('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Tạo nhắc nhở mới</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Content */}
          <div className="space-y-2">
            <Label htmlFor="content">Nội dung *</Label>
            <Input
              id="content"
              placeholder="Nhập nội dung nhắc nhở..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          {/* Quick Time Selection */}
          <div className="space-y-2">
            <Label className="text-sm">Thời gian nhanh</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickTime(5)}
                className="text-xs flex-1"
              >
                5 phút
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickTime(15)}
                className="text-xs flex-1"
              >
                15 phút
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickTime(30)}
                className="text-xs flex-1"
              >
                30 phút
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickTime(60)}
                className="text-xs flex-1"
              >
                1 giờ
              </Button>
            </div>
          </div>

          {/* Date and Time */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Thời gian bắt đầu</span>
              </div>
              <RadioGroup value={calendarType} onValueChange={(v: any) => setCalendarType(v)} className="flex gap-2">
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="solar" id="solar" className="h-3.5 w-3.5" />
                  <Label htmlFor="solar" className="flex cursor-pointer items-center gap-1 text-xs">
                    <Sun  className="h-4 w-4  text-red-500" />
                    Dương lịch
                  </Label>
                </div>
                <div className="flex items-center space-x-1.5">
                  <RadioGroupItem value="lunar" id="lunar" className="h-3.5 w-3.5" />
                  <Label htmlFor="lunar" className="flex cursor-pointer items-center gap-1 text-xs">
                    <Moon className="h-4 w-4 text-indigo-500" />
                    Âm lịch
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start gap-2 bg-white"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {date.toLocaleDateString('vi-VN')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(d: SetStateAction<Date>) => d && setDate(d)}
                  />
                </PopoverContent>
              </Popover>

              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {/* Recurring Options */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <Repeat className="h-4 w-4" />
                <span className="text-sm">Lặp lại</span>
              </div>
              <Checkbox
                checked={isRecurring}
                onCheckedChange={(checked: boolean) => setIsRecurring(checked as boolean)}
              />
            </div>

            {isRecurring && (
              <div className="space-y-3 pt-2">
                <RadioGroup value={repeatType} onValueChange={(v: any) => setRepeatType(v)}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="daily" />
                      <Label htmlFor="daily" className="cursor-pointer">
                        Mỗi ngày
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="weekly" />
                      <Label htmlFor="weekly" className="cursor-pointer">
                        Mỗi tuần
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2" style={{marginTop: '4px'}}>
                      <RadioGroupItem value="monthly" id="monthly" />
                      <Label htmlFor="monthly" className="cursor-pointer">
                        Mỗi tháng
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yearly" id="yearly" />
                      <Label htmlFor="yearly" className="cursor-pointer">
                        Mỗi năm
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="cursor-pointer">
                      Tùy chọn
                    </Label>
                  </div>
                </RadioGroup>

                {repeatType === 'custom' && (
                  <div className="space-y-2 pl-6">
                    <Input
                      placeholder="Ví dụ: 1p, 2g, 3n, 1t, 6h"
                      value={customRepeat}
                      onChange={(e) => setCustomRepeat(e.target.value)}
                      className="bg-white"
                    />
                    <p className="text-xs text-slate-500">
                      p: phút, g: giờ, n: ngày, t: tuần, h: tháng
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Important */}
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-slate-700">
              <Star className={isImportant ? 'fill-amber-400 text-amber-400' : ''} />
              <span className="text-sm">Quan trọng</span>
            </div>
            <Checkbox
              checked={isImportant}
              onCheckedChange={(checked: boolean) => setIsImportant(checked as boolean)}
            />
          </div>

          {/* Advanced - Retry */}
          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-700">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">Nhắc lại nếu chưa hoàn thành</span>
              </div>
              <Checkbox
                checked={enableRetry}
                onCheckedChange={(checked: boolean) => setEnableRetry(checked as boolean)}
              />
            </div>

            {enableRetry && (
              <div className="space-y-3 pt-2">
                <RadioGroup value={retryType} onValueChange={(v: any) => setRetryType(v)}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="daily" id="retry-daily" />
                      <Label htmlFor="retry-daily" className="cursor-pointer text-xs">
                        Mỗi ngày
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="weekly" id="retry-weekly" />
                      <Label htmlFor="retry-weekly" className="cursor-pointer text-xs">
                        Mỗi tuần
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="monthly" id="retry-monthly" />
                      <Label htmlFor="retry-monthly" className="cursor-pointer text-xs">
                        Mỗi tháng
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="custom" id="retry-custom" />
                      <Label htmlFor="retry-custom" className="cursor-pointer text-xs">
                        Tùy chọn
                      </Label>
                    </div>
                  </div>
                </RadioGroup>

                {retryType === 'custom' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="Ví dụ: 300 (giây)"
                      value={customRetry}
                      onChange={(e) => {
                        setCustomRetry(e.target.value);
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) setRetryIntervalSec(val);
                      }}
                      className="bg-white"
                    />
                  </div>
                )}

                {retryType !== 'custom' && (
                  <div className="space-y-2">
                    <Label htmlFor="maxRetries" className="text-xs text-slate-600">
                      Số lần tối đa
                    </Label>
                    <Input
                      id="maxRetries"
                      type="number"
                      min="1"
                      value={maxRetries}
                      onChange={(e) => setMaxRetries(parseInt(e.target.value) || 3)}
                      className="bg-white"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
              Tạo nhắc nhở
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}