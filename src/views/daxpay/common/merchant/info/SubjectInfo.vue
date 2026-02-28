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
        <a-divider orientation="left">基础信息</a-divider>
        <a-form-item label="商户类型" name="mchType">
          <a-radio-group v-model:value="form.mchType" :disabled="showable">
            <a-radio value="micro">小微商户</a-radio>
            <a-radio value="individual">个体工商户</a-radio>
            <a-radio value="enterprise">企业</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="商户全称" name="mchName">
          <a-input v-model:value="form.mchName" :disabled="showable" placeholder="请输入商户全称" />
        </a-form-item>
        <a-form-item label="商户简称" name="mchShortName">
          <a-input
            v-model:value="form.mchShortName"
            :disabled="showable"
            placeholder="请输入商户简称"
          />
        </a-form-item>

        <template v-if="form.mchType !== 'micro'">
          <a-divider orientation="left">营业执照信息</a-divider>
          <a-form-item label="营业执照照片" name="licenseImage">
            <a-upload
              name="file"
              list-type="picture-card"
              :show-upload-list="false"
              :custom-request="uploadLicenseImage"
              :disabled="showable"
              :before-upload="beforeUploadLicense"
              @change="handleChangeLicense"
            >
              <img
                v-if="form.licenseImageUrl"
                :src="form.licenseImageUrl"
                alt="营业执照"
                style="width: 100%"
              />
              <div v-else>
                <plus-outlined />
                <div style="margin-top: 8px">上传照片</div>
              </div>
            </a-upload>
          </a-form-item>

          <a-form-item label="营业执照号" name="licenseNumber">
            <a-input
              v-model:value="form.licenseNumber"
              :disabled="showable"
              placeholder="请输入营业执照号"
            />
          </a-form-item>

          <a-form-item label="营业执照名称" name="licenseName">
            <a-input
              v-model:value="form.licenseName"
              :disabled="showable"
              placeholder="请输入营业执照名称"
            />
          </a-form-item>

          <a-form-item label="注册详细地址" name="licenseAddress">
            <a-textarea
              v-model:value="form.licenseAddress"
              :disabled="showable"
              placeholder="请输入营业执照注册详细地址"
            />
          </a-form-item>

          <!-- 执照有效期开始和结束日期 -->
          <a-form-item label="执照有效期">
            <a-space direction="vertical" :size="12">
              <a-form-item label="有效期开始" name="licenseStartDate" style="margin-bottom: 0">
                <a-date-picker
                  v-model:value="form.licenseStartDate"
                  :disabled="showable"
                  placeholder="请选择开始日期"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </a-form-item>
              <a-form-item label="有效期结束" name="licenseEndDate" style="margin-bottom: 0">
                <a-space>
                  <a-date-picker
                    v-model:value="form.licenseEndDate"
                    :disabled="showable"
                    placeholder="请选择结束日期"
                    value-format="YYYY-MM-DD"
                    style="width: 200px"
                  />
                  <a-checkbox
                    v-model:checked="form.isLicenseLongTerm"
                    @change="handleLicenseLongTermChange"
                  >
                    长期有效
                  </a-checkbox>
                </a-space>
              </a-form-item>
            </a-space>
          </a-form-item>
        </template>

        <a-divider orientation="left">法人信息</a-divider>
        <a-form-item label="身份证正面照片" name="idCardFront">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :custom-request="uploadOssFileFront"
            :before-upload="beforeUploadFront"
            @change="handleChangeFront"
          >
            <div v-if="form.idCardFrontUrl">
              <img :src="form.idCardFrontUrl" alt="avatar" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="身份证反面照片" name="idCardBack">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :custom-request="uploadOssFileBack"
            :before-upload="beforeUploadBack"
            @change="handleChangeBack"
          >
            <div v-if="form.idCardBackUrl">
              <img :src="form.idCardBackUrl" alt="avatar" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>
        <a-form-item label="姓名" name="legalPerson">
          <a-input v-model:value="form.legalPerson" :disabled="showable" placeholder="请输入姓名" />
        </a-form-item>
        <a-form-item label="身份证类型" name="idType">
          <a-radio-group v-model:value="form.idType" :disabled="showable">
            <a-radio value="1">身份证</a-radio>
            <a-radio value="2">护照</a-radio>
            <a-radio value="3">港澳台居民居住证</a-radio>
            <a-radio value="4">其他</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="身份证号" name="idNo">
          <a-input v-model:value="form.idNo" :disabled="showable" placeholder="请输入身份证号" />
        </a-form-item>

        <a-form-item label="身份证有效期">
          <a-space direction="vertical" :size="12">
            <a-form-item label="有效期开始" name="idCardStartDate" style="margin-bottom: 0">
              <a-date-picker
                v-model:value="form.idCardStartDate"
                :disabled="showable"
                placeholder="请选择开始日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </a-form-item>
            <a-form-item label="有效期结束" name="idCardEndDate" style="margin-bottom: 0">
              <a-space>
                <a-date-picker
                  v-model:value="form.idCardEndDate"
                  :disabled="showable"
                  placeholder="请选择结束日期"
                  value-format="YYYY-MM-DD"
                  style="width: 200px"
                />
                <a-checkbox
                  v-model:checked="form.isIdCardLongTerm"
                  :disabled="showable"
                  @change="handleIdCardLongTermChange"
                >
                  长期有效
                </a-checkbox>
              </a-space>
            </a-form-item>
          </a-space>
        </a-form-item>

        <a-form-item label="身份证地址" name="idCardAddress">
          <a-textarea
            v-model:value="form.idCardAddress"
            :disabled="showable"
            placeholder="请输入身份证地址"
            :rows="3"
          />
        </a-form-item>
        <a-form-item label="联系电话" name="contact">
          <a-input v-model:value="form.contact" :disabled="showable" placeholder="请输入联系电话" />
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
  import { nextTick, ref, computed } from 'vue'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicDrawer } from '@/components/Drawer'
  import { UploadProps } from 'ant-design-vue'
  import { getUploadParams, saveOssFileInfo } from '@/views/baseapi/file/upload/FileUpload.api'
  import { useUpload } from '@/hooks/bootx/useUpload'
  import { useMessage } from '@/hooks/web/useMessage'
  import { saveSubjectInfo, getMerchantInfo } from './Merchant.api'

  // 这里的 MchApp 建议根据实际业务字段重新定义或扩展
  interface SubjectForm {
    mchId?: string
    mchNo?: string
    mchType: string
    mchName: string
    mchShortName: string
    idCardFrontUrl: string
    idCardBackUrl: string
    legalPerson: string
    idNo: string
    idType: string
    isIdCardLongTerm: boolean
    idCardStartDate: string | null
    idCardEndDate: string | null
    idCardAddress: string
    contact: string
    // 营业执照信息
    licenseImageUrl: string
    licenseNumber: string
    licenseName: string
    licenseAddress: string
    licenseStartDate: string | null
    licenseEndDate: string | null
    isLicenseLongTerm: boolean
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

  // 防止重复提交
  const submitting = ref(false)

  // 表单初始化
  const formRef = ref<FormInstance>()
  const form = ref<SubjectForm>({
    mchId: '',
    mchNo: '',
    mchType: 'micro',
    mchName: '',
    mchShortName: '',
    idCardFrontUrl: '',
    idCardBackUrl: '',
    legalPerson: '',
    idNo: '',
    idType: '1',
    isIdCardLongTerm: false,
    idCardStartDate: null,
    idCardEndDate: null,
    idCardAddress: '',
    contact: '',
    // 营业执照信息
    licenseImageUrl: '',
    licenseNumber: '',
    licenseName: '',
    licenseAddress: '',
    licenseStartDate: null,
    licenseEndDate: null,
    isLicenseLongTerm: false,
  })

  const { createMessage } = useMessage()

  const { uploadFileToOss, getFileUrl } = useUpload()

  const uploadUrlFront = ref<string>()

  const uploadHeaderFront = ref<Map<string, string>>()

  const uploadAttachNameFront = ref<string>()

  const uploadUrlBack = ref<string>()

  const uploadHeaderBack = ref<Map<string, string>>()

  const uploadAttachNameBack = ref<string>()

  // 营业执照上传相关变量
  const uploadUrlLicense = ref<string>()

  const uploadHeaderLicense = ref<Map<string, string>>()

  const uploadAttachNameLicense = ref<string>()

  // 校验规则
  const rules = computed(
    () =>
      ({
        mchType: [{ required: true, message: '请选择商户类型' }],
        mchName: [{ required: true, message: '请输入商户全称' }],
        mchShortName: [{ required: true, message: '请输入商户简称' }],
        legalPerson: [{ required: true, message: '请输入姓名' }],
        idNo: [{ required: true, message: '请输入身份证号' }],
        idType: [{ required: true, message: '请选择证件类型' }],
        idCardStartDate: [{ required: true, message: '请选择身份证有效期开始日期' }],
        idCardEndDate: [{ required: true, message: '请选择身份证有效期结束日期' }],
        idCardAddress: [{ required: true, message: '请输入身份证地址' }],
        contact: [{ required: true, message: '请输入联系电话' }],
        licenseImageUrl:
          form.value.mchType === 'micro' ? [] : [{ required: true, message: '请上传营业执照' }],
        licenseNumber:
          form.value.mchType === 'micro' ? [] : [{ required: true, message: '请输入营业执照号' }],
        licenseName:
          form.value.mchType === 'micro' ? [] : [{ required: true, message: '请输入营业执照名称' }],
        licenseAddress:
          form.value.mchType === 'micro' ? [] : [{ required: true, message: '请输入营业执照地址' }],
        licenseStartDate:
          form.value.mchType === 'micro'
            ? []
            : [{ required: true, message: '请选择营业执照有效期开始日期' }],
        licenseEndDate:
          form.value.mchType === 'micro'
            ? []
            : [{ required: true, message: '请选择营业执照有效期结束日期' }],
      }) as Record<string, Rule[]>,
  )

  const emits = defineEmits(['ok'])

  /**
   * 执照长期有效状态改变时的处理函数
   */
  const handleLicenseLongTermChange = () => {
    if (form.value.isLicenseLongTerm) {
      form.value.licenseEndDate = '9999-12-31'
    } else {
      form.value.licenseEndDate = null
    }
  }

  /**
   * 身份证长期有效状态改变时的处理函数
   */
  const handleIdCardLongTermChange = () => {
    if (form.value.isIdCardLongTerm) {
      form.value.idCardEndDate = '9999-12-31'
    } else {
      form.value.idCardEndDate = null
    }
  }

  /**
   * 入口
   */
  function init(mchId: string, mchNo?: string, editType?: FormEditType) {
    initFormEditType(editType || FormEditType.Edit)
    resetForm()
    // 读取商户详情
    getMerchantInfo(mchId)
      .then(({ data }) => {
        form.value = {
          ...form.value,
          ...data,
        }
        form.value.mchId = mchId

        // 如果执照长期有效，则设置结束日期为9999-12-31
        if (form.value.isLicenseLongTerm && !form.value.licenseEndDate) {
          form.value.licenseEndDate = '9999-12-31'
        }

        // 如果身份证长期有效，则设置结束日期为9999-12-31
        if (form.value.isIdCardLongTerm && !form.value.idCardEndDate) {
          form.value.idCardEndDate = '9999-12-31'
        }
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function handleOk() {
    // 防止重复提交
    if (submitting.value) {
      return
    }

    submitting.value = true

    formRef.value
      ?.validate()
      .then(async () => {
        const data = { ...form.value }

        // 如果身份证长期有效，但用户取消了长期有效选项，需要处理
        if (!data.isIdCardLongTerm && data.idCardEndDate === '9999-12-31') {
          data.idCardEndDate = null
        }

        // 如果执照长期有效，但用户取消了长期有效选项，需要处理
        if (!data.isLicenseLongTerm && data.licenseEndDate === '9999-12-31') {
          data.licenseEndDate = null
        }

        if (data.mchId == null || data.mchId == '') {
          createMessage.error('商户ID不能为空')
          submitting.value = false
          return
        }
        try {
          createMessage.loading({ content: '正在提交数据...', key: 'save', duration: 0 })
          await saveSubjectInfo(data)
          createMessage.success({ content: '保存成功', key: 'save' })
          emits('ok', data)
          handleCancel()
        } catch (error: any) {
          createMessage.error({ content: error?.msg || '保存失败', key: 'save' })
        } finally {
          submitting.value = false
        }
      })
      .catch(() => {
        submitting.value = false
      })
  }

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

  const beforeUploadBack: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlBack.value = data.url
        uploadHeaderBack.value = data.headers
        uploadAttachNameBack.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  const beforeUploadLicense: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlLicense.value = data.url
        uploadHeaderLicense.value = data.headers
        uploadAttachNameLicense.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  /**
   * 营业执照上传
   */
  async function uploadLicenseImage(action: any) {
    uploadFileToOss(action.file, uploadUrlLicense.value as string, uploadHeaderLicense.value).then(
      () => {
        const file = action.file
        saveOssFileInfo({
          url: `${uploadAttachNameLicense.value}`,
          size: file.size,
          originalFilename: file.name,
          filename: uploadAttachNameLicense.value,
          contentType: file.type,
        }).then(() => {
          createMessage.success(`${file.name} 上传成功!`)
          form.value.licenseImageUrl = getFileUrl(uploadAttachNameLicense.value)
        })
      },
    )
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
          form.value.idCardFrontUrl = getFileUrl(uploadAttachNameFront.value)
        })
      },
    )
  }

  async function uploadOssFileBack(action: any) {
    uploadFileToOss(action.file, uploadUrlBack.value as string, uploadHeaderBack.value).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameBack.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameBack.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.idCardBackUrl = getFileUrl(uploadAttachNameBack.value)
      })
    })
  }

  function handleChangeFront(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  function handleChangeBack(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  function handleChangeLicense(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  defineExpose({
    init,
  })
</script>

<style lang="less" scoped>
  /* 调整分割线间距 */
  :deep(.ant-divider-horizontal.ant-divider-with-text) {
    margin: 24px 0;
    font-size: 16px;
    font-weight: bold;
  }
</style>
