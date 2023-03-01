import { Module } from 'vuex';
import { RootState } from '../../index.interface';
import { templateState } from './Template.interface';

const templateStore: Module<templateState, RootState> = {
  namespaced: true,
  state: () => ({
    URL: process.env.NODE_ENV === 'development' ? process.env.VUE_APP_DEVHOST : process.env.VUE_APP_PRODHOST,
  }),
  getters: {},
  mutations: {},
  actions: {},
};

export default templateStore;
