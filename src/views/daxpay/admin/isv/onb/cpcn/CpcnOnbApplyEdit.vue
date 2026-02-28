<template>
  <basic-drawer
    width="100%"
    title="中金支付进件申请"
    :open="visible"
    @close="visible = false"
    showFooter
  >
    <a-steps :current="currentStep" class="p-10 bg-gray-50">
      <a-step title="主体信息" />
      <a-step title="经营信息" />
      <a-step title="结算账户" />
    </a-steps>

    <div class="p-10 overflow-y-auto" style="height: calc(100vh - 250px)">
      <a-form :model="form" layout="vertical" ref="formRef">
        <!-- 主体信息部分 -->
        <div v-show="currentStep === 0">
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="商户类型" name="userType">
                <a-radio-group v-model:value="form.userType">
                  <a-radio value="11">小微商户</a-radio>
                  <a-radio value="13">个体工商户</a-radio>
                  <a-radio value="12">企业</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="商户简称" name="shortName">
                <a-input v-model:value="form.shortName" placeholder="请输入商户简称" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="24">
            <a-col :span="12">
              <a-form-item label="管理员手机号" name="managePhoneNumber">
                <a-input v-model:value="form.managePhoneNumber" placeholder="请输入管理员手机号" />
              </a-form-item>
            </a-col>
          </a-row>

          <!-- 营业执照信息（非小微商户） -->
          <template v-if="form.mchType !== '11'">
            <a-divider orientation="left">
              <h3 class="font-bold mb-4 text-blue-600">营业执照信息</h3>
            </a-divider>

            <a-form-item label="营业执照号" name="licenseNumber">
              <a-input v-model:value="form.licenseNumber" placeholder="请输入营业执照号" />
            </a-form-item>

            <a-form-item label="营业执照名称" name="licenseName">
              <a-input v-model:value="form.licenseName" placeholder="请输入营业执照名称" />
            </a-form-item>

            <a-form-item label="注册详细地址" name="licenseAddress">
              <a-textarea
                v-model:value="form.licenseAddress"
                placeholder="请输入营业执照注册详细地址"
                :rows="3"
              />
            </a-form-item>

            <a-form-item label="单位性质" name="corpNature">
              <a-select v-model:value="form.corpNature" placeholder="请选择单位性质">
                <a-select-option value="01">私营</a-select-option>
                <a-select-option value="02">国有控股</a-select-option>
                <a-select-option value="03">国资参股</a-select-option>
                <a-select-option value="04">事业单位</a-select-option>
                <a-select-option value="05">外商独资</a-select-option>
                <a-select-option value="06">有限合伙</a-select-option>
                <a-select-option value="07">集体所有制</a-select-option>
                <a-select-option value="08">其他</a-select-option>
              </a-select>
            </a-form-item>

            <a-form-item label="执照有效期" name="licenseEndDate">
              <a-space>
                <a-date-picker
                  v-model:value="form.periodStartDate"
                  placeholder="请选择开始日期"
                  value-format="YYYYMMDD"
                />
                <a-date-picker
                  v-model:value="form.periodEndDate"
                  :disabled="form.isLicenseLongTerm"
                  placeholder="请选择结束日期"
                  value-format="YYYYMMDD"
                />
                <a-checkbox
                  v-model:checked="form.isLicenseLongTerm"
                  @change="handleLicenseLongTermChange"
                >
                  长期有效
                </a-checkbox>
              </a-space>
            </a-form-item>
            <a-form-item label="营业执照照片" name="licenseImage">
              <a-upload
                name="file"
                list-type="picture-card"
                :show-upload-list="false"
                :customRequest="uploadLicenseImage"
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
          </template>

          <!-- 法人信息 -->
          <a-divider orientation="left">
            <h3 class="font-bold mb-4 text-blue-600">法人/经营者信息</h3>
          </a-divider>

          <a-form-item label="姓名" name="legalIdName">
            <a-input v-model:value="form.legalIdName" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item label="身份证号" name="legalIdNumber">
            <a-input v-model:value="form.legalIdNumber" placeholder="请输入身份证号" />
          </a-form-item>
          <a-form-item label="身份证有效期" name="idCardValidDate">
            <a-space>
              <a-date-picker
                v-model:value="form.legalIdBeginDate"
                placeholder="请选择开始日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
              <a-date-picker
                v-model:value="form.legalIdEndDate"
                :disabled="form.idCardLongTerm"
                placeholder="请选择结束日期"
                value-format="YYYYMMDD"
                style="width: 100%"
              />
              <a-checkbox
                v-model:checked="form.isLegalIdLongTerm"
                @change="handleLegalIdLongTermChange"
              >
                长期有效
              </a-checkbox>
            </a-space>
          </a-form-item>
          <a-form-item label="身份证地址" name="legalIdAddress">
            <a-textarea
              v-model:value="form.legalIdAddress"
              placeholder="请输入身份证地址"
              :rows="3"
            />
          </a-form-item>
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="身份证正面照片" name="legalIdFront">
                <a-upload
                  list-type="picture-card"
                  :show-upload-list="false"
                  :customRequest="uploadOssFileFront"
                  :before-upload="beforeUploadFront"
                  @change="handleChangeFront"
                >
                  <div v-if="form.legalIdFrontUrl">
                    <img :src="form.legalIdFrontUrl" alt="身份证正面" style="width: 100%" />
                  </div>
                  <div v-else>
                    <plus-outlined />
                    <div style="margin-top: 8px">上传图片</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="身份证反面照片" name="legalIdBack">
                <a-upload
                  list-type="picture-card"
                  :show-upload-list="false"
                  :customRequest="uploadOssFileBack"
                  :before-upload="beforeUploadBack"
                  @change="handleChangeBack"
                >
                  <div v-if="form.legalIdBackUrl">
                    <img :src="form.legalIdBackUrl" alt="身份证反面" style="width: 100%" />
                  </div>
                  <div v-else>
                    <plus-outlined />
                    <div style="margin-top: 8px">上传图片</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 经营信息部分 -->
        <div v-show="currentStep === 1">
          <a-divider orientation="left">
            <h3 class="font-bold mb-4 text-blue-600">经营信息</h3>
          </a-divider>

          <a-form-item label="经营类型">
            <a-radio-group v-model:value="form.bizType">
              <a-radio value="OFFLINE">线下</a-radio>
              <a-radio value="ONLINE">线上</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="门店名称">
            <a-input v-model:value="form.storeName" placeholder="请输入门店名称" />
          </a-form-item>

          <a-form-item label="服务电话" name="servicePhone">
            <a-input v-model:value="form.servicePhone" placeholder="请输入服务电话" />
          </a-form-item>

          <a-form-item label="营业范围">
            <a-select v-model:value="form.bizScope" placeholder="请选择营业范围">
              <a-select-option value="1">餐饮</a-select-option>
              <a-select-option value="2">零售</a-select-option>
              <a-select-option value="3">服务</a-select-option>
              <a-select-option value="4">其他</a-select-option>
            </a-select>
          </a-form-item>

          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="商户门头图片">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  :show-upload-list="false"
                  :customRequest="uploadStoreDoor"
                  :before-upload="beforeUploadStoreDoor"
                  @change="handleChangeStoreDoor"
                >
                  <div v-if="form.storeDoorImg">
                    <img :src="form.storeDoorImg" alt="门头图片" style="width: 100%" />
                  </div>
                  <div v-else>
                    <plus-outlined />
                    <div style="margin-top: 8px">上传照片</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="营业场所室内照片">
                <a-upload
                  name="file"
                  list-type="picture-card"
                  :show-upload-list="false"
                  :customRequest="uploadStoreInner"
                  :before-upload="beforeUploadStoreInner"
                  @change="handleChangeStoreInner"
                >
                  <div v-if="form.storeInnerImg">
                    <img :src="form.storeInnerImg" alt="室内照片" style="width: 100%" />
                  </div>
                  <div v-else>
                    <plus-outlined />
                    <div style="margin-top: 8px">上传照片</div>
                  </div>
                </a-upload>
              </a-form-item>
            </a-col>
          </a-row>
        </div>

        <!-- 结算账户部分 -->
        <div v-show="currentStep === 2">
          <a-divider orientation="left">
            <h3 class="font-bold mb-4 text-blue-600">结算账户</h3>
          </a-divider>

          <a-form-item label="账户类型">
            <a-radio-group v-model:value="form.bankAccountType">
              <a-radio value="PUBLIC">公户</a-radio>
              <a-radio value="PRIVATE">对私法人</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item label="开户银行代码">
            <a-input v-model:value="form.bankId" placeholder="请输入开户银行代码" />
          </a-form-item>

          <a-form-item label="银行联行号">
            <a-input v-model:value="form.cnapsCode" placeholder="请输入银行联行号" />
          </a-form-item>

          <a-form-item label="银行预留电话">
            <a-input v-model:value="form.bankPhoneNumber" placeholder="请输入银行预留电话" />
          </a-form-item>

          <a-form-item label="银行卡开户名">
            <a-input v-model:value="form.bankAccountName" placeholder="请输入银行卡开户名" />
          </a-form-item>

          <a-form-item label="银行卡号">
            <a-input v-model:value="form.bankAccountNumber" placeholder="请输入银行卡号" />
          </a-form-item>

          <a-form-item label="银行卡正面">
            <a-upload
              name="file"
              list-type="picture-card"
              :show-upload-list="false"
              :customRequest="uploadBankCard"
              :before-upload="beforeUploadBankCard"
              @change="handleChangeBankCard"
            >
              <div v-if="form.bankCardImg">
                <img :src="form.bankCardImg" alt="银行卡正面" style="width: 100%" />
              </div>
              <div v-else>
                <plus-outlined />
                <div style="margin-top: 8px">上传照片</div>
              </div>
            </a-upload>
          </a-form-item>
        </div>
      </a-form>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <a-button @click="loadFromMchBase" type="dashed" class="blue-dashed-btn"
          >读取商户资料</a-button
        >
        <a-space>
          <a-button v-if="currentStep > 0" @click="currentStep--">上一步</a-button>
          <a-button v-if="currentStep < 2" type="primary" @click="currentStep++">下一步</a-button>
          <a-button v-if="!currentApplyId" type="primary" @click="handleSave" :loading="loading"
            >暂存</a-button
          >
          <a-button
            v-if="currentStep === 2"
            type="dashed"
            @click="handleSubmit"
            class="red-dashed-btn"
            >保存申请单</a-button
          >
        </a-space>
      </div>
    </template>
  </basic-drawer>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import { BasicDrawer } from '@/components/Drawer'
  import { PlusOutlined } from '@ant-design/icons-vue'
  import { getMchBaseData, update, get } from '../MchOnbApply.api'
  import { message, UploadProps } from 'ant-design-vue'
  import { getUploadParams, saveOssFileInfo } from '@/views/baseapi/file/upload/FileUpload.api'
  import { useUpload } from '@/hooks/bootx/useUpload'
  import { useMessage } from '@/hooks/web/useMessage'

  const visible = ref(false)
  const currentStep = ref(0)
  const loading = ref(false)
  const form = ref<any>({})
  const currentApplyId = ref()
  const currentChannel = ref()
  const currentMchNo = ref()

  const { createMessage } = useMessage()
  const { uploadFileToOss, getFileUrl } = useUpload()

  // 上传相关变量
  const uploadUrlFront = ref<string>()
  const uploadHeaderFront = ref<Map<string, string>>()
  const uploadAttachNameFront = ref<string>()

  const uploadUrlBack = ref<string>()
  const uploadHeaderBack = ref<Map<string, string>>()
  const uploadAttachNameBack = ref<string>()

  const uploadUrlLicense = ref<string>()
  const uploadHeaderLicense = ref<Map<string, string>>()
  const uploadAttachNameLicense = ref<string>()

  const uploadUrlStoreDoor = ref<string>()
  const uploadHeaderStoreDoor = ref<Map<string, string>>()
  const uploadAttachNameStoreDoor = ref<string>()

  const uploadUrlStoreInner = ref<string>()
  const uploadHeaderStoreInner = ref<Map<string, string>>()
  const uploadAttachNameStoreInner = ref<string>()

  const uploadUrlBankCard = ref<string>()
  const uploadHeaderBankCard = ref<Map<string, string>>()
  const uploadAttachNameBankCard = ref<string>()

  // 初始化表单
  async function init(id, channel) {
    visible.value = true
    currentApplyId.value = id
    currentChannel.value = channel
    currentStep.value = 0

    if (id) {
      // 如果有id，则获取进件单详情
      try {
        const { data } = await get(id)
        currentMchNo.value = data.mchNo
        if (data.applyData) {
          // 从applyData中解析表单数据
          const formData = JSON.parse(data.applyData)
          form.value = {
            ...form.value,
            ...formData,
          }
        } else {
          //...
          resetForm()
        }
      } catch (error) {
        console.error('获取进件单详情失败:', error)
      }
    } else {
      //...
      resetForm()
    }
  }

  // 表单重置
  function resetForm() {
    // 初始化为空表单
    form.value = {
      // 基础信息
      userType: '', // 商户类型
      shortName: '', // 商户简称
      managePhoneNumber: '', // 管理员手机号

      // 营业执照信息（非小微商户）
      licenseImageUrl: '', // 营业执照照片URL
      licenseNumber: '', // 营业执照号
      licenseName: '', // 营业执照名称
      licenseAddress: '', // 注册详细地址
      corpNature: '', // 单位性质
      periodStartDate: '', // 执照有效期开始
      periodEndDate: '', // 执照有效期结束
      isLicenseLongTerm: false, // 执照是否长期有效

      // 法人信息
      legalIdFrontUrl: '', // 身份证正面照片URL
      legalIdBackUrl: '', // 身份证反面照片URL
      legalIdName: '', // 姓名
      legalIdNumber: '', // 身份证号
      isLegalIdLongTerm: false, // 身份证是否长期有效
      legalIdBeginDate: '', // 身份证有效期开始
      legalIdEndDate: '', // 身份证有效期结束
      legalIdAddress: '', // 身份证地址

      // 经营信息
      bizType: 'OFFLINE', // 经营类型 (OFFLINE线上, ONLINE线下)
      storeName: '', // 门店名称
      bizScope: '', // 营业范围
      storeDoorImg: '', // 商户门头图片URL
      storeInnerImg: '', // 营业场所室内照片URL

      // 结算账户
      bankAccountType: 'PRIVATE', // 账户类型 (PUBLIC公户, PRIVATE对私法人)
      bankCardImg: '', // 银行卡正面图片URL
      bankAccountName: '', // 银行卡开户名
      bankAccountNumber: '', // 银行卡号
    }
  }

  // 上传前的处理 - 身份证正面
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

  // 上传前的处理 - 身份证反面
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

  // 上传前的处理 - 营业执照
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

  // 上传前的处理 - 门头照片
  const beforeUploadStoreDoor: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlStoreDoor.value = data.url
        uploadHeaderStoreDoor.value = data.headers
        uploadAttachNameStoreDoor.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  // 上传前的处理 - 室内照片
  const beforeUploadStoreInner: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlStoreInner.value = data.url
        uploadHeaderStoreInner.value = data.headers
        uploadAttachNameStoreInner.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  // 上传前的处理 - 银行卡照片
  const beforeUploadBankCard: UploadProps['beforeUpload'] = async (file) => {
    await getUploadParams({
      fileName: file.name,
      mediaType: file.type || '*/*',
      fileSize: file.size,
    })
      .then(({ data }) => {
        uploadUrlBankCard.value = data.url
        uploadHeaderBankCard.value = data.headers
        uploadAttachNameBankCard.value = data.attachName
      })
      .catch((error) => {
        createMessage.error(`${error.msg}`)
      })
  }

  // 上传身份证正面
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
          form.value.legalIdFrontUrl = getFileUrl(uploadAttachNameFront.value)
        })
      },
    )
  }

  // 上传身份证反面
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
        form.value.legalIdBackUrl = getFileUrl(uploadAttachNameBack.value)
      })
    })
  }

  // 上传营业执照
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

  // 上传门头照片
  async function uploadStoreDoor(action: any) {
    uploadFileToOss(
      action.file,
      uploadUrlStoreDoor.value as string,
      uploadHeaderStoreDoor.value,
    ).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameStoreDoor.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameStoreDoor.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.storeDoorImg = getFileUrl(uploadAttachNameStoreDoor.value)
      })
    })
  }

  // 上传室内照片
  async function uploadStoreInner(action: any) {
    uploadFileToOss(
      action.file,
      uploadUrlStoreInner.value as string,
      uploadHeaderStoreInner.value,
    ).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameStoreInner.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameStoreInner.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.storeInnerImg = getFileUrl(uploadAttachNameStoreInner.value)
      })
    })
  }

  // 上传银行卡照片
  async function uploadBankCard(action: any) {
    uploadFileToOss(
      action.file,
      uploadUrlBankCard.value as string,
      uploadHeaderBankCard.value,
    ).then(() => {
      const file = action.file
      saveOssFileInfo({
        url: `${uploadAttachNameBankCard.value}`,
        size: file.size,
        originalFilename: file.name,
        filename: uploadAttachNameBankCard.value,
        contentType: file.type,
      }).then(() => {
        createMessage.success(`${file.name} 上传成功!`)
        form.value.bankCardImg = getFileUrl(uploadAttachNameBankCard.value)
      })
    })
  }

  // 处理上传变化
  function handleChangeFront(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  // 处理营业执照长期有效变化
  function handleLicenseLongTermChange(checked: boolean) {
    if (checked) {
      form.value.periodEndDate = '99991231' // 设置为99991231
    }
  }

  // 处理身份证长期有效变化
  function handleLegalIdLongTermChange(checked: boolean) {
    if (checked) {
      form.value.legalIdEndDate = '99991231' // 设置为99991231
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

  function handleChangeStoreDoor(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  function handleChangeStoreInner(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  function handleChangeBankCard(info) {
    if (info.file.status === 'error') {
      createMessage.error('上传失败')
    }
  }

  // 核心功能：读取填充
  async function loadFromMchBase() {
    loading.value = true
    try {
      const { data } = await getMchBaseData(currentMchNo.value)
      // 将商户基础资料映射到进件材料表单
      form.value = {
        ...form.value,
        ...data,
      }
      message.success('已成功同步商户基础资料')
    } finally {
      loading.value = false
    }
  }

  async function handleSave() {
    await update({
      id: currentApplyId.value,
      status: 'draft',
      applyData: JSON.stringify(form.value),
    })
    message.success('暂存成功')
  }

  async function handleSubmit() {
    await update({ id: currentApplyId.value, status: 'new', applyData: JSON.stringify(form.value) })
    message.success('提交成功')
    visible.value = false
  }

  defineExpose({ init })
</script>

<style>
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }

  .ant-upload-select-picture-card i {
    color: #999;
    font-size: 32px;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }

  .red-dashed-btn {
    border-color: #ff4d4f; /* 红色边框 */
    color: #ff4d4f; /* 红色文字 */
  }

  .red-dashed-btn:hover,
  .red-dashed-btn:focus {
    border-color: #ff7875; /* 浅红色边框 */
    background: transparent;
    color: #ff7875; /* 浅红色文字 */
  }

  .blue-dashed-btn {
    border-color: #3b07f8; /* 红色边框 */
    color: #4f08f7; /* 红色文字 */
  }

  .blue-dashed-btn:hover,
  .blue-dashed-btn:focus {
    border-color: #3a12ec; /* 浅红色边框 */
    background: transparent;
    color: #340af0; /* 浅红色文字 */
  }
</style>
