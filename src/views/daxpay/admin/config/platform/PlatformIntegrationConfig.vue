<template>
  <a-spin :spinning="confirmLoading" class="platBox">
    <div class="platBox">
      <div class="mainContent">
        <a-form layout="vertical" :model="form" ref="formRef" :rules="rules">
          <a-row :gutter="[256, 24]">
            <a-col :span="12">
              <a-form-item
                label="是否检查请求超时"
                tooltip="检查接收到请求的请求时间和系统时间的误差"
                name="reqTimeout"
              >
                <a-radio-group :disabled="!edit" v-model:value="form.reqTimeout">
                  <a-radio :value="true">是</a-radio>
                  <a-radio :value="false">否</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="请求超时时间(秒)"
                name="apiReqTimeout"
                tooltip="接受到请求中的请求时间参数和实际接收到时间允许误差的时间"
              >
                <a-input-number
                  :min="5"
                  :max="300"
                  :precision="0"
                  :disabled="!edit"
                  v-model:value="form.apiReqTimeout"
                  placeholder="请输入超时时间"
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
    getIntegration,
    PlatformIntegrationConfig,
    updateIntegration,
  } from '@/views/daxpay/admin/config/platform/PlatformConfig.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'

  const { createMessage } = useMessage()
  const confirmLoading = ref(false)
  const form = ref<PlatformIntegrationConfig>({})
  const formRef = ref<FormInstance>()
  const edit = ref<boolean>(false)
  const rules = ref<Record<string, Rule[]>>({
    reqTimeout: [{ required: true, message: '请选择是否超时验证' }],
    apiReqTimeout: [{ required: true, message: '请输入超时时间' }],
  })

  /**
   * 初始化数据
   */
  function initData() {
    confirmLoading.value = true
    getIntegration().then(({ data }) => {
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
      updateIntegration(form.value)
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
