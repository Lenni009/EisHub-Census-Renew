import type { Modes, Platforms } from '@/types/pageData';

export const platforms: Record<Platforms, string> = {
  PC: 'PC',
  PS: 'PlayStation',
  XB: 'Xbox',
  NS: 'Switch',
} as const;

export const modes: Record<string, Modes> = {
  Normal: 'Normal',
  Relaxed: 'Relaxed',
  Survival: 'Survival',
  Permadeath: 'Permadeath',
  Creative: 'Creative',
  Custom: 'Custom',
} as const;
