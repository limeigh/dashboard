import { useCache } from '@/hooks/web/useCache'
import { refreshApi } from '@/api/login'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useRequestStoreWithOut } from '@/store/modules/request'

import { isLink, getStoragePrefix } from '@/utils/utils'
const { wsCache } = useCache()
const userStore = useUserStoreWithOut()
const requestStore = useRequestStoreWithOut()
const refreshUrl = '/login/refresh'

const expConstants = 10000

const expTimeConstants = 90000

const isExpired = () => {
  const exp = wsCache.get(getStoragePrefix('user.exp'))
  if (!exp) {
    return false
  }
  const time = wsCache.get(getStoragePrefix('user.time'))
  if (!time) {
    return exp - Date.now() < expConstants
  }
  return Date.now() - time > expTimeConstants
}

const delayExecute = (token: string) => {
  const cachedRequestList = requestStore.getRequestList
  cachedRequestList.forEach(cb => {
    cb(token)
  })
  requestStore.cleanCacheRequest()
}

const getRefreshStatus = () => {
  return wsCache.get(getStoragePrefix('de-global-refresh')) || false
}
const setRefreshStatus = (status: boolean) => {
  wsCache.set(getStoragePrefix('de-global-refresh'), status, { exp: 5 })
}

const cacheRequest = cb => {
  requestStore.addCacheRequest(cb)
}

export const configHandler = config => {
  const desktop = wsCache.get(getStoragePrefix('app.desktop'))
  if (desktop) {
    return config
  }
  if (isLink()) {
    return config
  }
  if (wsCache.get(getStoragePrefix('user.token'))) {
    config.headers['X-DE-TOKEN'] = wsCache.get(getStoragePrefix('user.token'))
    // const expired = isExpired()
    // if (expired && !config.url.includes(refreshUrl)) {
    //   if (!getRefreshStatus()) {
    //     setRefreshStatus(true)
    //     refreshApi(Date.now())
    //       .then(res => {
    //         if (res?.data?.token) {
    //           userStore.setToken(res.data.token)
    //           userStore.setExp(res.data.exp)
    //           userStore.setTime(Date.now())
    //           config.headers['X-DE-TOKEN'] = res.data.token
    //           delayExecute(res.data.token)
    //         } else {
    //           delayExecute(null)
    //         }
    //       })
    //       .catch(e => {
    //         console.error(e)
    //       })
    //       .finally(() => {
    //         setRefreshStatus(false)
    //       })
    //   }
    //   const retry = new Promise(resolve => {
    //     cacheRequest(token => {
    //       config.headers['X-DE-TOKEN'] = token
    //       resolve(config)
    //     })
    //   })
    //   return retry
    // } else {
    //   return config
    // }
  }
  return config
}
