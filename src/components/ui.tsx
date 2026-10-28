import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './icons';

/* ------------------------------ Button ------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  icon?: string;
  iconRight?: string;
  loading?: boolean;
}

export function Button({
  variant = 'secondary',
  size = 'md',
  block,
  icon,
  iconRight,
  loading,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className="spinner" aria-hidden="true" /> : icon ? <Icon name={icon} size={16} /> : null}
      {children ? <span>{children}</span> : null}
      {iconRight ? <Icon name={iconRight} size={16} /> : null}
    </button>
  );
}

export function IconButton({
  icon,
  label,
  active,
  size = 18,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { icon: string; label: string; active?: boolean; size?: number }) {
  return (
    <button
      className="btn btn--ghost btn--icon"
      aria-label={label}
      title={label}
      aria-pressed={active}
      {...rest}
    >
      <Icon name={icon} size={size} />
    </button>
  );
}

/* ------------------------------ Card ------------------------------ */

export function Card({
  children,
  interactive,
  flat,
  className = '',
  onClick,
  as = 'div',
}: {
  children: ReactNode;
  interactive?: boolean;
  flat?: boolean;
  className?: string;
  onClick?: () => void;
  as?: 'div' | 'section' | 'article' | 'li';
}) {
  const Tag = as;
  const cls = ['card', interactive ? 'card--interactive' : '', flat ? 'card--flat' : '', className]
    .filter(Boolean)
    .join(' ');
  if (onClick) {
    return (
      <Tag
        className={cls}
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        }}
      >
        {children}
      </Tag>
    );
  }
  return <Tag className={cls}>{children}</Tag>;
}

/* ------------------------------ Chip ------------------------------ */

export function Chip({
  children,
  active,
  level,
  small,
  onClick,
  title,
}: {
  children: ReactNode;
  active?: boolean;
  level?: 1 | 2 | 3 | 4;
  small?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  const cls = [
    'chip',
    active ? 'chip--active' : '',
    level ? `chip--level-${level}` : '',
    small ? 'chip--sm' : '',
    onClick ? 'chip--clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');
  if (onClick) {
    return (
      <button className={cls} onClick={onClick} aria-pressed={!!active} title={title}>
        {children}
      </button>
    );
  }
  return (
    <span className={cls} title={title}>
      {children}
    </span>
  );
}

/* --------------------------- Segmented --------------------------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
}) {
  return (
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          className="segmented__item"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ Switch ------------------------------ */

export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className="switch"
      onClick={() => onChange(!checked)}
    >
      <span className="switch__track" />
      <span className="switch__thumb" />
    </button>
  );
}

/* ------------------------------ Progress ------------------------------ */

export function Progress({
  value,
  thin,
  tall,
  label,
}: {
  value: number;
  thin?: boolean;
  tall?: boolean;
  label?: string;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div
      className={`progress${thin ? ' progress--thin' : ''}${tall ? ' progress--tall' : ''}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? '进度'}
    >
      <div className="progress__bar" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ------------------------------ Badge ------------------------------ */

export function Badge({
  children,
  tone = 'accent',
}: {
  children: ReactNode;
  tone?: 'accent' | 'green' | 'orange' | 'red' | 'purple' | 'teal';
}) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/* ------------------------------ Empty ------------------------------ */

export function Empty({
  icon = 'sparkles',
  title,
  desc,
  action,
}: {
  icon?: string;
  title: string;
  desc?: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty">
      <div className="empty__icon">
        <Icon name={icon} size={22} />
      </div>
      <p className="empty__title">{title}</p>
      {desc ? <p className="empty__desc">{desc}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}

/* ------------------------------ Loading ------------------------------ */

export function Spinner({ label = '加载中' }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label} />;
}

export function Skeleton({ lines = 3, card }: { lines?: number; card?: boolean }) {
  if (card) return <div className="skeleton skeleton--card" />;
  return (
    <div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="skeleton skeleton--line" style={{ width: `${100 - i * 12}%` }} />
      ))}
    </div>
  );
}

/* ------------------------------ Dialog ------------------------------ */

export function Dialog({
  open,
  onClose,
  title,
  desc,
  children,
  footer,
  size = 'md',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  desc?: string;
  children?: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'wide';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && ref.current) {
        const focusables = ref.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div className="dialog-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div
        className={`dialog${size !== 'md' ? ` dialog--${size}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={ref}
      >
        <div className="dialog__head">
          <h2 className="dialog__title">{title}</h2>
          {desc ? <p className="dialog__desc">{desc}</p> : null}
        </div>
        {children ? <div className="dialog__body">{children}</div> : null}
        {footer ? <div className="dialog__foot">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------ Tabs ------------------------------ */

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.value}
          role="tab"
          className="tab"
          aria-selected={value === t.value}
          onClick={() => onChange(t.value)}
        >
          {t.label}
          {typeof t.count === 'number' ? <span className="tab__count">{t.count}</span> : null}
        </button>
      ))}
    </div>
  );
}

/* ------------------------------ Popover ------------------------------ */

export function Popover({
  anchor,
  onClose,
  children,
  width = 372,
  ariaLabel,
}: {
  anchor: DOMRect | null;
  onClose: () => void;
  children: ReactNode;
  width?: number;
  ariaLabel: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number; placement: 'top' | 'bottom' } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!anchor || !el) return;

    const place = () => {
      const h = el.offsetHeight;
      const w = Math.min(width, window.innerWidth - 16);
      const margin = 10;
      const spaceBelow = window.innerHeight - anchor.bottom;
      const spaceAbove = anchor.top;
      const placement: 'top' | 'bottom' =
        spaceBelow >= h + margin || spaceBelow >= spaceAbove ? 'bottom' : 'top';
      const rawTop = placement === 'bottom' ? anchor.bottom + margin : Math.max(8, anchor.top - h - margin);
      // 内容异步加载后高度会变化，这里每次重新收敛到视口内
      const top = Math.max(8, Math.min(rawTop, window.innerHeight - h - 8));
      const left = Math.min(Math.max(8, anchor.left + anchor.width / 2 - w / 2), window.innerWidth - w - 8);
      setPos({ top, left, placement });
    };

    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener('resize', place);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', place);
    };
  }, [anchor, width]);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    return () => previousFocus?.focus({ preventScroll: true });
  }, []);

  const positioned = pos !== null;
  useEffect(() => {
    if (positioned) ref.current?.focus({ preventScroll: true });
  }, [positioned]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [onClose]);

  const w = Math.min(width, typeof window !== 'undefined' ? window.innerWidth - 16 : width);

  return createPortal(
    <div
      ref={ref}
      className="popover"
      tabIndex={-1}
      role="dialog"
      aria-label={ariaLabel}
      style={{
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        width: w,
        maxHeight: 'min(72vh, 560px)',
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>,
    document.body,
  );
}

/* ------------------------------ Toast ------------------------------ */

export type ToastTone = 'default' | 'success' | 'error';
interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}
let items: ToastItem[] = [];
const subs = new Set<() => void>();
let seq = 0;

function notify(): void {
  subs.forEach((s) => s());
}

export function toast(message: string, tone: ToastTone = 'default'): void {
  const id = ++seq;
  items = [...items, { id, message, tone }];
  notify();
  setTimeout(() => {
    items = items.filter((t) => t.id !== id);
    notify();
  }, 2600);
}

function subscribeToast(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

export function Toaster() {
  const list = useSyncExternalStore(
    subscribeToast,
    () => items,
    () => items,
  );
  return (
    <div className="toast-stack" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className={`toast${t.tone !== 'default' ? ` toast--${t.tone}` : ''}`}>
          {t.tone === 'success' ? <Icon name="check" size={15} /> : null}
          {t.tone === 'error' ? <Icon name="info" size={15} /> : null}
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------ StatCard ------------------------------ */

export function StatCard({
  label,
  value,
  hint,
  tone,
  onClick,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: 'accent' | 'green' | 'orange' | 'purple';
  onClick?: () => void;
}) {
  const style = tone ? ({ '--stat-tone': `var(--${tone})` } as React.CSSProperties) : undefined;
  return (
    <div className={`stat-card${onClick ? ' stat-card--clickable' : ''}`} style={style} onClick={onClick}>
      <span className="stat-card__label">{label}</span>
      <span className="stat-card__value">{value}</span>
      {hint ? <span className="stat-card__hint">{hint}</span> : null}
    </div>
  );
}

/* ------------------------------ Misc hooks ------------------------------ */

export function useDebounced<T>(value: T, delay = 200): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function useConfirm(): {
  confirm: (opts: { title: string; desc?: string; confirmText?: string; danger?: boolean }) => Promise<boolean>;
  dialog: ReactNode;
} {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    desc?: string;
    confirmText?: string;
    danger?: boolean;
    resolve?: (v: boolean) => void;
  }>({ open: false, title: '' });

  const confirm = useCallback(
    (opts: { title: string; desc?: string; confirmText?: string; danger?: boolean }) =>
      new Promise<boolean>((resolve) => setState({ ...opts, open: true, resolve })),
    [],
  );

  const close = (v: boolean) => {
    state.resolve?.(v);
    setState((s) => ({ ...s, open: false }));
  };

  const dialog = (
    <Dialog
      open={state.open}
      onClose={() => close(false)}
      title={state.title}
      desc={state.desc}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={() => close(false)}>
            取消
          </Button>
          <Button variant={state.danger ? 'danger' : 'primary'} onClick={() => close(true)}>
            {state.confirmText ?? '确认'}
          </Button>
        </>
      }
    />
  );

  return { confirm, dialog };
}

const ThemeCtx = createContext<{ theme: string }>({ theme: 'light' });
export const ThemeProvider = ThemeCtx.Provider;
export const useThemeName = () => useContext(ThemeCtx).theme;
