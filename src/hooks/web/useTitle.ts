import { watch, unref, computed } from 'vue'
import { useTitle as usePageTitle } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useLocaleStore } from '@/store/modules/locale'
import { REDIRECT_NAME } from '@/router/constant'
import { getSystemTitle } from '@/logics/initWebsiteConfig'

/**
 * Listening to page changes and dynamically changing site titles
 */
export function useTitle() {
  const { currentRoute } = useRouter()
  const localeStore = useLocaleStore()

  const pageTitle = usePageTitle()

  watch(
    [() => currentRoute.value.path, () => localeStore.getLocale, () => getSystemTitle()],
    () => {
      const route = unref(currentRoute)

      if (route.name === REDIRECT_NAME) {
        return
      }
      const systemTitle = computed(() => getSystemTitle())
      const title = route?.meta?.title as string
      pageTitle.value = title ? ` ${title} - ${systemTitle.value} ` : `${systemTitle.value}`
    },
    { immediate: true },
  )
}
