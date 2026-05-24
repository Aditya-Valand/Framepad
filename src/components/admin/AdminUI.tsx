'use client';

import { ReactNode } from 'react';

/* ─── Badge ─── */
type BadgeVariant = 'good' | 'warn' | 'bad' | 'info' | 'muted' | 'brown';

export function Badge({ variant, children }: { variant: BadgeVariant; children: ReactNode }) {
  return <span className={`badge ${variant}`}>{children}</span>;
}

/* ─── Stat Card ─── */
export function StatCard({
  label,
  value,
  delta,
  deltaType = 'up',
  alert = false,
  spark,
}: {
  label: string;
  value: string;
  delta: string;
  deltaType?: 'up' | 'down' | 'flat';
  alert?: boolean;
  spark?: ReactNode;
}) {
  return (
    <div className={`stat${alert ? ' alert' : ''}`}>
      <div className="label">
        {alert && <span className="dot" />}
        {label}
      </div>
      <div className="value">{value}</div>
      <div className={`delta${alert ? '' : ` ${deltaType}`}`}>{delta}</div>
      {spark}
    </div>
  );
}

/* ─── Card ─── */
export function Card({
  children,
  className = '',
  style = {},
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`card${className ? ' ' + className : ''}`} style={style}>
      {children}
    </div>
  );
}

/* ─── Card Header ─── */
export function CardHeader({
  title,
  action,
  actionHref,
}: {
  title: string;
  action?: string;
  actionHref?: string;
}) {
  return (
    <div className="card-h">
      <span>{title}</span>
      {action && (
        <span className="more">
          {actionHref ? <a href={actionHref} className="more">{action}</a> : action}
        </span>
      )}
    </div>
  );
}

/* ─── Page Header ─── */
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        <p className="sub">{subtitle}</p>
      </div>
      {children && <div className="head-actions">{children}</div>}
    </div>
  );
}

/* ─── Button ─── */
type BtnVariant = 'primary' | 'outline' | 'ghost' | 'danger';

export function Btn({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}: {
  variant?: BtnVariant;
  size?: 'sm' | 'md';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}) {
  const cls = [`btn`, variant, size === 'sm' ? 'sm' : '', className].filter(Boolean).join(' ');
  return (
    <button type={type} onClick={onClick} className={cls} disabled={disabled} style={disabled ? { opacity: 0.6, pointerEvents: 'none' } : undefined}>
      {children}
    </button>
  );
}

/* ─── Pill Row ─── */
export function PillRow({
  items,
  active,
  onSelect,
}: {
  items: { label: string; count?: number }[];
  active: number;
  onSelect: (i: number) => void;
}) {
  return (
    <div className="pill-row">
      {items.map((item, i) => (
        <button
          key={item.label}
          onClick={() => onSelect(i)}
          className={`pill${i === active ? ' active' : ''}`}
        >
          {item.label}
          {item.count !== undefined && <span className="count">{item.count}</span>}
        </button>
      ))}
    </div>
  );
}

/* ─── Slide Panel ─── */
export function SlidePanel({
  open,
  onClose,
  title,
  meta,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  meta?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <>
      <div className={`panel-backdrop${open ? ' open' : ''}`} onClick={onClose} />
      <aside className={`panel${open ? ' open' : ''}`} role="dialog">
        <div className="panel-head">
          <div>
            <div className="ttl">{title}</div>
            {meta && <div className="meta">{meta}</div>}
          </div>
          <button className="panel-close" onClick={onClose}>×</button>
        </div>
        <div className="panel-body">{children}</div>
        {footer && <div className="panel-foot">{footer}</div>}
      </aside>
    </>
  );
}

/* ─── Toggle ─── */
export function Toggle({
  on,
  onChange,
  danger = false,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  danger?: boolean;
}) {
  return (
    <div
      className={`toggle${on ? ' on' : ''}${danger ? ' danger' : ''}`}
      onClick={() => onChange(!on)}
    />
  );
}

/* ─── Sparkline ─── */
export function Sparkline({ points }: { points: string }) {
  return (
    <svg className="spark" viewBox="0 0 80 30" preserveAspectRatio="none">
      <polyline fill="none" stroke="#8B6347" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" points={points} />
      <polyline fill="rgba(139,99,71,.08)" stroke="none" points={`${points} 80,30 0,30`} />
    </svg>
  );
}
