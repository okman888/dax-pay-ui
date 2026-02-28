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
          <vxe-column field="onbIsvNo" title="进件机构号" :min-width="120" />
          <vxe-column field="onbMchNo" title="进件商户号" :min-width="150">
            <template #default="{ row }">
              <a-link @click="show(row)">{{ row.onbMchNo }}</a-link>
            </template>
          </vxe-column>
          <vxe-column field="onbMchName" title="进件商户名称" :min-width="150" />
          <vxe-column field="onbChannel" title="所属通道" align="center" :min-width="120">
            <template #default="{ row }">
              {{ dictConvert('channel', row.onbChannel) }}
            </template>
          </vxe-column>
          <vxe-column field="mchNo" title="商户号" :min-width="150" />
          <vxe-column field="mchName" title="商户名称" :min-width="150" />
          <vxe-column field="createTime" title="创建时间" :min-width="140" />
          <vxe-column fixed="right" :width="160" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <a-space :size="2">
                <template #split>
                  <a-divider type="vertical" />
                </template>
                <a-link @click="edit(row)">编辑</a-link>
                <a-link @click="open(row)">开通</a-link>
                <a-popconfirm
                  title="是否删除该进件商户信息？"
                  @confirm="deleteRecord(row)"
                  ok-text="确认"
                  cancel-text="取消"
                >
                  <a-link danger>删除</a-link>
                </a-popconfirm>
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
      <OnbMchInfoEdit ref="onbMchInfoEdit" @ok="queryPage" />
      <OnbMchPaywayApply ref="onbMchPaywayApply" @ok="queryPage" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, ref } from 'vue'
  import { page, del } from './OnbMchInfo.api'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import OnbMchInfoEdit from './OnbMchInfoEdit.vue'
  import OnbMchPaywayApply from './OnbMchPaywayApply.vue'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { QueryField, STRING } from '@/components/Bootx/Query/Query'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { VxeTableInstance, VxeToolbarInstance } from 'vxe-table'
  import ALink from '@/components/Link/Link.vue'
  import { useMessage } from '@/hooks/web/useMessage'
  import { useDict } from '@/hooks/bootx/useDict'

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
  const { createMessage } = useMessage()
  const { dictConvert } = useDict()

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'mchNo', type: STRING, name: '商户号', placeholder: '请输入商户号' },
      { field: 'mchName', type: STRING, name: '商户名称', placeholder: '请输入商户名称' },
      { field: 'onbMchNo', type: STRING, name: '进件商户号', placeholder: '请输入进件商户号' },
      {
        field: 'onbMchName',
        type: STRING,
        name: '进件商户名称',
        placeholder: '请输入进件商户名称',
      },
      { field: 'onbChannel', type: STRING, name: '所属通道', placeholder: '请输入所属通道' },
    ] as QueryField[]
  })

  const xTable = ref<VxeTableInstance>()
  const xToolbar = ref<VxeToolbarInstance>()
  const onbMchInfoEdit = ref<any>()
  const onbMchPaywayApply = ref<any>()

  onMounted(() => {
    vxeBind()
    initData()
    queryPage()
  })

  /**
   * 初始化数据
   */
  function initData() {
    // 可以在这里初始化一些字典数据
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
    onbMchInfoEdit.value.init(null, FormEditType.Add)
  }

  /**
   * 编辑
   */
  function edit(record) {
    onbMchInfoEdit.value.init(record.id, FormEditType.Edit)
  }

  /**
   * 查看
   */
  function show(record) {
    onbMchInfoEdit.value.init(record.id, FormEditType.Show)
  }

  /**
   * 删除
   */
  function deleteRecord(record) {
    del(record.id).then(() => {
      createMessage.success('删除成功')
      queryPage()
    })
  }

  /**
   * 开通
   */
  function open(record) {
    onbMchPaywayApply.value.init(record)
  }
</script>

<style lang="less" scoped></style>
