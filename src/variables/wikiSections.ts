import type { SectionObject } from '@/types/pageData';

export const defaultSections: SectionObject[] = [
  {
    heading: 'Layout',
    body: '',
    explanation: 'What does the base look like?',
    required: true,
  },
  {
    heading: 'Features',
    body: '',
    explanation: 'List the basic features, such as crops, biodomes, landing pads, exocraft bays, etc.',
  },
  {
    heading: 'Additional Information',
    body: '',
    explanation: 'Any nearby resources, tourist traps, other bases',
  },
];

export const requiredSections = defaultSections.map((item) => item.heading);
