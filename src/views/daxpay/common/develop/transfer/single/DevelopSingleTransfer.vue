<template>
  <div class="singleTransferContain">
    <div class="applicateBox">
      <span>应用:</span>
      <a-select ref="select" v-model:value="applyId" style="width: 12.5vw">
        <a-select-option :value="item.value" v-for="item in applyList" :key="item.id">{{
          item.name
        }}</a-select-option>
      </a-select>
    </div>
    <!-- 支付通道盒子 -->
    <div class="channelBox">
      <div class="channelBoxItem">
        <div class="channelTitle">支付通道</div>
        <div class="channelBody">
          <a-radio-group v-model:value="channel" button-style="solid">
            <a-radio-button :value="item.value" v-for="item in channelList" :key="item.id">
              {{ item.name }}
            </a-radio-button>
          </a-radio-group>
        </div>
      </div>
      <div class="channelBoxItem">
        <div class="channelTitle">入账方式</div>
        <div class="channelBody">
          <a-radio-group name="radioGroup" v-model:value="accountMethod">
            <a-radio :value="item.value" v-for="item in accountMethodList" :key="item.id">
              {{ item.name }}
            </a-radio>
          </a-radio-group>
        </div>
      </div>
    </div>

    <!-- 支付通道盒子 -->
    <div class="messageTransfer">
      <div class="transferTitle">转账信息</div>
      <div class="messFormBox">
        <a-form
          ref="formRef"
          :model="formObj.formData"
          :rules="formObj.rules"
          :label-col="{ span: 3 }"
          :wrapper-col="{ span: 8 }"
          :label-align="'right'"
        >
          <a-form-item label="订单编号：" name="orderId">
            <a-input v-model:value="formObj.formData.orderId" allowClear disabled="true" />
          </a-form-item>
          <a-form-item label="转账金额：" name="amount">
            <a-input-number v-model:value="formObj.formData.amount" :controls="false" allowClear />
          </a-form-item>
          <a-form-item label="收款账号：" name="receiveAccount">
            <div style="display: flex; width: 100%">
              <a-input
                v-model:value="formObj.formData.receiveAccount"
                allow-clear
                style="flex: 1; margin-right: 0.4167vw"
              />
              <a-button type="primary">点击获取openId</a-button>
            </div>
          </a-form-item>
          <a-form-item label="收款人姓名：" name="receiveName">
            <a-input v-model:value="formObj.formData.receiveName" allowClear />
          </a-form-item>
          <a-form-item label="备注：" name="desc">
            <a-textarea v-model:value="formObj.formData.desc" allowClear />
          </a-form-item>
          <a-form-item :wrapper-col="{ offset: 3 }">
            <a-button type="primary" @click="transferBtn">立即转账</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { FormInstance } from 'ant-design-vue'
  import { ref, reactive } from 'vue'

  // 绑定的应用号
  const applyId = ref<String>('')
  const applyList = ref<any[]>([
    { id: 1, name: '应用1', value: 1 },
    { id: 2, name: '应用2', value: 2 },
    { id: 3, name: '应用3', value: 3 },
  ])

  //选择通道
  const channel = ref<String>('')
  const channelList = ref<any[]>([
    { id: 1, name: '通道1', value: 1 },
    { id: 2, name: '通道2', value: 2 },
    { id: 3, name: '通道3', value: 3 },
  ])

  // 入账方式
  const accountMethod = ref<String>('')
  const accountMethodList = ref<any[]>([
    { id: 1, name: '方式1', value: 1 },
    { id: 2, name: '方式2', value: 2 },
    { id: 3, name: '方式3', value: 3 },
  ])

  const formRef = ref<FormInstance | null>(null) //表单ref
  //表单对象
  const formObj = reactive({
    formData: {
      orderId: '213qwedqweqweq123',
      amount: '',
      receiveAccount: '',
      receiveName: '',
      desc: '',
    }, //表单数据对象
    rules: {
      // 转账金额：必填 + 数字 + 大于0
      amount: [
        { required: true, message: '请输入转账金额', trigger: 'blur' },
        {
          pattern: /^(?!0*(\.0*$)).*/, // 排除 0 或 0.0 这类无效金额
          message: '转账金额必须大于0',
          trigger: 'blur',
        },
      ],
      // 收款账号：必填 + 最少6位（模拟银行卡或支付宝账号）
      receiveAccount: [
        { required: true, message: '请输入收款账号', trigger: 'blur' },
        { min: 6, message: '收款账号长度不能少于6位', trigger: 'blur' },
      ],
      // 收款人姓名：必填 + 中文或英文姓名
      receiveName: [{ required: true, message: '请输入收款人姓名', trigger: 'blur' }],
      // 备注：可选，但可以限制最大长度
      desc: [{ max: 200, message: '备注不能超过200个字符', trigger: 'blur' }],
    },
  })

  //转账
  const transferBtn = () => {
    if (!formRef.value) return
    formRef.value
      .validate()
      .then(() => {
        console.log('通过了')
      })
      .catch((error) => {
        console.log(error)
      })
  }
</script>

<style scoped lang="less">
  .singleTransferContain {
    height: 100%;
    background-color: #f0f4fb;
    padding: 1.0417vw;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.0417vw;
    .applicateBox {
      background-color: #ffffff;
      height: 2.7625vw;
      display: flex;
      align-items: center;
      padding-left: 1.0417vw;
      gap: 0.5208vw;
      border-radius: 0.5208vw;
    }
    .channelBox {
      height: 10.4167vw;
      background-color: #ffffff;
      border-radius: 0.5208vw;
      padding-left: 1.0417vw;
      .channelBoxItem {
        height: 50%;
        .channelTitle {
          height: 50%;
          display: flex;
          align-items: center;
          font-size: 1rem;
        }
        .channelBody {
          .ant-radio-wrapper {
            box-sizing: border-box;
            padding: 0.2604vw;
            border: 1px dotted #ccc;
            border-radius: 0.2604vw;
          }
        }
      }
    }
    .messageTransfer {
      height: calc(100% - 2.7625vw - 10.4167vw);
      background-color: #ffffff;
      border-radius: 0.5208vw;
      padding-left: 1.0417vw;
      .transferTitle {
        height: 2.5vw;
        display: flex;
        align-items: center;
        font-size: 1rem;
      }
      .messFormBox {
        width: 100%;
        margin-top: 1.0417vw;
        .form_item_amount {
          color: #8f9092;
        }
      }
    }
  }
</style>
