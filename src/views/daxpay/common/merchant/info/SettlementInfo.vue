<template>
  <basic-drawer
    showFooter
    v-bind="$attrs"
    :width="840"
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
        <a-divider orientation="left">银行卡信息</a-divider>

        <a-form-item label="账户类型" name="accountType">
          <a-radio-group v-model:value="form.accountType" :disabled="showable">
            <a-radio value="public">公户</a-radio>
            <a-radio value="legal">对私法人</a-radio>
            <a-radio value="non-legal">对私非法人</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="银行卡账户名" name="bankAccountName">
          <a-input
            v-model:value="form.bankAccountName"
            :disabled="showable"
            placeholder="请输入银行卡账户名"
          />
        </a-form-item>

        <a-form-item label="银行卡号" name="bankCardNumber">
          <a-input
            v-model:value="form.bankCardNumber"
            :disabled="showable"
            placeholder="请输入银行卡号"
          />
        </a-form-item>

        <a-form-item label="预留手机号" name="bankReservedPhone">
          <a-input
            v-model:value="form.bankReservedPhone"
            :disabled="showable"
            placeholder="请输入银行预留手机号"
          />
        </a-form-item>

        <a-form-item label="银行名称" name="bankName">
          <a-input
            v-model:value="form.bankName"
            :disabled="showable"
            placeholder="请输入银行名称"
          />
        </a-form-item>

        <a-form-item label="银行联行号" name="bankBranchCode">
          <a-input
            v-model:value="form.bankBranchCode"
            :disabled="showable"
            placeholder="请输入银行联行号"
          />
          <template #extra>
            <a-button type="link" size="small" style="padding: 0" @click="handleSearchBankCode">
              联行号及开户支行名称查询
            </a-button>
          </template>
        </a-form-item>

        <a-form-item label="持卡人身份证号" name="cardholderIdNumber">
          <a-input
            v-model:value="form.cardholderIdNumber"
            :disabled="showable"
            placeholder="请输入持卡人身份证号"
            :maxlength="18"
          />
        </a-form-item>        
        <a-form-item label="银行卡正面" name="bankCardFrontUrl">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileFront"
            :before-upload="beforeUploadFront"
            @change="handleChangeFront"
          >
            <div v-if="form.bankCardFrontUrl">
              <img :src="form.bankCardFrontUrl" alt="银行卡正面照片" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="持卡人身份证正面" name="cardholderIdFrontUrl">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileCardholderFront"
            :before-upload="beforeUploadCardholderFront"
            @change="handleCardholderFrontChange"
          >
            <div v-if="form.cardholderIdFrontUrl">
              <img :src="form.cardholderIdFrontUrl" alt="持卡人身份证正面图片" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>     

        <a-form-item label="持卡人身份证反面" name="cardholderIdBackUrl">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileCardholderBack"
            :before-upload="beforeUploadCardholderBack"
            @change="handleCardholderBackChange"
          >
            <div v-if="form.cardholderIdBackUrl">
              <img :src="form.cardholderIdBackUrl" alt="持卡人身份证反面图片" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item 
          v-if="form.accountType === 'non-legal'" 
          label="非法人结算授权函" 
          name="settlementAuthLetterUrl"
          :rules="[{ required: form.accountType === 'non-legal', message: '请上传结算授权函图片' }]"
        >
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileAuthLetter"
            :before-upload="beforeUploadAuthLetter"
            @change="handleAuthLetterChange"
          >
            <div v-if="form.settlementAuthLetterUrl">
              <img :src="form.settlementAuthLetterUrl" alt="非法人结算授权函" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
          <template #extra>
            <div style="color: #999; font-size: 12px;">仅对私非法人账户类型需要上传结算授权函</div>
          </template>
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
  import { PlusOutlined } from '@ant-design/icons-vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicDrawer } from '@/components/Drawer'
  import { UploadProps } from 'ant-design-vue'
  import { getUploadParams, saveOssFileInfo } from '@/views/baseapi/file/upload/FileUpload.api'
  import { useUpload } from '@/hooks/bootx/useUpload'
  import { useMessage } from '@/hooks/web/useMessage'
  import { saveSettlementInfo, getSettlementInfo } from './merchant.api'

  // 定义结算信息数据结构
  interface SettlementForm {
    id?: string
    accountType: string
    bankCardFrontUrl: string
    cardholderIdFrontUrl: string
    cardholderIdBackUrl: string
    cardholderIdNumber: string
    settlementAuthLetterUrl: string
    bankAccountName: string
    bankCardNumber: string
    bankReservedPhone: string
    bankName: string
    bankBranchCode: string
    mchId: string
    mchNo: string
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

  const form = ref<SettlementForm>({
    accountType: 'public',
    bankCardFrontUrl: '',
    cardholderIdFrontUrl: '',
    cardholderIdBackUrl: '',
    cardholderIdNumber: '',
    settlementAuthLetterUrl: '',
    bankAccountName: '',
    bankCardNumber: '',
    bankReservedPhone: '',
    bankName: '',
    bankBranchCode: '',
    mchId: '',
    mchNo: '',
  })
  // 校验规则（根据图片中的逻辑及常用规范）
  const rules = reactive({
    accountType: [{ required: true, message: '请选择账户类型' }],
    bankAccountName: [{ required: true, message: '请输入银行卡账户名' }],
    bankCardNumber: [{ required: true, message: '请输入银行卡号' }],
    bankReservedPhone: [
      { required: true, message: '请输入银行预留手机号' },
      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' },
    ],
    bankName: [{ required: true, message: '请输入银行名称' }],
    bankBranchCode: [{ required: true, message: '请输入银行联行号' }],
    cardholderIdNumber: [
      { required: true, message: '请输入持卡人身份证号' },
      { pattern: /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入正确的身份证号格式' },
    ],
  } as Record<string, Rule[]>)

  const { createMessage } = useMessage()

  const { uploadFileToOss, getFileUrl } = useUpload()

  const uploadUrlFront = ref<string>()
  const uploadHeaderFront = ref<Map<string, string>>()
  const uploadAttachNameFront = ref<string>()

  const uploadUrlCardholderFront = ref<string>()
  const uploadHeaderCardholderFront = ref<Map<string, string>>()
  const uploadAttachNameCardholderFront = ref<string>()

  const uploadUrlCardholderBack = ref<string>()
  const uploadHeaderCardholderBack = ref<Map<string, string>>()
  const uploadAttachNameCardholderBack = ref<string>()

  const uploadUrlAuthLetter = ref<string>()
  const uploadHeaderAuthLetter = ref<Map<string, string>>()
  const uploadAttachNameAuthLetter = ref<string>()

  const emits = defineEmits(['ok'])

  /**
   * 初始化入口
   */
  function init(mchId: string, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    
    getSettlementInfo(mchId)
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
      await saveSettlementInfo(form.value)
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

  const beforeUploadFront: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlFront.value = data.url
        uploadHeaderFront.value = data.headers
        uploadAttachNameFront.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileFront(action: any) {
    uploadFileToOss(action.file, uploadUrlFront.value as string, uploadHeaderFront.value).then(
      () => {
        const file = action.file
        saveOssFileInfo({
          url: `${uploadAttachNameFront.value}`,
          size: file.size,
          originalFilename: file.name,
          filename: uploadAttachNameFront.value,
          contentType: file.type,
        }).then(() => {
          createMessage.success(`${file.name} 上传成功!`)
          form.value.bankCardFrontUrl = getFileUrl(uploadAttachNameFront.value)
        })
      },
    )
  }

  function handleChangeFront(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  const beforeUploadCardholderFront: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlCardholderFront.value = data.url
        uploadHeaderCardholderFront.value = data.headers
        uploadAttachNameCardholderFront.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileCardholderFront(action: any) {
    uploadFileToOss(action.file, uploadUrlCardholderFront.value as string, uploadHeaderCardholderFront.value).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameCardholderFront.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameCardholderFront.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.cardholderIdFrontUrl = getFileUrl(uploadAttachNameCardholderFront.value)
      })
    })
  }

  function handleCardholderFrontChange(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  const beforeUploadCardholderBack: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlCardholderBack.value = data.url
        uploadHeaderCardholderBack.value = data.headers
        uploadAttachNameCardholderBack.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileCardholderBack(action: any) {
    uploadFileToOss(action.file, uploadUrlCardholderBack.value as string, uploadHeaderCardholderBack.value).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameCardholderBack.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameCardholderBack.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.cardholderIdBackUrl = getFileUrl(uploadAttachNameCardholderBack.value)
      })
    })
  }

  function handleCardholderBackChange(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  const beforeUploadAuthLetter: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlAuthLetter.value = data.url
        uploadHeaderAuthLetter.value = data.headers
        uploadAttachNameAuthLetter.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileAuthLetter(action: any) {
    uploadFileToOss(action.file, uploadUrlAuthLetter.value as string, uploadHeaderAuthLetter.value).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameAuthLetter.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameAuthLetter.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.settlementAuthLetterUrl = getFileUrl(uploadAttachNameAuthLetter.value)
      })
    })
  }

  function handleAuthLetterChange(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  /**
   * 联行号查询点击事件
   */
  function handleSearchBankCode() {
    // 此处可扩展跳转或弹窗查询逻辑
    console.log('触发联行号查询')
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
