export default {
  namespace: 'preview',

  state: {
    loading: false
  },

  effects: {
    * updateLoadingStatus ({ loading }, { call, put }) {
      yield put({
        type: 'saveLoadingStatus',
        loading,
      })
    }
  },

  reducers: {
    saveLoadingStatus (state, { loading }) {
      return {
        ...state,
        loading
      }
    }
  }
}
