<template>
  <a-spin :spinning="confirmLoading">
    <a-form
      class="small-from-item"
      :model="form"
      ref="formRef"
      :validate-trigger="['blur', 'change']"
      :rules="rules"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <a-form-item label="主键" name="id" :hidden="true">
        <a-input v-model:value="form.id" :disabled="showable" />
      </a-form-item>
      <a-form-item label="微信付款码对应通道" name="wxChannel">
        <a-select
          v-model:value="form.wxChannel"
          :disabled="!edit"
          :options="channelList"
          allow-clear
          placeholder="请选择微信付款码对应通道"
        />
      </a-form-item>
      <a-form-item label="支付宝付款码对应通道" name="alipayChannel">
        <a-select
          v-model:value="form.alipayChannel"
          :disabled="!edit"
          :options="channelList"
          allow-clear
          placeholder="请选择支付宝付款码对应通道"
        />
      </a-form-item>
      <a-form-item label="银联付款码对应通道" name="unionChannel">
        <a-select
          v-model:value="form.unionChannel"
          :disabled="!edit"
          :options="channelList"
          allow-clear
          placeholder="请选择银联付款码对应通道"
        />
      </a-form-item>
    </a-form>
    <a-space :size="55" class="flex justify-center">
      <a-button v-if="edit" @click="initData">取消</a-button>
      <a-button v-if="edit" type="primary" @click="update">
        {{ form.id ? '更新' : '保存' }}
      </a-button>
      <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
    </a-space>
  </a-spin>
</template>

<script setup lang="ts">
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { onMounted, ref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { AggregateBarPayConfig, findBarByAppId, updateBarConfig } from './AggregateConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'

  const { labelCol, wrapperCol, confirmLoading, showable } = useFormEdit()
  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  // 编辑状态
  const edit = ref<boolean>(false)

  // 组件属性
  const props = defineProps({
    appId: String,
  })
  const channelList = ref<LabeledValue[]>([])

  onMounted(() => {
    initDictData()
    initData()
  })

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<AggregateBarPayConfig>({})

  // 表单验证规则
  const rules = {} as Record<string, Rule[]>

  /**
   * 初始化字典数据
   */
  async function initDictData() {
    channelList.value = await dictDropDown('channel')
  }

  /**
   * 重置信息
   */
  function initData() {
    confirmLoading.value = true
    edit.value = false
    // 获取配置
    findBarByAppId(props.appId).then(({ data }) => {
      form.value = data
      confirmLoading.value = false
      form.value.appId = props.appId
    })
  }

  /**
   * 更新配置
   */
  function update() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      updateBarConfig(form.value)
        .then(() => {
          edit.value = false
          createMessage.success('更新成功')
          initData()
        })
        .finally(() => (confirmLoading.value = false))
    })
  }
</script>

<style scoped lang="less"></style>
