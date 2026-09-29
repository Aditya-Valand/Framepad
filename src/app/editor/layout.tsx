import './editor.css';
import { ToastProvider } from '@/contexts/ToastContext';

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}
