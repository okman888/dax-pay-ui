<template>
  <basic-modal
    v-bind="$attrs"
    :loading="confirmLoading"
    :width="750"
    :title="title"
    :open="visible"
    :mask-closable="showable"
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
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>
        <a-form-item label="商户" name="mchNo">
          <a-select
            show-search
            :filter-option="search"
            v-model:value="form.mchNo"
            placeholder="请选择商户"
            :options="mchNoOptions"
            :disabled="showable || formEditType === FormEditType.Edit"
            @change="handleMchNoChange"
          />
        </a-form-item>
        <a-form-item label="所属通道" name="onbChannel">
          <a-select
            v-model:value="form.onbChannel"
            :disabled="showable || formEditType === FormEditType.Edit"
            placeholder="请选择所属通道"
            :options="channelOptions"
            @change="handleOnbChannelChange"
          />
        </a-form-item>
        <a-form-item label="进件机构号" name="onbIsvNo" v-if="form.mchNo && form.onbChannel">
          <a-input
            v-model:value="form.onbIsvNo"
            :disabled="showable || formEditType === FormEditType.Edit"
            placeholder="请输入进件机构号"
          />
        </a-form-item>

        <a-form-item label="进件商户号" name="onbMchNo" v-if="form.mchNo && form.onbChannel">
          <a-input
            v-model:value="form.onbMchNo"
            :disabled="showable || formEditType === FormEditType.Edit"
            placeholder="请输入进件商户号"
          />
        </a-form-item>
        <a-form-item label="进件商户名称" name="onbMchName">
          <a-input
            v-model:value="form.onbMchName"
            :disabled="showable"
            placeholder="请输入进件商户名称"
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
          >保存</a-button
        >
      </a-space>
    </template>
  </basic-modal>
</template>

<script lang="ts" setup>
  import { nextTick, reactive, ref, unref } from 'vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { add, get, OnbMchInfo, update, existsByOnbMchNo } from './OnbMchInfo.api'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicModal } from '@/components/Modal'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { dropdown as merchantDropdown } from '@/views/daxpay/common/assist/basic/MerchantQuery.api'
  import { dropdownByEnable as channelDropdown } from '@/views/daxpay/common/constant/channel/ChannelConst.api'

  const {
    initFormEditType,
    handleCancel,
    labelCol,
    wrapperCol,
    title,
    confirmLoading,
    visible,
    showable,
    formEditType,
    search,
  } = useFormEdit()

  const { createMessage } = useMessage()

  // 表单
  const formRef = ref<FormInstance>()
  const form = ref<OnbMchInfo>({})
  const mchNoOptions = ref<LabeledValue[]>([])
  const channelOptions = ref<LabeledValue[]>([])

  // 校验
  const rules = reactive({
    mchNo: [{ required: true, message: '请选择商户' }],
    onbIsvNo: [{ required: true, message: '请输入进件机构号' }],
    onbMchNo: [
      { required: true, message: '请输入进件商户号' },
      {
        validator: async (rule, value) => {
          if (!value || formEditType.value !== FormEditType.Add) {
            return Promise.resolve()
          }

          // 确保商户和所属通道都已选择
          if (!form.value.mchNo || !form.value.onbChannel) {
            return Promise.resolve()
          }

          try {
            const result = await existsByOnbMchNo(value, form.value.mchNo, form.value.onbChannel)
            if (result.data) {
              return Promise.reject('进件商户号已存在')
            }
            return Promise.resolve()
          } catch (error) {
            console.error('查询进件商户号失败', error)
            return Promise.resolve()
          }
        },
      },
    ],
    onbMchName: [{ required: true, message: '请输入进件商户名称' }],
    onbChannel: [{ required: true, message: '请选择所属通道' }],
  } as Record<string, Rule[]>)

  // 事件
  const emits = defineEmits(['ok'])

  /**
   * 入口
   */
  function init(id, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      // 编辑和查看模式下，先加载商户数据和通道数据，再获取表单数据
      Promise.all([initMerchantData(), initChannelData()]).then(() => {
        getInfo(id, editType)
      })
    } else {
      // 添加模式下，需要加载商户数据和通道数据
      Promise.all([initMerchantData(), initChannelData()]).then(() => {
        getInfo(id, editType)
      })
    }
  }

  /**
   * 初始化商户数据
   */
  function initMerchantData() {
    return merchantDropdown().then(({ data }) => {
      mchNoOptions.value = data
    })
  }

  /**
   * 初始化通道数据
   */
  function initChannelData() {
    return channelDropdown().then(({ data }) => {
      channelOptions.value = data
    })
  }

  /**
   * 获取信息
   */
  function getInfo(id, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType)) {
      confirmLoading.value = true
      get(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
      })
    } else if (editType === FormEditType.Add) {
      confirmLoading.value = false
    }
  }

  // 保存
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      if (formEditType.value === FormEditType.Add) {
        await add(unref(form)).finally(() => (confirmLoading.value = false))
        createMessage.success('保存成功')
      } else if (formEditType.value === FormEditType.Edit) {
        await update(unref(form)).finally(() => (confirmLoading.value = false))
        createMessage.success('保存成功')
      }
      handleCancel()
      emits('ok')
    })
  }

  /**
   * 商户选择变化处理
   */
  function handleMchNoChange() {
    // 清空进件商户号
    form.value.onbMchNo = ''
  }

  /**
   * 所属通道选择变化处理
   */
  function handleOnbChannelChange() {
    // 清空进件商户号
    form.value.onbMchNo = ''
  }

  /**
   * 重置表单的校验
   */
  function resetForm() {
    nextTick(() => formRef.value?.resetFields())
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped></style>
