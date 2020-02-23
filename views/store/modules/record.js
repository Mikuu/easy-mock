export default {
  namespaced: true,
  mutations: {
    ADD_RECORDER (state, payload) {
      state.recorders.push(payload.recorder)
    },
    REMOVE_RECORDER (state, payload) {
      let index
      for (index = 0; index < state.recorders.length; index++) {
        if (state.recorders[index].serverId === payload.recorder.serverId) {
          state.recorders.splice(index, 1)
        }
      }
    }
  },
  actions: {}
}
