<template>
  <a-modal
    v-model:open="visible"
    title="新建商户进件"
    @ok="handleOk"
    :confirmLoading="confirmLoading"
  >
    <a-form :model="form" :rules="rules" ref="formRef" :label-col="{ span: 6 }">
      <a-form-item label="进件名称" name="title">
        <a-input v-model:value="form.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item label="商户选择" name="mchNo">
        <mch-select v-model:value="form.mchNo" @change="handleMchChange" />
      </a-form-item>
      <a-form-item label="进件通道" name="channel">
        <a-select v-model:value="form.channel" :options="channelOptions" />
      </a-form-item>
      <a-form-item label="服务商号" name="isvNo">
        <a-input v-model:value="form.isvNo" placeholder="请输入服务商号" />
      </a-form-item>
      <a-form-item label="进件类型" name="applyType">
        <a-select
          v-model:value="form.applyType"
          :options="[{ label: '商户进件', value: 'mch_apply' }]"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
  import { ref, onMounted } from 'vue'
  import { add } from './MchOnbApply.api'
  import { message, Modal } from 'ant-design-vue'
  import type { LabeledValue } from 'ant-design-vue/es/select'
  import { dropdownByEnable } from '@/views/daxpay/common/constant/channel/ChannelConst.api'
  import MchSelect from './MchSelect.vue' // 引入商户选择组件

  const visible = ref(false)
  const confirmLoading = ref(false)
  const form = ref({
    title: '',
    mchNo: '',
    isvNo: '010256',
    channel: 'cpcn_pay',
    applyType: 'mch_apply',
  })
  const channelOptions = ref<LabeledValue[]>([])
  const rules = ref({
    title: [{ required: true, message: '请输入进件名称' }],
    mchNo: [{ required: true, message: '请选择商户' }],
    channel: [{ required: true, message: '请选择进件通道' }],
  })
  const emits = defineEmits(['ok'])

  // Load channel options when component is mounted
  onMounted(async () => {
    const { data } = await dropdownByEnable()
    channelOptions.value = data
  })

  function init() {
    visible.value = true
    // Reset form when modal is opened
    form.value = {
      title: '',
      mchNo: '',
      isvNo: '',
      channel: 'cpcn_pay',
      applyType: 'mch_apply',
    }
  }

  function handleMchChange(value: any) {
    console.log('Selected merchant:', value)
    // You can add additional logic here when merchant is selected
    form.value.mchNo = value
  }

  function handleOk() {
    // Validate form before submitting
    // You may need to add form validation here
    Modal.confirm({
      title: '提示',
      content: '是否创建进件申请单并进行填写？',
      onOk: async () => {
        confirmLoading.value = true
        try {
          const { data } = await add(form.value)
          visible.value = false
          emits('ok', data)
          message.success('创建成功')
        } catch (error) {
          message.error('创建失败')
          console.error('Error creating onboarding application:', error)
        } finally {
          confirmLoading.value = false
        }
      },
    })
  }

  defineExpose({ init })
</script>
