import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  tone?: 'sun' | 'sea' | 'leaf' | 'plain';
  size?: 'xl' | 'lg' | 'md';
}

/** Stor knap. Alle størrelser er mindst 2 × 2 cm (se styles.css). */
export function BigButton({ children, tone = 'sun', size = 'lg', className = '', ...rest }: Props) {
  return (
    <button type="button" className={`big-btn big-btn--${tone} big-btn--${size} ${className}`} {...rest}>
      {children}
    </button>
  );
}
