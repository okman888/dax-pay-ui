<template>
  <basic-modal
    title="绑定空白码牌"
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :open="visible"
    :mask-closable="showable"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        ref="formRef"
        :model="form"
        :rules="rules"
        :validate-trigger="['blur', 'change']"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="码牌编号" name="code">
          <a-input v-model:value="form.code" placeholder="请输入要绑定空白码牌编号" />
        </a-form-item>
        <a-form-item label="商户应用" name="appId">
          <a-select
            show-search
            :filter-option="search"
            :options="mchAppOptions"
            v-model:value="form.appId"
            placeholder="请选择商户应用"
          />
        </a-form-item>
      </a-form>
    </a-spin>
    <template #footer>
      <a-space>
        <a-button key="cancel" @click="handleCancel">取消</a-button>
        <a-button
          v-if="!showable"
          key="forward"
          :loading="confirmLoading"
          type="primary"
          @click="handleOk"
          >绑定</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>
<script setup lang="ts">
  import { BasicModal } from '@/components/Modal'
  import { computed, nextTick, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useMessage } from '@/hooks/web/useMessage'
  import { dropdown as mchAppDropdown } from '@/views/daxpay/common/assist/basic/MchAppQuery.api'
  import { bindBlank } from './CashierCode.api'

  const { createConfirm, createMessage } = useMessage()
  const { handleCancel, confirmLoading, visible, showable, labelCol, wrapperCol } = useFormEdit()
  const { search } = useFormEdit()
  const emits = defineEmits(['ok'])

  const formRef = ref<FormInstance>()
  const mchAppOptions = ref<LabeledValue[]>([])

  let form = ref({
    code: undefined,
    appId: undefined,
  })
  // 校验
  const rules = computed(() => {
    return {
      code: [{ required: true, message: '请输入要绑定的收款码牌' }],
    } as Record<string, Rule[]>
  })

  /**
   * 初始化
   */
  function init() {
    initData()
    visible.value = true
    nextTick(() => formRef.value?.resetFields())
  }

  /**
   * 初始化数据
   */
  function initData() {
    mchAppDropdown().then(({ data }) => {
      mchAppOptions.value = data
    })
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(() => {
      createConfirm({
        iconType: 'warning',
        title: '警告',
        content: '是否要绑定输入的空白码牌?',
        onOk: () => {
          confirmLoading.value = true
          bindBlank(form.value)
            .then(() => {
              createMessage.success('绑定成功')
              handleCancel()
              emits('ok')
            })
            .finally(() => {
              confirmLoading.value = false
            })
        },
      })
    })
  }

  defineExpose({
    init,
  })
</script>

<style scoped lang="less"></style>
