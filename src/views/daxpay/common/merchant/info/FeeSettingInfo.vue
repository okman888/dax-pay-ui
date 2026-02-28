<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :width="600"
    :title="title"
    :mask-closable="showable"
    :open="visible"
    @close="handleCancel"
    :loading="confirmLoading"
    @cancel="handleCancel"
  >
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
        <a-divider orientation="left">费率设置</a-divider>

        <a-form-item label="商户名称" name="mchName">
          <a-input v-model:value="form.mchName" disabled placeholder="商户名称" />
        </a-form-item>

        <a-form-item label="费率" name="feeRate">
          <a-input-number
            v-model:value="form.feeRate"
            :disabled="showable"
            :min="0"
            :max="100"
            :step="0.01"
            placeholder="请输入费率"
            style="width: 100%"
          />
          <template #extra>
            <div style="color: #999; font-size: 12px">例如：0.38表示38%</div>
          </template>
        </a-form-item>

        <a-form-item label="状态" name="status">
          <a-switch
            :checked="form.status === 'ENABLED'"
            :disabled="showable"
            @change="handleStatusChange"
          />
          <span style="margin-left: 8px">{{ form.status === 'ENABLED' ? '启用' : '禁用' }}</span>
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
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicDrawer } from '@/components/Drawer'
  import { useMessage } from '@/hooks/web/useMessage'
  import { getFeeSettingInfo, saveFeeSettingInfo } from './merchant.api'

  // 定义费率设置数据结构
  interface FeeSettingForm {
    id?: string
    mchId: string
    mchNo: string
    mchName: string
    feeRate: number
    status: string
  }

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    showable,
  } = useFormEdit()

  const formRef = ref<FormInstance>()

  const form = ref<FeeSettingForm>({
    mchId: '',
    mchNo: '',
    mchName: '',
    feeRate: 0,
    status: 'ENABLED',
  })

  // 校验规则
  const rules = reactive({
    feeRate: [
      { required: true, message: '请输入费率' },
      { type: 'number', min: 0, max: 100, message: '费率必须在0-100之间' },
    ],
    status: [{ required: true, message: '请选择状态' }],
  } as Record<string, Rule[]>)

  const { createMessage } = useMessage()

  const emits = defineEmits(['ok'])

  /**
   * 初始化入口
   */
  function init(mchId: string, editType: FormEditType = FormEditType.Edit) {
    initFormEditType(editType)
    resetForm()

    getFeeSettingInfo(mchId)
      .then(({ data }) => {
        if (data) {
          form.value = {
            ...form.value,
            ...data,
          }
        }
        form.value.mchId = mchId
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  /**
   * 提交
   */
  async function handleOk() {
    try {
      await formRef.value?.validate()
      await saveFeeSettingInfo(form.value)
      createMessage.success('保存成功')
      emits('ok', form.value)
      handleCancel()
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证失败
        createMessage.error('请检查表单填写是否正确')
      } else {
        // API 调用失败
        createMessage.error(error?.msg || '保存失败')
      }
    }
  }

  /**
   * 重置
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }

  /**
   * 状态开关变化处理
   */
  function handleStatusChange(checked: boolean) {
    form.value.status = checked ? 'ENABLED' : 'DISABLED'
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  :deep(.ant-divider-horizontal.ant-divider-with-text) {
    margin: 24px 0;
    font-size: 16px;
    font-weight: bold;
  }
</style>
