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
      <vxe-toolbar ref="xToolbar" custom refresh :refresh-options="{ queryMethod: queryPage }" />
      <div class="h-65vh">
        <vxe-table
          height="auto"
          :row-config="{ keyField: 'id' }"
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
        >
          <vxe-column type="seq" width="60" />
          <vxe-column field="channel" title="通道" :min-width="150" align="center">
            <template #default="{ row }">
              {{ dictConvert('channel', row.channel) }}
            </template>
          </vxe-column>
          <vxe-column field="type" title="报送类型" :min-width="180" align="center">
            <template #default="{ row }">
              {{ dictConvert('terminal_type', row.type) }}
            </template>
          </vxe-column>
          <vxe-column field="name" title="报送名称" :min-width="190" />
          <vxe-column field="enable" title="是否启用" :min-width="120" align="center">
            <template #default="{ row }">
              <a-tag v-if="row.enable" color="green">启用</a-tag>
              <a-tag v-else color="red">停用</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="remark" title="备注" :min-width="180" />
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
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { page } from './TerminalConst.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import BQuery from '/@/components/Bootx/Query/BQuery.vue'
  import { QueryField } from '@/components/Bootx/Query/Query'
  import { useDict } from '@/hooks/bootx/useDict'
  import { LabeledValue } from 'ant-design-vue/lib/select'

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
  const { dictDropDown, dictConvert } = useDict()

  let channelList = ref<LabeledValue[]>([])
  let terminalTypeList = ref<LabeledValue[]>([])

  // 查询条件
  const fields = computed(() => {
    return [
      {
        field: 'channel',
        type: 'list',
        name: '通道',
        placeholder: '请选择通道类型',
        selectList: channelList.value,
      },
      {
        field: 'type',
        type: 'list',
        name: '报送类型',
        placeholder: '请选择报送类型',
        selectList: terminalTypeList.value,
      },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()

  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })
  function vxeBind() {
    xTable.value?.connectToolbar(xToolbar.value as VxeToolbarInstance)
  }

  /**
   * 初始化数据
   */
  async function initData() {
    channelList.value = await dictDropDown('channel')
    terminalTypeList.value = await dictDropDown('terminal_type')
  }

  /**
   * 分页查询
   */
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
</script>

<style lang="less" scoped></style>
