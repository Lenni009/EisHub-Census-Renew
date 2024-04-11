import { defineStore } from 'pinia';

interface RouteData {
  route: string | undefined;
}

const route = window.location.pathname.split('/')?.at(-1)?.slice(0, -5); // NoSonar getting the current filename without the "html" ending

export const useRouteDataStore = defineStore('routeData', {
  state: (): RouteData => ({
    route,
  }),

  getters: {
    isFormRoute: (state) => state.route === 'form',
  },
});
