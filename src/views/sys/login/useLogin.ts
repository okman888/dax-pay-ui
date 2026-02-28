import type { FormInstance } from 'ant-design-vue/lib/form/Form'
import type { Rule as ValidationRule } from 'ant-design-vue/lib/form/interface'
import { ref, computed, unref, Ref } from 'vue'

export enum LoginStateEnum {
  LOGIN,
}

const currentState = ref(LoginStateEnum.LOGIN)

export function useLoginState() {
  function setLoginState(state: LoginStateEnum) {
    currentState.value = state
  }

  const getLoginState = computed(() => currentState.value)

  function handleBackLogin() {
    setLoginState(LoginStateEnum.LOGIN)
  }

  return { setLoginState, getLoginState, handleBackLogin }
}

export function useFormValid<T extends Object = any>(formRef: Ref<FormInstance>) {
  async function validForm() {
    try {
      const form = unref(formRef)
      if (!form) return
      const data = await form.validate()
      return data as T
    } catch (error) {
      console.error('表单验证失败:', error)
      return false
    }
  }

  return { validForm }
}

export function useFormRules() {
  const getAccountFormRule = computed(() => createRule('请输入账号'))
  const getPasswordFormRule = computed(() => createRule('请输入密码'))

  const getFormRules = computed((): { [k: string]: ValidationRule | ValidationRule[] } => {
    const accountFormRule = unref(getAccountFormRule)
    const passwordFormRule = unref(getPasswordFormRule)

    // login form rules
    return {
      account: accountFormRule,
      password: passwordFormRule,
    }
  })
  return { getFormRules }
}

function createRule(message: string): ValidationRule[] {
  return [
    {
      required: true,
      message,
      trigger: 'change',
    },
  ]
}
