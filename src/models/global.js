const GlobalModel = {
  namespace: 'global',

  state: {
    collapsed: false,
  },

  effects: {
    *changeCollapsed ({ collapsed }, { put }) {
      console.log(collapsed)
      yield put({
        type: 'changeLayoutCollapsed',
        collapsed,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed (state, { collapsed }) {
      return { ...state, collapsed };
    },
  },

  subscriptions: {
    setup ({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
}

export default GlobalModel;
