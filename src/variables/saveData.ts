import type { Modes, Platforms } from '@/types/pageData';

export const platforms: Record<string, Platforms> = {
  PC: 'PC',
  PS: 'PlayStation',
  XB: 'Xbox',
  NS: 'Switch',
};

export const modes: Record<string, Modes> = {
  Normal: 'Normal',
  Relaxed: 'Relaxed',
  Survival: 'Survival',
  Permadeath: 'Permadeath',
  Creative: 'Creative',
  Custom: 'Custom',
};
