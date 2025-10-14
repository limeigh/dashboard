import { useCache } from '@/hooks/web/useCache'
import { getStoragePrefix } from '@/utils/utils'
const { wsCache } = useCache()

export const isDesktop = () => {
  const desktop = wsCache.get(getStoragePrefix('app.desktop'))
  return desktop
}
