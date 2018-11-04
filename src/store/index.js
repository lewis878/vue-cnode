import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    user:{}
  },
  getters:{

  },
  mutations:{
    setUser(state,payload){
      state.user = payload
      // console.log(state.user)
    }
  },
  actions:{
    setUser({commit},payload){
      commit('setUser',payload)
    }
  }
})
