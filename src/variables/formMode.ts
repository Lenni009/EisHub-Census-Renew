import { isNewPage, isUpdating } from '@/helpers/censusForm';

export const isUpdatingPage = isUpdating();
export const isMakingNewPage = isNewPage();

export const isNewCitizen = isUpdatingPage || isMakingNewPage;
