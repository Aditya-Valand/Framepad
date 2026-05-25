import './designs.css';
import { ReactNode } from 'react';

export default function DesignsLayout({ children }: { children: ReactNode }) {
  return <div className="designs-page">{children}</div>;
}
