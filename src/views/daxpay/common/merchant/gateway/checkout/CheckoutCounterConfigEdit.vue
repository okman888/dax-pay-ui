<template>
  <basic-modal
    title="收银台配置"
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
        <a-form-item label="主键" name="id" :hidden="true">
          <a-input v-model:value="form.id" :disabled="showable" />
        </a-form-item>

        <a-form-item label="配置名称" name="name">
          <a-input v-model:value="form.name" :disabled="showable" placeholder="请输入配置名称" />
        </a-form-item>

        <a-form-item label="是否推荐" name="recommend">
          <a-radio-group v-model:value="form.recommend" :disabled="showable">
            <a-radio :value="false">否</a-radio>
            <a-radio :value="true">是</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="排序号" name="sortNo">
          <a-input-number
            v-model:value="form.sortNo"
            :disabled="showable"
            placeholder="排序号，数字越小越靠前"
            style="width: 100%"
          />
        </a-form-item>

        <a-form-item label="图标" name="icon">
          <a-select
            v-model:value="form.icon"
            :disabled="showable"
            allow-clear
            placeholder="请选择图标"
          >
            <a-select-option value="alipay">支付宝</a-select-option>
            <a-select-option value="wechat">微信</a-select-option>
            <a-select-option value="union">银联</a-select-option>
            <a-select-option value="aggregate">聚合支付</a-select-option>
          </a-select>
        </a-form-item>

        <a-divider orientation="left">支付配置</a-divider>

        <a-form-item label="支付通道" name="channel">
          <a-select
            v-model:value="form.channel"
            :disabled="showable"
            :options="channelList"
            @change="changeChannel"
            allow-clear
            placeholder="请选择支付通道"
          />
        </a-form-item>

        <a-form-item label="支付方式" name="payMethod">
          <a-select
            v-model:value="form.payMethod"
            :disabled="showable"
            :options="methodList"
            allow-clear
            placeholder="请选择支付方式"
            @change="changePayMethod"
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

<script setup lang="ts">
  import { BasicModal } from '@/components/Modal'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { save, update, findById, CheckoutCounterConfig } from './CheckoutCounterConfig.api'
  import { computed, nextTick, onMounted, ref, unref } from 'vue'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { useDict } from '@/hooks/bootx/useDict'
  import { payMethodList } from '@/views/daxpay/common/assist/basic/ChannelBasic.api'
  import { useMessage } from '@/hooks/web/useMessage'

  const props = defineProps({
    appId: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['pc', 'h5'].includes(value),
    },
  })

  const { dictDropDown } = useDict()
  const { createMessage } = useMessage()

  const {
    handleCancel,
    initFormEditType,
    formEditType,
    confirmLoading,
    visible,
    showable,
    labelCol,
    wrapperCol,
  } = useFormEdit()

  const channelList = ref<LabeledValue[]>([])
  const methodList = ref<LabeledValue[]>([])

  const formRef = ref<FormInstance>()

  let form = ref<CheckoutCounterConfig>({
    recommend: false,
  })

  // 校验
  const rules = computed(() => {
    return {
      name: [{ required: true, message: '请输入配置名称' }],
      type: [{ required: true, message: '请选择配置类型' }],
      channel: [{ required: true, message: '请选择支付通道类型' }],
      recommend: [{ required: true, message: '请选择是否推荐' }],
      payMethod: [{ required: true, message: '请选择支付方式' }],
    } as Record<string, Rule[]>
  })

  // 事件
  const emits = defineEmits(['ok'])

  onMounted(() => {
    initData()
  })

  /**
   * 入口
   */
  function init(id: number | null, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    getInfo(id, editType)
    form.value.appId = props.appId
    form.value.type = props.type
    if (id) {
      form.value.id = id
    }
  }

  /**
   * 支付通道切换
   */
  function changeChannel() {
    form.value.payMethod = undefined
    form.value.otherMethod = undefined
    initPayMethod()
  }

  /**
   * 获取支付方式
   */
  async function initPayMethod() {
    if (form.value.channel) {
      payMethodList(form.value.channel).then(({ data }) => {
        methodList.value = data
      })
    } else {
      methodList.value = []
    }
  }

  /**
   * 支付方式发生改变(只要切换，就将其他支付方式置空)
   */
  function changePayMethod() {
    form.value.otherMethod = undefined
  }

  /**
   * 初始化数据
   */
  async function initData() {
    channelList.value = await dictDropDown('channel')
  }

  /**
   * 获取信息
   */
  function getInfo(id: number | null, editType: FormEditType) {
    if ([FormEditType.Edit, FormEditType.Show].includes(editType) && id) {
      confirmLoading.value = true
      findById(id).then(({ data }) => {
        form.value = data
        confirmLoading.value = false
        initPayMethod()
      })
    } else {
      confirmLoading.value = false
    }
  }

  /**
   * 保存
   */
  function handleOk() {
    formRef.value?.validate().then(async () => {
      confirmLoading.value = true
      try {
        if (formEditType.value === FormEditType.Add) {
          await save(unref(form))
          createMessage.success('保存成功')
        } else if (formEditType.value === FormEditType.Edit) {
          await update(unref(form))
          createMessage.success('保存成功')
        }
        handleCancel()
        emits('ok')
      } catch (error) {
        createMessage.error('保存失败')
      } finally {
        confirmLoading.value = false
      }
    })
  }

  // 重置表单的校验
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }

  defineExpose({ init })
</script>

<style scoped lang="less"></style>