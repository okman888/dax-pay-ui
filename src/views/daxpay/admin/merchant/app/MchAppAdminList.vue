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
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="appId" title="应用号" :min-width="180">
            <template #default="{ row }">
              <a-link @click="show(row)">{{ row.appId }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="appName" title="应用名称" :min-width="170" />
          <vxe-column field="status" title="状态" align="center" :width="70">
            <template #default="{ row }">
              {{ dictConvert('mch_app_status', row.status) || '空' }}
            </template>
          </vxe-column>
          <vxe-column field="defaultApp" title="默认应用" align="center" :width="100">
            <template #default="{ row }">
              <span
                v-if="row.defaultApp"
                :style="{
                  cursor: 'pointer',
                  color: row._isHover ? '' : '#ff4d4f',
                  transition: 'color 0.2s',
                }"
                @click="toggleDefaultApp(row)"
                @mouseenter="row._isHover = true"
                @mouseleave="row._isHover = false"
              >
                {{ row._isHover ? '清除默认' : '默认' }}
              </span>
              <span
                v-else
                :style="{
                  cursor: 'pointer',
                  color: row._isHover ? '#ff4d4f' : '',
                  transition: 'color 0.2s',
                }"
                @click="toggleDefaultApp(row)"
                @mouseenter="row._isHover = true"
                @mouseleave="row._isHover = false"
              >
                {{ row._isHover ? '设为默认' : '否' }}
              </span>
            </template>
          </vxe-column>
          <vxe-column field="mchName" title="商户名称" :min-width="170" />
          <vxe-column field="createTime" title="创建时间" :min-width="140" />
          <vxe-column fixed="right" :width="200" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-space :size="2">
                <template #split>
                  <a-divider type="vertical" />
                </template>
                <a-link @click="edit(row)">编辑</a-link>
                <a-link @click="showChannelSetup(row)">通道配置</a-link>
                <a-dropdown>
                  <a> 更多 <Icon icon="ant-design:down-outlined" :size="12" /> </a>
                  <template #overlay>
                    <a-menu>
<!--                    <a-menu-item>-->
<!--                      <a-link @click="showNotifyConfig(row)">订阅配置</a-link>-->
<!--                    </a-menu-item>-->
                      <a-menu-item>
                        <a-link @click="showGatewayPay(row)">网关支付</a-link>
                      </a-menu-item>
                      <a-menu-item>
                        <a-link danger @click="remove(row)">删除</a-link>
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
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
      <mch-app-admin-edit ref="mchApp" @ok="queryPage" />
      <channel-config-list ref="channelSetup" />
      <GatewayConfigModel ref="gatewayConfigModel" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { clearDefault, del, page, setDefault } from './MchAppAdmin.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import MchAppAdminEdit from './MchAppAdminEdit.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useMessage } from '@/hooks/web/useMessage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'
  import { useDict } from '@/hooks/bootx/useDict'
  import ChannelConfigList from '@/views/daxpay/common/merchant/config/ChannelConfigList.vue'
  import Icon from '@/components/Icon/Icon.vue'
  import GatewayConfigModel from '@/views/daxpay/common/merchant/gateway/GatewayConfigModel.vue'

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
  const { createMessage, createConfirm } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'mchNo', type: STRING, name: '商户号', placeholder: '请输入商户号' },
      { field: 'appId', type: STRING, name: '应用号', placeholder: '请输入应用号' },
      { field: 'appName', type: STRING, name: '应用名称', placeholder: '请输入应用名称' },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const mchApp = ref<any>()
  const channelSetup = ref<any>()
  const gatewayConfigModel = ref<any>()

  onMounted(() => {
    vxeBind()
    queryPage()
  })

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
    mchApp.value.init(null, FormEditType.Add)
  }

  /**
   * 查看
   */
  function edit(record) {
    mchApp.value.init(record.id, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record) {
    mchApp.value.init(record.id, FormEditType.Show)
  }

  /**
   * 通道配置
   */
  function showChannelSetup(record) {
    channelSetup.value.init(record)
  }

  /**
   * 网关支付配置
   */
  function showGatewayPay(record) {
    gatewayConfigModel.value.init(record)
  }

  /**
   * 删除
   */
  function remove(record) {
    createConfirm({
      iconType: 'warning',
      title: '警告',
      content: '是否删除该条数据',
      onOk: () => {
        del(record.id).then(() => {
          createMessage.success('删除成功')
          queryPage()
        })
      },
    })
  }

  /**
   * 切换默认应用状态
   */
  function toggleDefaultApp(record) {
    const action = record.defaultApp ? '取消默认' : '设置默认'
    createConfirm({
      iconType: 'info',
      title: '确认操作',
      content: `确定要将${record.appName}${action}应用吗？`,
      onOk: async () => {
        if (record.defaultApp) {
          await clearDefault(record.id)
        } else {
          await setDefault(record.id)
        }
        createMessage.success(`设置成功`)
        queryPage().then()
      },
    })
  }
</script>

<style lang="less" scoped></style>
