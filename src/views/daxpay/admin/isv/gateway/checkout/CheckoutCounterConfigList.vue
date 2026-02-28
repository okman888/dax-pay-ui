<template>
  <div>
    <vxe-toolbar ref="xToolbar" custom refresh :refresh-options="{ queryMethod: queryPage }">
      <template #buttons>
        <a-space>
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add">新建</a-button>
        </a-space>
      </template>
    </vxe-toolbar>
    <vxe-table key-field="id" ref="xTable" :data="records" :loading="loading">
      <vxe-column type="seq" width="60" />
      <vxe-column field="name" title="配置名称" :min-width="120">
        <template #default="{ row }">
          <a href="javascript:" @click="show(row)">{{ row.name }}</a>
        </template>
      </vxe-column>
      <vxe-column field="recommend" title="是否推荐" align="center" :min-width="100">
        <template #default="{ row }">
          <a-tag :color="row.recommend ? 'success' : 'default'">
            {{ row.recommend ? '是' : '否' }}
          </a-tag>
        </template>
      </vxe-column>

      <vxe-column field="channel" title="支付通道" align="center" :min-width="120">
        <template #default="{ row }">
          {{ dictConvert('channel', row.channel) }}
        </template>
      </vxe-column>

      <vxe-column field="payMethod" title="支付方式" align="center" :min-width="120">
        <template #default="{ row }">
          <template v-if="row.payMethod === PayMethodEnum.OTHER">
            {{ dictConvert(`${row.channel}_method`, row.otherMethod) }}
          </template>
          <template v-else>
            {{ dictConvert('pay_method', row.payMethod) }}
          </template>
        </template>
      </vxe-column>
      <vxe-column field="sortNo" title="排序" align="center" :min-width="80">
        <template #default="{ row }">
          {{ row.sortNo || 0 }}
        </template>
      </vxe-column>
      <vxe-column fixed="right" :width="120" :showOverflow="false" title="操作">
        <template #default="{ row }">
          <a-space :size="2">
            <template #split>
              <a-divider type="vertical" />
            </template>
            <a-link @click="edit(row)">编辑</a-link>
            <a-link danger @click="del(row)">删除</a-link>
          </a-space>
        </template>
      </vxe-column>
    </vxe-table>
    <CheckoutCounterConfigEdit
      ref="checkoutCounterConfigEdit"
      :isvNo="isvNo"
      :type="type"
      @ok="queryPage"
    />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { IsvCheckoutCounterConfig, listByType, deleteConfig } from './CheckoutCounterConfig.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import CheckoutCounterConfigEdit from './CheckoutCounterConfigEdit.vue'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useDict } from '@/hooks/bootx/useDict'
  import { PayMethodEnum } from '@/enums/daxpay/daxpayEnum'
  import ALink from '@/components/Link/Link.vue'

  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  const loading = ref(false)
  const records = ref<IsvCheckoutCounterConfig[]>([])

  const checkoutCounterConfigEdit = ref<any>()

  const props = defineProps({
    isvNo: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value: string) => ['pc', 'h5'].includes(value),
    },
  })

  onMounted(() => queryPage())

  /**
   * 查询列表
   */
  function queryPage() {
    loading.value = true
    listByType(props.isvNo, props.type)
      .then(({ data }) => {
        records.value = data
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }

  /**
   * 新增
   */
  function add() {
    checkoutCounterConfigEdit.value.init(null, FormEditType.Add)
  }

  /**
   * 编辑
   */
  function edit(record: IsvCheckoutCounterConfig) {
    checkoutCounterConfigEdit.value.init(record.id, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record: IsvCheckoutCounterConfig) {
    checkoutCounterConfigEdit.value.init(record.id, FormEditType.Show)
  }

  /**
   * 删除
   */
  function del(record: IsvCheckoutCounterConfig) {
    createConfirm({
      iconType: 'warning',
      title: '删除',
      content: '是否删除该数据',
      onOk: () => {
        loading.value = true
        deleteConfig(record.id)
          .then(() => {
            createMessage.success('删除成功')
            queryPage()
          })
          .catch(() => {
            loading.value = false
          })
      },
    })
  }
</script>

<style scoped lang="less">
  .color-preview {
    display: flex;
    align-items: center;
    gap: 8px;

    .color-block {
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid #d9d9d9;
      display: inline-block;
    }
  }
</style>
