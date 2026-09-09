/* ============================================================
 * 総合演習 (3/3): UI
 * ============================================================ */
import { useReducer, useState } from 'react';
import { initialState, taskReducer, type Priority } from './domain';

export function TaskBoard() {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  void state;
  void dispatch;
  void title;
  void setTitle;
  void priority;
  void setPriority;
  // TODO: README の仕様どおりに実装する
  // TODO: JSX を返す
  return null;
}
