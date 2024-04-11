import { type Ref } from 'vue';

export function deselect(e: Event, model: Ref<string | number | undefined>) {
  const { target } = e;
  if (!(target instanceof HTMLInputElement)) return;
  const value = typeof model.value === 'number' ? parseInt(target.value) : target.value;
  if (model.value === value) model.value = undefined; // NoSonar deselect everything if the currently selected item is clicked
}
