import { create } from 'zustand';

type RoutesStore = {
  routes: {
    page: string,
    layouts: string[]
  }[],
  currentPage: number,
  addRoute: (page:string) => void,
  removeRoute: (index:number) => void,
  changeRoute: (index:number, layouts:string[]) => void,
  addLayout: (layout:string) => void,
  removeLayout: (index: number) => void,
  swapLayout: (source:number, dest: number) => void
}

export const useRoutesStore = create<RoutesStore>((set) => ({
  routes: [],
  currentPage: 0,
  addRoute: page => set(state => ({
    routes: [...state.routes, {page, layouts: []}]
  })),
  removeRoute: index => set(state => ({
    routes: state.routes.filter((r, i) => i !== index)
  })),
  changeRoute: (index, layouts) => set(state => {
    const routes = [...state.routes]
    routes.splice(index, 1, {...routes[index], layouts})
    return {
      routes
    }
  }),
  addLayout: layout => set(state => {
    const routes = [...state.routes];
    routes[state.currentPage].layouts.push(layout)
    return {routes}
  }),
  removeLayout: index => set(state => {
    const routes = [...state.routes];
    routes[state.currentPage].layouts.splice(index, 1)
    return {routes}
  }),
  swapLayout: (source, dest) => set(state => {
    const routes = [...state.routes];
    const temp = routes[state.currentPage].layouts[source];
    routes[state.currentPage].layouts[source] = routes[state.currentPage].layouts[dest];
    routes[state.currentPage].layouts[dest] = temp;

    return {routes}
  }),
}))