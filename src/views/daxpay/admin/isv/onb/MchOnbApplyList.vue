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
          <a-button type="primary" pre-icon="ant-design:plus-outlined" @click="addApply"
            >新建进件</a-button
          >
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          ref="xTable"
          :data="pagination.records"
          :loading="loading"
          :row-config="{ keyField: 'id' }"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="title" title="名称" :min-width="150" />
          <vxe-column field="channel" title="通道" width="150" />
          <vxe-column field="applyType" title="进件类型" width="120" />
          <vxe-column field="isvNo" title="服务商号" width="150" />
          <vxe-column field="status" title="状态" width="100" />
          <vxe-column field="channelTrxNo" title="进件编号" width="150" />
          <vxe-column field="channelStatus" title="通道状态" width="120" />
          <vxe-column field="channelResult" title="通道响应" :min-width="150" />
          <vxe-column field="createTime" title="创建时间" width="170" />
          <vxe-column fixed="right" title="操作" width="240" align="center">
            <template #default="{ row }">
              <a-link @click="handleEdit(row)">编辑</a-link>
              <a-divider type="vertical" />
              <a-link @click="syncStatusWithConfirm(row)">同步状态</a-link>
              <a-divider type="vertical" />
              <a-link @click="handlePushWithConfirm(row)">进件推送</a-link>
              <a-divider type="vertical" />
              <a-dropdown>
                <a-link>更多 <down-outlined /></a-link>
                <template #overlay>
                  <a-menu>
                    <a-menu-item @click="handleDelete(row)">删除</a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </template>
          </vxe-column>
        </vxe-table>
      </div>
      <vxe-pager
        :loading="loading"
        :current-page="pagination.current"
        :page-size="pagination.size"
        :total="pagination.total"
        @page-change="handleTableChange"
      />
    </div>
    <MchOnbApplyModal ref="mchOnbApplyModal" @ok="openFillPage" />
    <MchOnbApplyRouter ref="applyFillDrawer" @ok="queryPage" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue'
  import { message, Modal } from 'ant-design-vue'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import BQuery from '@/components/Bootx/Query/BQuery.vue'
  import { page, syncStatus, del, pushApply } from './MchOnbApply.api'
  import { QueryField, STRING } from '@/components/Bootx/Query/Query'
  import MchOnbApplyModal from './MchOnbApplyModal.vue'
  import MchOnbApplyRouter from './MchOnbApplyRouter.vue'

  const {
    handleTableChange,
    pageQueryResHandel,
    resetQueryParams,
    pagination,
    pages,
    model,
    loading,
  } = useTablePage(queryPage)
  const mchOnbApplyModal = ref()
  const applyFillDrawer = ref()

  // 添加状态变量，用于防止重复点击
  const syncStatusLoading = ref(false)
  const pushApplyLoading = ref(false)

  onMounted(() => {
    queryPage()
  })

  // 查询条件
  const fields = computed(() => {
    return [
      { field: 'applyName', type: STRING, name: '申请名称', placeholder: '请输入申请名称' },
    ] as QueryField[]
  })
  function queryPage() {
    loading.value = true
    page({ ...model.queryParam, ...pages }).then(({ data }) => pageQueryResHandel(data))
  }

  function addApply() {
    mchOnbApplyModal.value.init()
  }
  function handleEdit(row) {
    applyFillDrawer.value.init(row.id, row.channel)
  }
  function openFillPage(data) {
    console.log('data', data)
    // 刷新列表
    queryPage()
    // 打开填写页面
    //applyFillDrawer.value.init(data.id, data.channel)
  }
  function handleDelete(row) {
    Modal.confirm({
      title: '确认删除',
      content: '您确定要删除这条记录吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        del(row.id)
          .then(() => {
            message.success('删除成功')
            queryPage()
          })
          .catch((_error) => {
            message.error('删除失败')
          })
      },
    })
  }

  // 同步状态操作 - 带确认框和防重复点击
  function syncStatusWithConfirm(row) {
    if (syncStatusLoading.value) return // 如果正在请求中，则不允许重复点击

    Modal.confirm({
      title: '同步状态',
      content: '您确定要同步该记录的状态吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        syncStatusLoading.value = true
        try {
          await syncStatus({ id: row.id })
          message.success('状态同步成功')
          queryPage() // 刷新列表
        } catch (error) {
          message.error('状态同步失败')
        } finally {
          syncStatusLoading.value = false
        }
      },
    })
  }

  // 进件推送操作 - 带确认框和防重复点击
  function handlePushWithConfirm(row) {
    if (pushApplyLoading.value) return // 如果正在请求中，则不允许重复点击

    Modal.confirm({
      title: '进件推送',
      content: '您确定要推送该进件申请吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        pushApplyLoading.value = true
        try {
          await pushApply(row.id)
          message.success('进件推送成功')
          queryPage() // 刷新列表
        } catch (error) {
          message.error('进件推送失败')
        } finally {
          pushApplyLoading.value = false
        }
      },
    })
  }
</script>
