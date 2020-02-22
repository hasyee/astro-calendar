import Store from 'repatch';
export * from './hooks';

const store = new Store({
  date: Date.now(),
  location: [19, 47]
});

window.store = store;

export default store;
