<template>
  <div class="batchTransferContain">
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
      <div class="operaBtnBox">
        <p>账户余额<span>0.13</span>元</p>
        <div class="btn">
          <a-button type="default" @click="resetBtn">
            <template #icon> <ReloadOutlined /> </template>
            重置信息
          </a-button>
          <a-button type="primary" @click="addBtn">
            <template #icon> <PlusOutlined /> </template>
            添加信息
          </a-button>
        </div>
      </div>
      <div class="batchTableBox">
        <vxe-table
          ref="formRef"
          :data="formObj.formData"
          :edit-config="{ trigger: 'click', mode: 'cell', showStatus: true }"
          height="auto"
          :row-config="{ keyField: 'id' }"
          :checkbox-config="{ reserve: true }"
        >
          <!-- 序号 -->
          <vxe-column type="seq" title="序号" width="60" align="center" />

          <!-- 收款账号 -->
          <vxe-column field="receiveAccount" title="收款账号" min-width="200">
            <template #header> <span class="vxe-required">*</span> 收款账号 </template>
            <template #default="{ row }">
              <vxe-input
                v-model="row.receiveAccount"
                type="number"
                placeholder="请输入收款账号"
                clearable
                :min="0"
                :max="9999999999999999"
                :controls="false"
              />
            </template>
          </vxe-column>

          <!-- 收款人 -->
          <vxe-column field="receiveName" title="收款人姓名" min-width="120">
            <template #header> <span class="vxe-required">*</span> 收款人姓名 </template>
            <template #default="{ row }">
              <vxe-input v-model="row.receiveName" placeholder="请输入收款人姓名" clearable />
            </template>
          </vxe-column>
          <!-- 金额 -->
          <vxe-column field="amount" title="金额(元)" min-width="120" sortable>
            <template #header> <span class="vxe-required">*</span> 金额(元) </template>
            <template #default="{ row }">
              <vxe-input v-model="row.amount" type="float" :min="0.01" placeholder="0.00" />
            </template>
          </vxe-column>
          <!-- 备注 -->
          <vxe-column field="desc" title="备注" min-width="200">
            <template #default="{ row }">
              <vxe-input
                v-model="row.desc"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 3 }"
                placeholder="请输入备注"
                clearable
              />
            </template>
          </vxe-column>
          <!-- 操作列：删除按钮 -->
          <vxe-column title="操作" width="100" fixed="right" align="center">
            <template #default="{ row }">
              <vxe-button type="text" status="danger" @click="removeRow(row)"> 删除 </vxe-button>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <div class="tranferBtnBox">
        <div class="totalBox">
          <p
            >共计：<span>{{ formObj.formData.length }}笔</span></p
          >
          <p
            >总金额：<span>{{ totalAmount }}元</span></p
          >
        </div>
        <div class="btn">
          <a-button type="primary" @click="transferBtn" :disabled="!isAllFilled">
            立即转账</a-button
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { FormInstance } from 'ant-design-vue'
  import { ref, reactive, computed } from 'vue'
  import { ReloadOutlined, PlusOutlined } from '@ant-design/icons-vue'
  import { useMessage } from '@/hooks/web/useMessage'

  const { createConfirm } = useMessage()
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
  const loading = ref<boolean>(false)
  console.log(loading)

  //总金额
  const totalAmount =
    computed(() => {
      return formObj.formData.reduce((sum, item) => {
        // 安全获取 amount，转为数字，非法则为 0
        const amount = Number(item.amount) || 0
        return sum + amount
      }, 0)
    }) || 0

  //表单对象
  const formObj = reactive({
    //表单数据对象
    formData: [
      {
        id: 1,
        amount: '',
        receiveAccount: '',
        receiveName: '',
        desc: '',
      },
    ],
  })
  //验证是否全部填写 否则转账按钮失效
  const isAllFilled = computed(() => {
    return formObj.formData.every((item) => {
      return (
        item.receiveAccount?.trim() &&
        item.receiveName?.trim() &&
        item.amount &&
        parseFloat(item.amount) > 0
      )
    })
  })
  //重置
  const resetBtn = () => {
    createConfirm({
      iconType: 'warning',
      title: '确定重置吗？此操作不会保留已填数据！',
      onOk: () => {
        formObj.formData = [
          {
            id: 1,
            amount: '',
            receiveAccount: '',
            receiveName: '',
            desc: '',
          },
        ]
      },
    })
  }
  //添加
  const addBtn = () => {
    formObj.formData.push({
      id: Math.floor(Math.random() * 90000000) + 10000000,
      amount: '',
      receiveAccount: '',
      receiveName: '',
      desc: '',
    })
  }
  //转账
  const transferBtn = () => {
    createConfirm({
      title: '确认转账？',
      content: `共 ${formObj.formData.length} 笔，总金额 ${totalAmount.value.toFixed(2)} 元`,
      iconType: 'success',
      onOk: () => {
        console.log('开始转账', formObj.formData)
      },
    })
  }
  //删除
  const removeRow = (row) => {
    createConfirm({
      iconType: 'warning',
      title: '确定要删除此行吗？',
      onOk: () => {
        const index = formObj.formData.findIndex((item) => item.id === row.id)
        if (index > -1) {
          formObj.formData.splice(index, 1)
        }
      },
    })
  }
</script>

<style scoped lang="less">
  .batchTransferContain {
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
      .transferTitle {
        height: 2.5vw;
        display: flex;
        align-items: center;
        font-size: 1rem;
        padding: 0 1.0417vw;
      }
      .operaBtnBox {
        height: 3vw;
        padding: 0 1.0417vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        p {
          display: flex;
          align-items: center;
          span {
            color: red;
            display: inline-block;
            margin: 0 0.2604vw;
          }
        }
        .btn {
          cursor: pointer;
          display: flex;
          gap: 1.0417vw;
        }
      }
      .batchTableBox {
        height: calc(100% - 9vw);
        padding: 0 1.0417vw;
        .vxe-required {
          color: #f5222d;
          margin-right: 4px;
          font-weight: bold;
        }
      }
      .tranferBtnBox {
        padding: 0 1.0417vw;
        height: 3vw;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .totalBox {
          display: flex;
          p {
            margin-right: 1.0417vw;
            span {
              display: inline-block;
              font-size: 18px;
              color: red;
            }
          }
        }
      }
    }
  }
</style>
