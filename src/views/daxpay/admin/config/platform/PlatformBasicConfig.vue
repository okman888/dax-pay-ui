<template>
  <a-spin :spinning="confirmLoading" class="platBox">
    <div class="platBox">
      <div class="mainContent">
        <a-form layout="vertical" :model="form" ref="formRef">
          <a-row :gutter="[256, 24]">
            <a-col :span="12">
              <a-form-item label="单笔支付限额(元)">
                <a-input-number
                  :precision="2"
                  :min="0.01"
                  :max="999999.99"
                  :disabled="!edit"
                  v-model:value="form.singleLimitAmount"
                  placeholder="请输入商户单笔支付限额"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="每月累计限额(元)">
                <a-input-number
                  :precision="2"
                  :min="0.01"
                  :max="999999.99"
                  :disabled="!edit || true"
                  v-model:value="form.monthlyLimitAmount"
                  placeholder="请输入商户每月累计限额"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="每日累计限额(元)">
                <a-input-number
                  :precision="2"
                  :min="0.01"
                  :max="999999.99"
                  :disabled="!edit || true"
                  v-model:value="form.dailyLimitAmount"
                  placeholder="请输入商户每日累计限额"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="订单默认超时时间(分钟)"
                tooltip="受不同通道的超时时间处理方式不同，此处的超时时间指的是在系统订单存储的超时时间，通道方不一定会有效"
              >
                <a-input-number
                  :precision="0"
                  :min="5"
                  :max="999999"
                  :disabled="!edit"
                  v-model:value="form.orderTimeout"
                  placeholder="请输入订单默认超时时间(分钟)"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="默认服务商" tooltip="注册商户时，默认的服务商">
                <a-select
                  style="width: 100%"
                  v-model:value="form.defaultIsvNo"
                  :disabled="!edit || true"
                  :options="isvOptions"
                  allow-clear
                  placeholder="请选择默认服务商"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
        <div class="btnBox">
          <a-button v-if="edit" @click="initData">取消</a-button>
          <a-button v-if="edit" type="primary" @click="updateConfig">更新</a-button>
          <a-button v-if="!edit" @click="edit = true">编辑信息</a-button>
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script setup lang="ts">
  import { useMessage } from '@/hooks/web/useMessage'
  import { onMounted, ref } from 'vue'
  import {
    getBasic,
    PlatformBasicConfig,
    updateBasic,
  } from '@/views/daxpay/admin/config/platform/PlatformConfig.api'
  import { FormInstance } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { dropdown as isvDropdown } from '@/views/daxpay/common/assist/basic/IsvQuery.api'

  const { createMessage } = useMessage()
  const confirmLoading = ref(false)
  const form = ref<PlatformBasicConfig>({})
  const formRef = ref<FormInstance>()
  const edit = ref<boolean>(false)
  const agentOptions = ref<LabeledValue[]>([])
  const isvOptions = ref<LabeledValue[]>([])

  /**
   * 初始化数据
   */
  function initData() {
    confirmLoading.value = true
    // 初始化服务商
    isvDropdown().then(({ data }) => (isvOptions.value = data))
    getBasic().then(({ data }) => {
      form.value = data
      confirmLoading.value = false
    })
    edit.value = false
  }

  /**
   * 更新配置
   */
  function updateConfig() {
    formRef.value?.validate().then(() => {
      confirmLoading.value = true
      updateBasic(form.value)
        .then(() => {
          createMessage.success('更新成功')
          confirmLoading.value = false
          edit.value = false
          initData()
        })
        .catch(() => {
          confirmLoading.value = false
        })
    })
  }

  onMounted(() => {
    initData()
  })
</script>

<style scoped lang="less">
  .platBox {
    width: 100%;
    display: flex;
    justify-content: center;
    .mainContent {
      width: 80%;
      .btnBox {
        width: 100%;
        margin-top: 30px;
        display: flex;
        gap: 40px;
        justify-content: center;
      }
    }
  }
</style>
