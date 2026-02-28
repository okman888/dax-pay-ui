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
        <a-divider orientation="left">经营信息</a-divider>

        <a-form-item label="场所名称" name="storeName">
          <a-input
            v-model:value="form.storeName"
            :disabled="showable"
            placeholder="请输入经营场所名称"
          />
        </a-form-item>

        <a-form-item label="经营类型" name="businessType">
          <a-select
            v-model:value="form.businessType"
            :options="businessTypeList"
            :disabled="showable"
            placeholder="请选择经营类型"
            style="width: 100%"
            allow-clear
          />
        </a-form-item>

        <a-form-item label="服务电话" name="servicePhone">
          <a-input
            v-model:value="form.servicePhone"
            :disabled="showable"
            placeholder="请输入服务电话"
          />
        </a-form-item>

        <a-form-item label="所在区域" name="region">
          <cascader
            style="width: 100%"
            change-on-select
            v-model:value="form.region"
            :field-names="fieldNames"
            :options="regionOptions"
            :disabled="showable"
            placeholder="请选择省市区"
            @change="handleRegionChange"
          />
        </a-form-item>

        <a-form-item label="详细地址" name="detailedAddress">
          <a-textarea
            v-model:value="form.detailedAddress"
            :disabled="showable"
            placeholder="请输入详细地址"
            :rows="3"
          />
        </a-form-item>

        <a-form-item label="门头照片" name="storeDoorImgUrl">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileStoreFront"
            :before-upload="beforeUploadStoreFront"
            @change="handleStoreFrontChange"
          >
            <div v-if="form.storeDoorImgUrl">
              <img :src="form.storeDoorImgUrl" alt="门头照" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="室内照片" name="storeInnerImgUrl">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileStoreInterior"
            :before-upload="beforeUploadStoreInterior"
            @change="handleStoreInteriorChange"
          >
            <div v-if="form.storeInnerImgUrl">
              <img :src="form.storeInnerImgUrl" alt="室内照" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
        </a-form-item>

        <a-form-item label="收银台照片" name="cashierDeskImgUrl">
          <a-upload
            list-type="picture-card"
            :show-upload-list="false"
            :disabled="showable"
            :customRequest="uploadOssFileCashier"
            :before-upload="beforeUploadCashier"
            @change="handleCashierChange"
          >
            <div v-if="form.cashierDeskImgUrl">
              <img :src="form.cashierDeskImgUrl" alt="收银台照" style="width: 100%" />
            </div>
            <div v-else>
              <plus-outlined />
              <div style="margin-top: 8px">上传图片</div>
            </div>
          </a-upload>
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
  import { nextTick, reactive, ref, onMounted } from 'vue'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import useFormEdit from '@/hooks/bootx/useFormEdit'
  import { FormInstance, Rule } from 'ant-design-vue/lib/form'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { BasicDrawer } from '@/components/Drawer'
  import { UploadProps } from 'ant-design-vue'
  import { getUploadParams, saveOssFileInfo } from '@/views/baseapi/file/upload/FileUpload.api'
  import { useUpload } from '@/hooks/bootx/useUpload'
  import { useMessage } from '@/hooks/web/useMessage'
  import { saveBusinessInfo, getBusinessInfo } from './merchant.api'
  import { Cascader } from 'ant-design-vue'
  import { findAllProvinceAndCityAndArea, Region } from '@/api/common/ChinaRegion.api'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'

  // 定义经营信息数据结构
  interface BusinessForm {
    id?: string
    storeName: string
    businessType: string
    servicePhone: string
    region: string[]
    province: string
    city: string
    area: string
    detailedAddress: string
    storeDoorImgUrl: string
    storeInnerImgUrl: string
    cashierDeskImgUrl: string
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

  // 表单引用
  const formRef = ref<FormInstance>()

  // 初始化数据
  const form = ref<BusinessForm>({
    mchId: '',
    mchNo: '',
    storeName: '',
    businessType: '',
    servicePhone: '',
    region: [],
    province: '',
    city: '',
    area: '',
    detailedAddress: '',
    storeDoorImgUrl: '',
    storeInnerImgUrl: '',
    cashierDeskImgUrl: '',
  })

  // 省市区数据
  const regionOptions = ref<Region[]>([])
  
  // 级联选择器字段映射
  const fieldNames = {
    label: 'name',
    value: 'code',
    children: 'children',
  }
  
  // 加载省市区数据和经营类型字典
  onMounted(() => {
    findAllProvinceAndCityAndArea().then(({ data }) => {
      regionOptions.value = data
    })
    
    // 加载经营类型字典
    dictDropDown('business_type').then((res) => {
      businessTypeList.value = res
    })
  })

  // 校验规则
  const rules = reactive({
    storeName: [{ required: true, message: '请输入经营场所名称' }],
    businessType: [{ required: true, message: '请选择经营类型' }],
    region: [{ required: true, message: '请选择省市区', type: 'array' }],
    detailedAddress: [{ required: true, message: '请输入详细地址' }],
  } as Record<string, Rule[]>)

  const { createMessage } = useMessage()
  const { dictDropDown } = useDict()

  const { uploadFileToOss, getFileUrl } = useUpload()

  // 经营类型字典列表
  const businessTypeList = ref<LabeledValue[]>([])

  const uploadUrlStoreFront = ref<string>()
  const uploadHeaderStoreFront = ref<Map<string, string>>()
  const uploadAttachNameStoreFront = ref<string>()

  const uploadUrlStoreInterior = ref<string>()
  const uploadHeaderStoreInterior = ref<Map<string, string>>()
  const uploadAttachNameStoreInterior = ref<string>()

  const uploadUrlCashier = ref<string>()
  const uploadHeaderCashier = ref<Map<string, string>>()
  const uploadAttachNameCashier = ref<string>()

  const emits = defineEmits(['ok'])

  /**
   * 初始化
   */
  function init(mchId: string, editType: FormEditType) {
    initFormEditType(editType)
    resetForm()
    
    getBusinessInfo(mchId)
      .then(({ data }) => {
        if (data) {
          form.value = {
            ...form.value,
            ...data,
          }
          form.value.mchId = mchId
          // 设置区域选择器值
          if (data.province && data.city && data.area) {
            // 这里需要根据省份、城市、区县名称找到对应的code值
            // 暂时设置为空，后续可以根据实际需求实现code查找逻辑
            form.value.region = [data.province, data.city, data.area]
          }
        }
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
    
  }

  /**
   * 提交表单
   */
  async function handleOk() {
    formRef.value?.validate().then(async () => {
      try {
        await saveBusinessInfo(form.value)
        createMessage.success('保存成功')
        emits('ok', form.value)
        handleCancel()
      } catch (error: any) {
        createMessage.error(error?.msg || '保存失败')
      }
    })
  }

  /**
   * 区域选择变化处理
   */
  function handleRegionChange(value: string[], selectedOptions: any[]) {
    if (value.length >= 1) {
      form.value.province = selectedOptions[0]?.name || ''
    }
    if (value.length >= 2) {
      form.value.city = selectedOptions[1]?.name || ''
    }
    if (value.length >= 3) {
      form.value.area = selectedOptions[2]?.name || ''
    }
  }

  /**
   * 重置表单
   */
  function resetForm() {
    nextTick(() => {
      formRef.value?.resetFields()
    })
  }

  const beforeUploadStoreFront: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlStoreFront.value = data.url
        uploadHeaderStoreFront.value = data.headers
        uploadAttachNameStoreFront.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileStoreFront(action: any) {
    uploadFileToOss(
      action.file,
      uploadUrlStoreFront.value as string,
      uploadHeaderStoreFront.value,
    ).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameStoreFront.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameStoreFront.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.storeDoorImgUrl = getFileUrl(uploadAttachNameStoreFront.value)
      })
    })
  }

  function handleStoreFrontChange(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  const beforeUploadStoreInterior: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlStoreInterior.value = data.url
        uploadHeaderStoreInterior.value = data.headers
        uploadAttachNameStoreInterior.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileStoreInterior(action: any) {
    uploadFileToOss(
      action.file,
      uploadUrlStoreInterior.value as string,
      uploadHeaderStoreInterior.value,
    ).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameStoreInterior.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameStoreInterior.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.storeInnerImgUrl = getFileUrl(uploadAttachNameStoreInterior.value)
      })
    })
  }

  function handleStoreInteriorChange(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  const beforeUploadCashier: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlCashier.value = data.url
        uploadHeaderCashier.value = data.headers
        uploadAttachNameCashier.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  async function uploadOssFileCashier(action: any) {
    uploadFileToOss(action.file, uploadUrlCashier.value as string, uploadHeaderCashier.value).then(
      () => {
        const file = action.file
        saveOssFileInfo({
          url: `${uploadAttachNameCashier.value}`,
          size: file.size,
          originalFilename: file.name,
          filename: uploadAttachNameCashier.value,
          contentType: file.type,
        }).then(() => {
          createMessage.success(`${file.name} 上传成功!`)
          form.value.cashierDeskImgUrl = getFileUrl(uploadAttachNameCashier.value)
        })
      },
    )
  }

  function handleCashierChange(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
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
