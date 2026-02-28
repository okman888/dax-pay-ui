<template>
  <div class="withdraw-add">
    <div class="m-3 p-3 bg-white">
      <a-card title="新增渠道提现">
        <a-form
          :model="withdrawForm"
          :rules="rules"
          ref="withdrawFormRef"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="渠道" name="channel">
            <a-select
              v-model:value="withdrawForm.channel"
              placeholder="请选择渠道"
              @change="handleChannelChange"
            >
              <a-select-option value="CPCN_PAY">中金支付</a-select-option>
              <!-- 其他渠道选项 -->
            </a-select>
          </a-form-item>

          <a-form-item label="渠道商户" name="userId">
            <a-select
              v-model:value="withdrawForm.userId"
              placeholder="请选择渠道商户"
              allowClear
              :loading="onbMchLoading"
            >
              <a-select-option v-for="item in onbMchOptions" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item :wrapper-col="{ offset: 6 }">
            <a-button type="primary" @click="handleQueryUserInfo" :loading="loading">
              查询用户信息
            </a-button>
          </a-form-item>

          <a-divider>用户信息</a-divider>

          <a-form-item label="用户名称">
            <a-input v-model:value="userInfo.userName" disabled />
          </a-form-item>

          <a-form-item label="可用余额">
            <a-input v-model:value="userInfo.balance" disabled>
              <template #addonAfter>元</template>
            </a-input>
          </a-form-item>

          <!-- <a-form-item label="到账余额">
            <a-input v-model:value="userInfo.receivedBalance" disabled>
              <template #addonAfter>元</template>
            </a-input>
          </a-form-item>

          <a-form-item label="在途余额">
            <a-input v-model:value="userInfo.receivableBalance" disabled>
              <template #addonAfter>元</template>
            </a-input>
          </a-form-item>

          <a-form-item label="冻结余额">
            <a-input v-model:value="userInfo.frozenAmount" disabled>
              <template #addonAfter>元</template>
            </a-input>
          </a-form-item> -->

          <a-form-item label="用户类型">
            <a-input v-model:value="userInfo.userTypeDesc" disabled />
          </a-form-item>

          <a-form-item label="账户状态">
            <a-input v-model:value="userInfo.statusDesc" disabled />
          </a-form-item>

          <a-divider>提现信息</a-divider>

          <a-form-item label="提现金额" name="amount">
            <a-input-number
              v-model:value="withdrawForm.amount"
              :min="0.01"
              :precision="2"
              placeholder="请输入提现金额"
              style="width: 100%"
            >
              <template #addonAfter>元</template>
            </a-input-number>
          </a-form-item>

          <!-- <a-form-item label="商户号" name="mchNo">
            <a-input v-model:value="withdrawForm.mchNo" placeholder="请输入商户号" />
          </a-form-item>

          <a-form-item label="所属服务商" name="isvNo">
            <a-input v-model:value="withdrawForm.isvNo" placeholder="请输入所属服务商" />
          </a-form-item> -->

          <a-form-item :wrapper-col="{ offset: 6 }">
            <a-space>
              <a-button type="primary" @click="handleSubmit" :loading="loading"> 提交 </a-button>
              <a-button @click="handleCancel">取消</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </a-card>
    </div>
  </div>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue'
  import { message } from 'ant-design-vue'
  import { getUserInfo, submit, getOnbMchDropdown } from './PayChannelWithdraw.api'

  const emit = defineEmits(['success', 'cancel'])

  const withdrawFormRef = ref(null)
  const loading = ref(false)
  const onbMchLoading = ref(false)
  const onbMchOptions = ref([])

  const withdrawForm = reactive({
    channel: '',
    userId: '',
    amount: '',
    mchNo: '',
    isvNo: '',
  })

  // 监听 userId 变化，自动查询用户信息
  watch(
    () => withdrawForm.userId,
    async (newVal) => {
      if (newVal && withdrawForm.channel) {
        await handleQueryUserInfo()
      }
    },
  )

  const userInfo = reactive({
    userName: '',
    userId: '',
    balance: '',
    receivedBalance: '',
    receivableBalance: '',
    frozenAmount: '',
    userType: '',
    userTypeDesc: '',
    status: '',
    statusDesc: '',
  })

  const rules = {
    channel: [{ required: true, message: '请选择渠道', trigger: 'change' }],
    userId: [{ required: true, message: '请选择渠道商户', trigger: 'change' }],
    amount: [
      { required: true, message: '请输入提现金额', trigger: 'blur' },
      { type: 'number', min: 10, message: '提现金额必须大于10', trigger: 'blur' },
    ],
    mchNo: [{ required: true, message: '请输入商户号', trigger: 'blur' }],
  }

  // 重置表单
  const resetForm = () => {
    if (withdrawFormRef.value) {
      withdrawFormRef.value.resetFields()
    }
    Object.keys(withdrawForm).forEach((key) => {
      withdrawForm[key] = ''
    })
    Object.keys(userInfo).forEach((key) => {
      userInfo[key] = ''
    })
    onbMchOptions.value = []
    loading.value = false
  }

  // 渠道变化时重置用户信息并加载进件商户列表
  const handleChannelChange = async () => {
    // 重置用户信息
    Object.keys(userInfo).forEach((key) => {
      userInfo[key] = ''
    })
    withdrawForm.userId = ''
    withdrawForm.amount = ''
    onbMchOptions.value = []

    // 加载进件商户列表
    if (!withdrawForm.channel) {
      return
    }
    try {
      onbMchLoading.value = true
      const response = await getOnbMchDropdown(withdrawForm.channel)
      onbMchOptions.value = response.data || []
    } catch (error) {
      message.error('加载渠道商户列表失败')
      console.error(error)
    } finally {
      onbMchLoading.value = false
    }
  }

  // 查询用户信息
  const handleQueryUserInfo = async () => {
    if (!withdrawForm.channel || !withdrawForm.userId) {
      message.warning('请选择渠道并选择渠道商户')
      return
    }

    loading.value = true
    try {
      const response = await getUserInfo({
        channel: withdrawForm.channel,
        userId: withdrawForm.userId,
      })
      const data = response.data

      // 转换数据
      userInfo.userName = data.userName
      userInfo.userId = data.userId
      userInfo.balance = (parseInt(data.balance) / 100).toFixed(2)
      //userInfo.receivedBalance = (parseInt(data.receivedBalance) / 100).toFixed(2)
      //userInfo.receivableBalance = (parseInt(data.receivableBalance) / 100).toFixed(2)
      //userInfo.frozenAmount = (parseInt(data.frozenAmount) / 100).toFixed(2)
      userInfo.userType = data.userType
      userInfo.status = data.status

      // 转换用户类型描述
      const userTypeMap = {
        10: '个人用户',
        15: '个体工商户用户',
        20: '企业用户',
        40: '匿名用户',
      }
      userInfo.userTypeDesc = userTypeMap[data.userType] || data.userType

      // 转换账户状态描述
      const statusMap = {
        10: '正常',
        15: '注册中',
        30: '冻结',
        35: '止付',
        36: '冻结仅提现',
      }
      userInfo.statusDesc = statusMap[data.status] || data.status

      // 设置默认提现金额为可用余额
      withdrawForm.amount = userInfo.balance

      message.success('查询用户信息成功')
    } catch (error) {
      message.error('查询用户信息失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 提交表单
  const handleSubmit = async () => {
    if (!withdrawFormRef.value) return

    try {
      await withdrawFormRef.value.validate()

      loading.value = true

      // 转换金额为分
      const amountInCents = Math.round(parseFloat(withdrawForm.amount) * 100)

      await submit({
        ...withdrawForm,
        amount: amountInCents,
      })

      message.success('提交提现成功')
      emit('success')
      resetForm()
    } catch (error) {
      if (error !== 'validate') {
        message.error('提交提现失败')
        console.error(error)
      }
    } finally {
      loading.value = false
    }
  }

  // 取消
  const handleCancel = () => {
    emit('cancel')
    resetForm()
  }

  // 暴露方法给父组件
  defineExpose({
    resetForm,
  })
</script>

<style scoped>
  .withdraw-add {
    padding: 20px;
  }
</style>
