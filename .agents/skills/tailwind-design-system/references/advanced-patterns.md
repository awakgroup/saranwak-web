# Tailwind v4 Advanced Patterns & Reference

This guide covers advanced patterns for Tailwind CSS v4 design systems, native CSS transitions, dark mode providers, and migration best practices.

---

## Pattern 5: Native CSS Animations & Dialogs

Tailwind v4 leverages native CSS `@starting-style` and `transition-behavior: allow-discrete` to animate popovers and dialogs into and out of the top layer without JavaScript animation libraries.

```css
/* Dialog and Popover Entry/Exit in Tailwind v4 */
@theme {
  @keyframes scale-in {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes scale-out {
    from {
      opacity: 1;
      transform: scale(1);
    }
    to {
      opacity: 0;
      transform: scale(0.95);
    }
  }

  --animate-scale-in: scale-in 0.15s ease-out;
  --animate-scale-out: scale-out 0.1s ease-in;
}

/* Native Popover / Dialog transition with @starting-style */
[popover]:popover-open {
  opacity: 1;
  transform: scale(1);

  @starting-style {
    opacity: 0;
    transform: scale(0.95);
  }
}

[popover] {
  transition: opacity 0.2s ease, transform 0.2s ease, overlay 0.2s allow-discrete, display 0.2s allow-discrete;
}
```

### Radix UI Dialog Implementation

```typescript
// components/ui/dialog.tsx
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

export function DialogOverlay({
  className,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Overlay>>;
}) {
  return (
    <DialogPrimitive.Overlay
      ref={ref}
      className={cn(
        'fixed inset-0 z-50 bg-black/60 backdrop-blur-xs',
        'data-[state=open]:animate-fade-in data-[state=closed]:animate-fade-out',
        className
      )}
      {...props}
    />
  );
}

export function DialogContent({
  className,
  children,
  ref,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
  ref?: React.Ref<React.ElementRef<typeof DialogPrimitive.Content>>;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg',
          'data-[state=open]:animate-scale-in data-[state=closed]:animate-scale-out',
          className
        )}
        {...props}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
```

---

## Pattern 6: Complete Dark Mode Provider & Toggle

Class-based dark mode configured in Tailwind v4 via `@custom-variant dark (&:where(.dark, .dark *));`:

```typescript
// components/theme-provider.tsx
'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'system',
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme-mode',
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme);
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeProviderContext);
```

### ThemeToggle Button

```typescript
// components/theme-toggle.tsx
'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-background p-2 text-foreground transition-colors hover:bg-accent"
      aria-label="Toggle theme"
    >
      <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
}
```

---

## Custom `@utility` Directives

Tailwind v4 replaces plugin utility registration with native CSS `@utility`:

```css
/* Reusable custom utilities */
@utility text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

@utility divider-line {
  display: flex;
  align-items: center;
  &::before, &::after {
    content: "";
    flex: 1;
    border-bottom: 1px solid var(--color-border);
  }
}
```

---

## Theme Modifiers & Overrides

### 1. Clearing Default Scales (Namespace Overrides)
To restrict your project only to your defined palette:
```css
@theme {
  --color-*: initial; /* Removes all default Tailwind colors */
  --color-background: #F4F1EA;
  --color-foreground: #201813;
}
```

### 2. Alpha Variants with `color-mix()`
```css
@theme {
  --color-primary-alpha-20: color-mix(in srgb, var(--color-primary) 20%, transparent);
}
```

### 3. Container Queries
```css
@theme {
  --container-card-sm: 24rem;
  --container-card-md: 32rem;
}
```

---

## Tailwind v3 to v4 Migration Checklist

1. [ ] Replace `tailwind.config.ts` or `tailwind.config.js` with `@theme` block in CSS.
2. [ ] Replace `@tailwind base; @tailwind components; @tailwind utilities;` with `@import "tailwindcss";`.
3. [ ] Configure dark mode using `@custom-variant dark (&:where(.dark, .dark *));`.
4. [ ] Convert color extensions to `--color-*` variables in `@theme`.
5. [ ] Convert animation keyframes into `@theme` and reference with `--animate-*`.
6. [ ] Replace `@apply` in non-CSS files with utility classes.
7. [ ] In React 19 components, remove `forwardRef` and use `ref` directly as a prop.
8. [ ] Replace `tailwindcss-animate` with native keyframes or `@starting-style`.
9. [ ] Check PostCSS setup: ensure `@tailwindcss/postcss` is installed and used in `postcss.config.mjs`.
10. [ ] Run build test: verify generated CSS size and check for unresolved token variables.

---

## Best Practices (Do's and Don'ts)

### Do:
- **Use semantic color tokens** (`--color-background`, `--color-foreground`, `--color-border`) rather than raw hex codes in component templates.
- **Leverage OKLCH or semantic CSS variables** for consistent contrast and perceived brightness.
- **Use `@custom-variant`** for fine-grained media queries and theme toggles.
- **Use `ref` as a normal prop** in React 19.

### Don't:
- **Don't create a `tailwind.config.js`** in a v4 project. Configure your theme inside CSS via `@theme`.
- **Don't hardcode repetitive styles**; use CVA (Class Variance Authority) for variant states.
- **Don't rely on `require()` plugins**; v4 uses modern CSS syntax like `@utility` and `@variant`.
