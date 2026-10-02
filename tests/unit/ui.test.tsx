// file: tests/unit/ui.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

describe('cn', () => {
  it('birləşdirir və Tailwind konfliktlərini həll edir', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('a', false && 'b', 'c')).toBe('a c');
  });
});

describe('Button', () => {
  it('rounded-xl və gradient default variantı ilə render olunur', () => {
    render(<Button>Run</Button>);
    const btn = screen.getByRole('button', { name: 'Run' });
    expect(btn).toHaveClass('rounded-xl', 'bg-brand-gradient');
  });
});

describe('Badge', () => {
  it('success variantı tətbiq olunur', () => {
    render(<Badge variant="success">OK</Badge>);
    expect(screen.getByText('OK')).toHaveClass('text-success');
  });
});
