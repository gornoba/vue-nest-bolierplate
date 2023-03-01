import { InjectionKey } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex';
import templateStore from '@/store/module/TemplateStore/Template.store';
import { RootState } from './index.interface';

// eslint-disable-next-line symbol-description
export const key: InjectionKey<Store<RootState>> = Symbol();

export const store = createStore({
  strict: process.env.NODE_ENV === 'development',
  modules: {
    templateStore,
  },
});

export function useStore() {
  return baseUseStore(key);
}
