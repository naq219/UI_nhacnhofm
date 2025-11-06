import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ReminderList } from './components/ReminderList';
import { CreateReminderDialog } from './components/CreateReminderDialog';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Plus, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Snackbar } from './components/ui/snackbar';
import { remindersAPI } from './api/reminders';
import { Reminder } from './types';
import { toast } from 'sonner';

interface LocalReminder extends Reminder {
  isCompleted: boolean;
}

function HomePage() {
  const { user, logout } = useAuth();
  const [reminders, setReminders] = useState<LocalReminder[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      const data = await remindersAPI.getAll();
      const mappedReminders = data.items.map(r => ({
        ...r,
        isCompleted: r.status === 'completed',
      }));
      setReminders(mappedReminders);
    } catch (error: any) {
      toast.error('Không thể tải danh sách nhắc nhở');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReminder = async (reminderData: CreateReminderDTO) => {
    try {
      await remindersAPI.create(reminderData);
      toast.success('Tạo nhắc nhở thành công');
      // Load lại danh sách để đảm bảo hiển thị đúng dữ liệu mới nhất
      await loadReminders();
    } catch (error: any) {
      toast.error(error.message || 'Tạo nhắc nhở thất bại');
    }
  };

  const handleDeleteReminder = (id: string) => {
    setReminderToDelete(id);
    setSnackbarOpen(true);
  };

  const confirmDeleteReminder = async () => {
    if (!reminderToDelete) return;
    
    try {
      await remindersAPI.delete(reminderToDelete);
      setReminders(reminders.filter(r => r.id !== reminderToDelete));
      toast.success('Đã xóa nhắc nhở');
    } catch (error: any) {
      toast.error('Xóa thất bại');
    } finally {
      setSnackbarOpen(false);
      setReminderToDelete(null);
    }
  };

  const cancelDeleteReminder = () => {
    setSnackbarOpen(false);
    setReminderToDelete(null);
  };

  const handleCompleteReminder = async (id: string) => {
    try {
      await remindersAPI.complete(id);
      toast.success('Đã hoàn thành nhắc nhở');
      // Load lại danh sách để đảm bảo hiển thị đúng dữ liệu mới nhất
      await loadReminders();
    } catch (error: any) {
      toast.error('Cập nhật thất bại');
    }
  };

  const handleEditReminder = async (id: string, updatedData: Partial<Reminder>) => {
    try {
      await remindersAPI.update(id, updatedData);
      toast.success('Cập nhật nhắc nhở thành công');
      // Load lại danh sách để đảm bảo hiển thị đúng dữ liệu mới nhất
      await loadReminders();
    } catch (error: any) {
      toast.error(error.message || 'Cập nhật thất bại');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-2xl p-4 md:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Nhắc Nhở</h1>
            <p className="text-slate-600">Chào {user?.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
              Tạo mới
            </Button>
            <Button variant="outline" onClick={logout} className="gap-2">
              <LogOut className="h-5 w-5" />
              Đăng xuất
            </Button>
          </div>
        </div>

        <ReminderList
          reminders={reminders}
          onDelete={handleDeleteReminder}
          onEdit={handleEditReminder}
          onComplete={handleCompleteReminder}
        />
        
        <Snackbar
          open={snackbarOpen}
          message="Bạn có chắc muốn xoá nhắc nhở này?"
          onConfirm={confirmDeleteReminder}
          onCancel={cancelDeleteReminder}
        />

        <CreateReminderDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateReminder={handleCreateReminder}
        />
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return <>{children}</>;
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </AuthProvider>
    </BrowserRouter>
  );
}