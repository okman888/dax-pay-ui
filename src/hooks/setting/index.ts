import type { GlobConfig } from '#/config'

import { getAppEnvConfig } from '@/utils/env'

export const useGlobSetting = (): Readonly<GlobConfig> => {
  const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = getAppEnvConfig()

  // Take global configuration
  const glob: Readonly<GlobConfig> = {
    title: '',
    apiUrl: VITE_GLOB_API_URL,
    shortName: ''.replace(/\s/g, '_').replace(/-/g, '_'),
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
  }
  return glob as Readonly<GlobConfig>
}
