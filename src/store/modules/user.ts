import { defineStore } from 'pinia'
import { store } from '../index'
import { useCache } from '@/hooks/web/useCache'
import { useLocaleStoreWithOut } from './locale'
import { getStoragePrefix } from '@/utils/utils'
const { wsCache } = useCache()

interface UserState {
  token: string
  uid: string
  name: string
  oid: string
  language: string
  exp: number
  time: number
}

export const userStore = defineStore('user', {
  state: (): UserState => {
    return {
      token: null,
      uid: null,
      name: null,
      oid: null,
      language: 'zh-CN',
      exp: null,
      time: null
    }
  },
  getters: {
    getToken(): string {
      return this.token
    },
    getUid(): string {
      return this.uid
    },
    getName(): string {
      return this.name
    },
    getOid(): string {
      return this.oid
    },
    getLanguage(): string {
      return this.language
    },
    getExp(): number {
      return this.exp
    },
    getTime(): number {
      return this.time
    }
  },
  actions: {
    async setUser() {
      const user = await import('@/api/user')
      const res = await user.userInfo()
      const data = res?.data
      data.token = wsCache.get(getStoragePrefix('user.token'))
      data.exp = wsCache.get(getStoragePrefix('user.exp'))
      data.time = wsCache.get(getStoragePrefix('user.time'))
      const keys: string[] = ['token', 'uid', 'name', 'oid', 'language', 'exp', 'time']

      keys.forEach(key => {
        const dkey = key === 'uid' ? 'id' : key
        this[key] = data[dkey]
        wsCache.set(getStoragePrefix('user.' + key), this[key])
      })
      const locale = useLocaleStoreWithOut()
      if (locale.getCurrentLocale?.lang !== this.language) {
        // window.location.reload()
      }
      this.setLanguage(this.language)
    },
    setToken(token: string) {
      wsCache.set(getStoragePrefix('user.token'), token)
      this.token = token
    },
    setExp(exp: number) {
      wsCache.set(getStoragePrefix('user.exp'), exp)
      this.exp = exp
    },
    setTime(time: number) {
      wsCache.set(getStoragePrefix('user.time'), time)
      this.time = time
    },
    setUid(uid: string) {
      wsCache.set(getStoragePrefix('user.uid'), uid)
      this.uid = uid
    },
    setName(name: string) {
      wsCache.set(getStoragePrefix('user.name'), name)
      this.name = name
    },
    setOid(oid: string) {
      wsCache.set(getStoragePrefix('user.oid'), oid)
      this.oid = oid
    },
    setLanguage(language: string) {
      const locale = useLocaleStoreWithOut()
      if (!language || language === 'zh_CN') {
        language = 'zh-CN'
      }
      wsCache.set(getStoragePrefix('user.language'), language)
      this.language = language
      locale.setLang(language)
    },
    clear() {
      const keys: string[] = ['token', 'uid', 'name', 'oid', 'language', 'exp', 'time']
      keys.forEach(key => wsCache.delete(getStoragePrefix('user.' + key)))
    }
  }
})

export const useUserStoreWithOut = () => {
  return userStore(store)
}
