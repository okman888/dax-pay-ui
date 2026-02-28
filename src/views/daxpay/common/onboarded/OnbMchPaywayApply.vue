<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="1000"
    :title="title"
    :open="visible"
    :mask-closable="false"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form
        class="small-from-item"
        :model="form"
        ref="formRef"
        :validate-trigger="['blur', 'change']"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-item label="进件机构号" name="onbIsvNo">
          <a-input v-model:value="form.onbIsvNo" disabled />
        </a-form-item>
        <a-form-item label="进件商户号" name="onbMchNo">
          <a-input v-model:value="form.onbMchNo" disabled />
        </a-form-item>
        <a-form-item label="所属通道" name="onbChannel">
          <a-input v-model:value="form.onbChannel" disabled />
        </a-form-item>
        <a-form-item label="行业类别" name="bizCategory">
          <a-input
            v-model:value="form.bizCategory"
            placeholder="请输入行业类别（参照商户进件行业类别代码表）"
          />
        </a-form-item>
        <a-form-item label="支付方式" name="payWay">
          <a-select
            v-model:value="form.payWay"
            placeholder="请选择支付方式"
            :options="payWayOptions"
            show-search
            :filter-option="search"
            :field-names="{ label: 'label', value: 'value' }"
          />
        </a-form-item>
        <a-form-item label="支付类别" name="payType">
          <a-select
            v-model:value="form.payType"
            placeholder="请选择支付类别"
            :options="payTypeOptions"
            mode="multiple"
            show-search
            :filter-option="search"
          />
        </a-form-item>
        <a-form-item>
          <a-space style="display: flex; justify-content: center; width: 100%">
            <a-button type="default" @click="resetForm">重置</a-button>
            <a-button type="primary" :loading="confirmLoading" @click="handleOk">提交开通</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-spin>
    <a-divider>开通历史</a-divider>
    <div class="h-40vh">
      <vxe-table
        height="auto"
        ref="xTable"
        :row-config="{ keyField: 'id' }"
        :data="historyList"
        :loading="historyLoading"
      >
        <vxe-column type="seq" width="60" />
        <vxe-column field="onbIsvNo" title="进件机构号" :min-width="150" />
        <vxe-column field="onbMchNo" title="进件商户号" :min-width="150" />
        <vxe-column field="onbChannel" title="所属通道" :min-width="120" />
        <vxe-column field="bizCategory" title="行业类别" :min-width="120" />
        <vxe-column field="payWay" title="支付方式" :min-width="120" />
        <vxe-column field="payType" title="支付类别" :min-width="120" />
        <vxe-column field="status" title="状态" align="center" :min-width="100" />
        <vxe-column field="channelStatus" title="通道状态" align="center" :min-width="100" />
        <vxe-column field="channelResult" title="通道结果" align="center" :min-width="150" />
        <vxe-column field="createTime" title="创建时间" :min-width="140" />
        <vxe-column fixed="right" :width="100" :showOverflow="false" title="操作">
          <template #default="{ row }">
            <a-space :size="2">
              <a-link @click="syncStatus(row)">同步状态</a-link>
            </a-space>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import {
    add,
    statusQuery as statusQueryApi,
    push,
    findByOnbMchNo,
    OnbMchPayway,
  } from './OnbMchPaywayApply.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { BasicModal } from '@/components/Modal'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  const { initFormEditType, handleCancel, title, confirmLoading, visible, search } = useFormEdit()

  const { createMessage } = useMessage()

  const formRef = ref<FormInstance>()
  const form = ref<OnbMchPayway>({})

  const payWayOptions = ref<LabeledValue[]>([
    { label: '微信', value: 'wechatpay' },
    { label: '支付宝', value: 'alipay' },
  ])
  const payTypeOptions = ref<LabeledValue[]>([
    { label: 'H5', value: 'H5' },
    { label: 'APP', value: 'APP' },
    { label: 'SCAN', value: 'SCAN' },
  ])
  const historyList = ref<OnbMchPayway[]>([])
  const historyLoading = ref(false)

  const rules = reactive({
    bizCategory: [{ required: true, message: '请输入行业类别' }],
    payWay: [{ required: true, message: '请选择支付方式' }],
    payType: [{ required: true, message: '请选择支付类别' }],
  } as Record<string, Rule[]>)

  const emits = defineEmits(['ok'])

  function init(record) {
    initFormEditType('add')
    resetForm()
    form.value.onbIsvNo = record.onbIsvNo || ''
    form.value.onbMchNo = record.onbMchNo || ''
    form.value.onbChannel = record.onbChannel || ''
    form.value.onbMchId = record.id

    loadHistory(record.onbMchNo)
  }

  function loadHistory(onbMchNo) {
    historyLoading.value = true
    findByOnbMchNo(onbMchNo)
      .then(({ data }) => {
        historyList.value = data
      })
      .finally(() => {
        historyLoading.value = false
      })
  }

  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      try {
        const submitData = { ...form.value }
        if (Array.isArray(submitData.payType)) {
          submitData.payType = submitData.payType.join(',')
        }
        await add(submitData)
        createMessage.success('开通申请提交成功')
        loadHistory(form.value.onbMchNo)
        resetForm()
      } finally {
        confirmLoading.value = false
      }
    })
  }

  function syncStatus(record) {
    statusQueryApi(record.id).then(() => {
      createMessage.success('状态同步成功')
      loadHistory(form.value.onbMchNo)
    })
  }

  function resetForm() {
    formRef.value?.resetFields()
    form.value.payWay = undefined
    form.value.payType = []
    form.value.bizCategory = undefined
    form.value.onbChannel = ''
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
