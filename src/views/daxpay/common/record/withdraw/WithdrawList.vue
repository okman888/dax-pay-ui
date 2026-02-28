<template>
  <div>
    <div class="m-3 p-3 pt-5 bg-white">
      <a-form :model="searchForm" layout="inline">
        <a-form-item label="渠道">
          <a-select
            v-model:value="searchForm.channel"
            placeholder="请选择渠道"
            style="width: 200px"
            @change="handleChannelChange"
          >
            <a-select-option value="CPCN_PAY">中金支付</a-select-option>
            <!-- 其他渠道选项 -->
          </a-select>
        </a-form-item>
        <a-form-item label="渠道商户">
          <a-select
            v-model:value="searchForm.onbMchNo"
            placeholder="请选择渠道商户"
            style="width: 200px"
            allowClear
          >
            <a-select-option
              v-for="item in onbMchOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="商户号">
          <a-input
            v-model:value="searchForm.mchNo"
            placeholder="请输入商户号"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item label="提现编号">
          <a-input
            v-model:value="searchForm.withdrawNo"
            placeholder="请输入提现编号"
            style="width: 200px"
          />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button type="primary" @click="handleSearch">查询</a-button>
            <a-button @click="resetForm">重置</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <div class="m-3 p-3 bg-white">
      <vxe-toolbar
        ref="xToolbar"
        custom
        refresh
        :refresh-options="{ queryMethod: loadWithdrawList }"
      >
        <template #buttons>
          <a-space>
            <a-button type="primary" @click="handleAdd">
              <template #icon>
                <Icon icon="ant-design:plus-outlined" />
              </template>
              新建
            </a-button>
          </a-space>
        </template>
      </vxe-toolbar>
      <div class="h-65vh">
        <vxe-table
          height="auto"
          :row-config="{ keyField: 'id' }"
          ref="xTable"
          :data="withdrawList"
          :loading="loading"
        >
          <vxe-column type="seq" title="序号" width="60" align="center" />
          <vxe-column field="withdrawNo" title="提现编号" width="200" />
          <vxe-column field="mchNo" title="商户编号" :min-width="150" />
          <vxe-column field="channel" title="渠道" :min-width="120">
            <template #default="{ row }">
              <span v-if="row.channel === 'CPCN_PAY'">中金支付</span>
              <span v-else>{{ row.channel }}</span>
            </template>
          </vxe-column>
          <vxe-column field="onbMchNo" title="渠道商户" :min-width="150" />
          <vxe-column field="amount" title="提现金额" :min-width="120" sortable>
            <template #default="{ row }">
              {{ row.amount ? (row.amount / 100).toFixed(2) + ' 元' : '空' }}
            </template>
          </vxe-column>
          <vxe-column field="status" title="状态" :min-width="50">
            <template #default="{ row }">
              <a-tag v-if="row.status === 'success'" color="success">成功</a-tag>
              <a-tag v-else-if="row.status === 'fail'" color="error">失败</a-tag>
              <a-tag v-else color="default">处理中</a-tag>
            </template>
          </vxe-column>
          <vxe-column field="errorMsg" title="错误信息" width="200" />

          <vxe-column field="createTime" title="创建时间" :min-width="180" sortable />
          <vxe-column fixed="right" :min-width="100" :showOverflow="false" title="操作">
            <template #default="{ row }">
              <span>
                <a-link @click="handleSync(row)">同步</a-link>
              </span>
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
    </div>

    <!-- 新增提现抽屉 -->
    <a-drawer
      v-model:visible="addDrawerVisible"
      title="新增渠道提现"
      placement="right"
      width="700"
      @close="handleDrawerClose"
    >
      <WithdrawAddForm ref="withdrawAddFormRef" @success="handleAddSuccess" @cancel="handleAddCancel" />
    </a-drawer>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted } from 'vue'
  import { message } from 'ant-design-vue'
  import { page, sync, getOnbMchDropdown } from './PayChannelWithdraw.api'
  import ALink from '@/components/Link/Link.vue'
  import WithdrawAddForm from './WithdrawAdd.vue'
  import Icon from '@/components/Icon/Icon.vue'

  const loading = ref(false)
  const withdrawList = ref([])
  const addDrawerVisible = ref(false)
  const withdrawAddFormRef = ref()
  const onbMchOptions = ref([])

  const searchForm = reactive({
    channel: '',
    mchNo: '',
    withdrawNo: '',
    onbMchNo: '',
  })

  const pagination = reactive({
    current: 1,
    size: 10,
    total: 0,
  })

  const xTable = ref()
  const xToolbar = ref()

  onMounted(() => {
    vxeBind()
    loadWithdrawList()
  })

  function vxeBind() {
    xTable.value?.connectToolbar(xToolbar.value)
  }

  // 加载提现记录列表
  const loadWithdrawList = async () => {
    loading.value = true
    try {
      const response = await page({
        ...searchForm,
        page: pagination.current,
        size: pagination.size,
      })
      withdrawList.value = response.data.records
      pagination.total = response.data.total
    } catch (error) {
      message.error('加载提现记录失败')
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  // 搜索
  const handleSearch = () => {
    pagination.current = 1
    loadWithdrawList()
  }

  // 重置表单
  const resetForm = () => {
    Object.keys(searchForm).forEach((key) => {
      searchForm[key] = ''
    })
    onbMchOptions.value = []
    pagination.current = 1
    loadWithdrawList()
  }

  // 新增提现 - 打开抽屉
  const handleAdd = () => {
    addDrawerVisible.value = true
  }

  // 抽屉关闭时重置表单
  const handleDrawerClose = () => {
    if (withdrawAddFormRef.value) {
      withdrawAddFormRef.value.resetForm()
    }
  }

  // 新增成功回调
  const handleAddSuccess = () => {
    addDrawerVisible.value = false
    loadWithdrawList()
    message.success('新增提现成功')
  }

  // 新增取消回调
  const handleAddCancel = () => {
    addDrawerVisible.value = false
  }

  // 同步提现状态
  const handleSync = async (row) => {
    try {
      await sync(row.id)
      message.success('同步成功')
      loadWithdrawList()
    } catch (error) {
      message.error('同步失败')
      console.error(error)
    }
  }

  // 分页变化
  const handleTableChange = ({ currentPage, pageSize }) => {
    pagination.current = currentPage
    pagination.size = pageSize
    loadWithdrawList()
  }

  // 渠道变化时加载进件商户下拉列表
  const handleChannelChange = async (value) => {
    searchForm.onbMchNo = ''
    onbMchOptions.value = []
    if (!value) {
      return
    }
    try {
      const response = await getOnbMchDropdown(value, searchForm.mchNo)
      onbMchOptions.value = response.data || []
    } catch (error) {
      message.error('加载渠道商户列表失败')
      console.error(error)
    }
  }
</script>

<style lang="less" scoped></style>
