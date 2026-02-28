<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <b-query
        :query-params="model.queryParam"
        :fields="fields"
        :default-item-count="3"
        @query="queryPage"
        @reset="resetQueryParams"
      />
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar ref="xToolbar" custom refresh :refresh-options="{ queryMethod: queryPage }">
        <template #buttons>
          <a-space>
            <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="add"
              >新建</a-button
            >
          </a-space>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          ref="xTable"
          :row-config="{ keyField: 'id' }"
          :data="pagination.records"
          :loading="loading"
        >
          <vxe-column type="seq" width="60" />
          <vxe-column field="name" title="服务商名称" :min-width="150">
            <template #default="{ row }">
              <a-link @click="show(row)">{{ row.name }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="isvNo" title="服务商号" :min-width="150" />
          <vxe-column field="status" title="状态" align="center" :min-width="100">
            <template #default="{ row }">
              <a-tag v-if="row.status === IsvStatusEnum.ENABLED" color="green">启用</a-tag>
              <a-tag v-else color="red">停用</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="createTime" title="创建时间" :min-width="140" />
          <vxe-column fixed="right" :width="200" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-link @click="edit(row)">编辑</a-link>
              <a-divider type="vertical" />
              <a-link @click="showChannelSetup(row)">通道配置</a-link>
              <a-divider type="vertical" />
              <a-dropdown>
                <a> 更多 <Icon icon="ant-design:down-outlined" :size="12" /> </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item>
                      <a-link @click="showGatewaySetup(row)">网关支付</a-link>
                    </a-menu-item>
                    <a-menu-item>
                      <a-link @click="showRateSetup(row)">费率配置</a-link>
                    </a-menu-item>
                    <a-menu-item v-if="false">
                      <a-link @click="showPermSetup(row)">权限配置</a-link>
                    </a-menu-item>
                    <a-menu-item>
                      <a-link @click="showDefaultPermSetup(row)">代理商默认权限</a-link>
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
      <isv-info-edit ref="isvApp" @ok="queryPage" />
      <isv-channel-config-list ref="channelSetup" />
      <isv-rate-config-list ref="rateSetup" />
      <isv-perm-config-model ref="permSetup" />
      <isv-default-perm-config-model ref="defaultPermSetup" />
      <gateway-config-model ref="gatewaySetup" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { page } from './IsvInfo.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import IsvInfoEdit from './IsvInfoEdit.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { LIST, QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'
  import IsvChannelConfigList from '@/views/daxpay/admin/isv/config/channel/IsvChannelConfigList.vue'
  import { IsvStatusEnum } from '@/enums/daxpay/daxpayEnum'
  import Icon from '@/components/Icon/Icon.vue'
  import GatewayConfigModel from '@/views/daxpay/admin/isv/gateway/GatewayConfigModel.vue'

  // 使用hooks
  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const { dictDropDown } = useDict()
  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'isvNo', type: STRING, name: '服务商号', placeholder: '请输入服务商号' },
      { field: 'name', type: STRING, name: '名称', placeholder: '请输入服务商名称' },
      {
        field: 'status',
        type: LIST,
        selectList: isvStatusList.value,
        name: '服务商状态',
        placeholder: '请选择服务商状态',
      },
    ] as QueryField[]
  })
  const isvStatusList = ref<LabeledValue[]>([])

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const isvApp = ref<any>()
  const channelSetup = ref<any>()
  const rateSetup = ref<any>()
  const gatewaySetup = ref<any>()
  const permSetup = ref<any>()
  const defaultPermSetup = ref<any>()

  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 初始化服务商列表信息
   */
  function initData() {
    dictDropDown('isv_status').then((res) => (isvStatusList.value = res))
  }

  function vxeBind() {
    xTable.value?.connectToolbar(xToolbar.value as VxeToolbarInstance)
  }

  // 分页查询
  function queryPage() {
    loading.value = true
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }
  /**
   * 新增
   */
  function add() {
    isvApp.value.init(null, FormEditType.Add)
  }
  /**
   * 编辑
   */
  function edit(record) {
    isvApp.value.init(record.id, FormEditType.Edit)
  }
  /**
   * 查看
   */
  function show(record) {
    isvApp.value.init(record.id, FormEditType.Show)
  }

  /**
   * 通道配置
   */
  function showChannelSetup(record) {
    channelSetup.value.init(record.isvNo)
  }

  /**
   * 网关支付配置
   */
  function showGatewaySetup(record) {
    gatewaySetup.value.init(record.isvNo)
  }

  /**
   * 分润费率配置
   */
  function showRateSetup(record) {
    rateSetup.value.init(record.isvNo)
  }

  /**
   * 权限配置
   */
  function showPermSetup(record) {
    permSetup.value.init(record.isvNo)
  }

  /**
   * 代理商默认权限配置
   */
  function showDefaultPermSetup(record) {
    defaultPermSetup.value.init(record.isvNo)
  }
</script>

<style lang="less" scoped></style>
