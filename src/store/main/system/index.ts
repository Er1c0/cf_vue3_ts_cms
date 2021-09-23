import { Module } from 'vuex'
import { IRootStateType } from '@/store/type'
import { ISystemType } from './type'

import { getPageListData, deletePageData } from '@/network/system'

const systemModule: Module<ISystemType, IRootStateType> = {
  namespaced: true,
  state() {
    return {
      totalQueryInfo: { offset: 0, size: 10 },
      usersCount: 0,
      usersList: [],
      roleList: [],
      roleCount: 0,
      departmentList: [],
      departmentCount: 0,
      menuList: [],
      menuCount: 0,
      goodsList: [],
      goodsCount: 0
    }
  },
  getters: {},
  mutations: {
    changeTotalQueryInfo(state, payload) {
      state.totalQueryInfo = { ...state.totalQueryInfo, ...payload }
    },
    changeUsersCount(state, payload) {
      state.usersCount = payload
    },
    changeUsersList(state, payload) {
      state.usersList = payload
    },
    changeRoleList(state, payload) {
      state.roleList = payload
    },
    changeRoleCount(state, payload) {
      state.roleCount = payload
    },
    changeDepartmentList(state, payload) {
      state.departmentList = payload
    },
    changeDepartmentCount(state, payload) {
      state.departmentCount = payload
    },
    changeMenuList(state, payload) {
      state.menuList = payload
    },
    changeMenuCount(state, payload) {
      state.menuCount = payload
    },
    changeGoodsList(state, payload) {
      state.goodsList = payload
    },
    changeGoodsCount(state, payload) {
      state.goodsCount = payload
    }
  },
  actions: {
    async getPageListAction({ commit }, payload) {
      const { pageName } = payload
      const pageUrl = `/${pageName}/list`
      const commitCountName = `change${pageName.slice(0, 1).toUpperCase() + pageName.slice(1)}Count`
      const commitListName = `change${pageName.slice(0, 1).toUpperCase() + pageName.slice(1)}List`

      const pageListResult = await getPageListData(pageUrl, payload.queryInfo)
      console.log(pageListResult)

      commit(commitCountName, pageListResult?.data.totalCount)
      commit(commitListName, pageListResult?.data.list)
    },
    async deletePageDataAction({ dispatch }, payload: any) {
      const { pageName, id } = payload
      const url = `/${pageName}/${id}`
      await deletePageData(url)
      dispatch('getPageListAction', { pageName })
    }
  }
}

export default systemModule
