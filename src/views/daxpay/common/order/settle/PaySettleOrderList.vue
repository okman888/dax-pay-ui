<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom refresh :refresh-options="{ queryMethod: queryPage }">
        <template #buttons>
          <span style="font-size: 18px">分账订单列表</span>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          :row-config="{ keyField: 'id' }"
          ref="xTable"
          :cell-style="cellStyle"
          :data="pagination.records"
          :loading="loading"
          :sort-config="{ remote: true, trigger: 'cell' }"
          @sort-change="sortChange"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="settleNo" title="分账订单号" :min-width="230">
            <template #default="{ row }">
              <a @click="show(row)">
                {{ row.settleNo }}
              </a>
            </template>
          </vxe-column>
          <vxe-column field="payOrderNo" title="原支付订单号" :min-width="230">
            <template #default="{ row }">
              <a @click="showPayOrder(row.payOrderNo)">
                {{ row.payOrderNo }}
              </a>
            </template>
          </vxe-column>
          <vxe-column field="outSettleNo" title="通道分账单号" :min-width="230">
            <template #default="{ row }">
              {{ row.outSettleNo || '无' }}
            </template>
          </vxe-column>
          <vxe-column field="channel" title="支付通道" :min-width="150">
            <template #default="{ row }">
              {{ dictConvert('channel', row.channel) }}
            </template>
          </vxe-column>
          <vxe-column field="status" title="分账状态" :min-width="120">
            <template #default="{ row }">
              <span
                :class="{
                  'text-red-500': row.status === 'fail',
                  'text-green-500': row.status === 'success',
                }"
              >
                {{ dictConvert('pay_settle_status', row.status) || '无' }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" sortable :min-width="140" />
          <vxe-column field="lastModifiedTime" title="最后修改时间" sortable :min-width="140" />
          <vxe-column fixed="right" width="120" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="show(row)">查看</a-link>
              <a-divider type="vertical" />
              <a-dropdown>
                <a>
                  更多
                  <icon icon="ant-design:down-outlined" :size="12" />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-link @click="sync(row)">同步</a-link>
                    </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        size="medium"
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
      <PaySettleOrderInfo ref="paySettleOrderInfo" />
      <PayOrderInfo ref="payOrderInfo" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { syncSettleOrder, pageQuerySettleOrder } from './PaySettleOrder.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { useDict } from '@/hooks/bootx/useDict'
  import { VxeTableInstance, VxeToolbarInstance, VxeTable, VxeToolbar } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import { Icon } from '@/components/Icon'
  import { dropdown as merchantDropdown } from '@/views/daxpay/common/assist/basic/MerchantQuery.api'
  import { dropdownByMchNo as mchAppDropdown } from '@/views/daxpay/common/assist/basic/MchAppQuery.api'
  import PaySettleOrderInfo from './PaySettleOrderInfo.vue'
  import PayOrderInfo from '../pay/PayOrderInfo.vue'

  // 使用hooks
  const {
    handleTableChange, //表格页脚变化
    pageQueryResHandel,
    sortChange,
    resetQueryParams,
    pagination,
    sortParam,
    model,
    loading,
  } = useTablePage(queryPage)
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert, dictDropDown } = useDict()

  const mchNoOptions = ref<LabeledValue[]>([])
  const mchAppOptions = ref<LabeledValue[]>([])
  const channelList = ref<LabeledValue[]>([])
  const settleStatusList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'settleNo', type: STRING, name: '分账订单号', placeholder: '请输入分账订单号' },
      {
        field: 'payOrderNo',
        type: STRING,
        name: '原支付订单号',
        placeholder: '请输入原支付订单号',
      },
      { field: 'outSettleNo', type: STRING, name: '通道分账号', placeholder: '请输入通道分账号' },
      { field: 'channel', name: '支付通道', type: LIST, selectList: channelList.value },
      { field: 'status', name: '分账状态', type: LIST, selectList: settleStatusList.value },
      {
        field: 'mchNo',
        type: LIST,
        name: '商户号',
        placeholder: '请选择商户号',
        selectList: mchNoOptions.value,
      },
      {
        field: 'appId',
        type: LIST,
        name: '应用号',
        placeholder: '请先选择商户后选择应用号',
        selectList: mchAppOptions.value,
      },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const paySettleOrderInfo = ref<any>()
  const payOrderInfo = ref<any>()

  // 提供一个 getter 函数
  watch(
    () => model.queryParam?.mchNo,
    (value) => changeMch(value),
  )

  onMounted(() => {
    initData() //初始化数据
    vxeBind()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connectToolbar(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    merchantDropdown().then(({ data }) => {
      mchNoOptions.value = data //获取查询商户号下拉列表
    })
    channelList.value = await dictDropDown('channel') //获取查询支付通道下拉列表
    settleStatusList.value = await dictDropDown('settle_status') //获取查询分账状态下拉列表
  }

  /**
   * 商户变动后更新应用列表
   */
  function changeMch(mchNo) {
    if (mchNo) {
      mchAppDropdown(mchNo).then(({ data }) => {
        mchAppOptions.value = data //更新应用号
      })
    } else {
      mchAppOptions.value = []
      model.queryParam.appId = undefined
    }
  }

  /**
   * 分页查询
   */
  function queryPage() {
    loading.value = true
    // 构建查询参数
    const params = {
      ...model.queryParam,
      current: pagination.current,
      size: pagination.size,
      ...sortParam,
    }
    // 查询列表
    return pageQuerySettleOrder(params)
      .then((res) => {
        pageQueryResHandel(res.data)
        loading.value = false
      })
      .catch(() => {
        loading.value = false
      })
  }

  /**
   * 查看分账订单详情
   */
  function show(record) {
    paySettleOrderInfo.value.init(record.settleNo)
  }

  /**
   * 查看原支付订单详情
   */
  function showPayOrder(payOrderNo) {
    payOrderInfo.value.init(payOrderNo)
  }

  /**
   * 同步分账订单状态
   */
  function sync(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否同步分账订单状态？',
      onOk: () => {
        loading.value = true
        syncSettleOrder(record.settleNo).then(() => {
          createMessage.success('同步成功')
          queryPage()
        })
      },
    })
  }
</script>

<style lang="less" scoped></style>
