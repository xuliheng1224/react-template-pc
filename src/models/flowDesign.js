export default {
  namespace: 'flowDesign',

  state: {
    step: 'base'
  },

  effects: {
    * updateStepStatus ({ step }, { call, put }) {
      yield put({
        type: 'saveStepStatus',
        step,
      })
    }
  },

  reducers: {
    saveStepStatus (state, { step }) {
      return {
        ...state,
        step
      }
    }
  }
}
