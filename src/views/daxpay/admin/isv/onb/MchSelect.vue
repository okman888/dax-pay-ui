<!-- src/components/MchSelect.vue -->
<template>
  <a-input-group compact>
    <a-input
      v-model:value="selectedMchName"
      :disabled="true"
      placeholder="请选择商户"
      style="width: calc(100% - 80px)"
    />
    <a-button @click="showModal" type="primary" style="width: 80px"> 选择商户 </a-button>
  </a-input-group>

  <a-modal
    v-model:open="modalVisible"
    title="选择商户"
    :width="800"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="mch-select-content">
      <div class="mch-select-search mb-3">
        <a-input
          v-model:value="searchValue"
          placeholder="请输入商户名称或商户号"
          @press-enter="handleSearch"
          style="width: 300px; margin-right: 10px"
        />
        <a-button type="primary" @click="handleSearch">搜索</a-button>
      </div>

      <div class="mch-select-table">
        <vxe-table
          ref="xTable"
          height="400"
          :data="mchList"
          :loading="loading"
          :radio-config="{ trigger: 'row' }"
          @radio-change="handleRadioChange"
        >
          <vxe-column type="radio" width="60" align="center" />
          <vxe-column field="mchNo" title="商户号" :min-width="150" />
          <vxe-column field="mchName" title="商户名称" :min-width="200" />
          <vxe-column field="status" title="状态" :min-width="100" align="center">
            <template #default="{ row }">
              <a-tag :color="row.status === 'enable' ? 'green' : 'red'">
                {{ row.status === 'enable' ? '启用' : '禁用' }}
              </a-tag>
            </template>
          </vxe-column>
          <vxe-column field="isvName" title="服务商名称" :min-width="150" />
          <vxe-column field="createTime" title="创建时间" :min-width="150" />
        </vxe-table>
      </div>

      <div class="mch-select-pagination mt-3">
        <vxe-pager
          size="medium"
          :current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          @page-change="handlePageChange"
        />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, watch, onMounted } from 'vue'
  import { page, Merchant } from '@/views/daxpay/admin/merchant/info/Merchant.api'
  import { VxeTableInstance } from 'vxe-table'
  import { PageResult } from '#/axios'

  // Props
  const props = defineProps({
    value: {
      type: String,
      default: null,
    },
  })

  // Emits
  const emit = defineEmits(['change', 'update:value'])

  // Refs
  const modalVisible = ref(false)
  const selectedMch = ref<Merchant | null>(null)
  const selectedMchName = ref('')
  const searchValue = ref('')
  const loading = ref(false)
  const mchList = ref<Merchant[]>([])
  const xTable = ref<VxeTableInstance>()
  const pagination = ref({
    current: 1,
    size: 10,
    total: 0,
  })

  // Watch for value changes from parent
  watch(
    () => props.value,
    (newVal) => {
      if (newVal && mchList.value.length > 0) {
        const found = mchList.value.find((mch) => mch.mchNo === newVal)
        if (found) {
          selectedMch.value = found
          selectedMchName.value = found.mchName || ''
        }
      }
    },
    { immediate: true },
  )

  // Load merchant list
  const loadMchList = async () => {
    loading.value = true
    try {
      const params = {
        current: pagination.value.current,
        size: pagination.value.size,
        mchName: searchValue.value || undefined,
      }

      const { data } = (await page(params)) as { data: PageResult<Merchant> }
      mchList.value = data.records || []
      pagination.value.total = data.total

      // If we have a selected value, try to match it
      if (props.value) {
        const found = mchList.value.find((mch) => mch.mchNo === props.value)
        if (found) {
          selectedMch.value = found
          selectedMchName.value = found.mchName || ''
        }
      }
    } catch (error) {
      console.error('Failed to load merchant list:', error)
    } finally {
      loading.value = false
    }
  }

  // Methods
  const showModal = () => {
    modalVisible.value = true
    loadMchList()
  }

  const handleOk = () => {
    if (selectedMch.value) {
      emit('update:value', selectedMch.value.mchNo)
      emit('change', selectedMch.value.mchNo)
      selectedMchName.value = selectedMch.value.mchName || ''
    }
    modalVisible.value = false
  }

  const handleCancel = () => {
    modalVisible.value = false
  }

  const handleRadioChange = ({ row }: { row: Merchant }) => {
    selectedMch.value = row
  }

  const handleSearch = () => {
    pagination.value.current = 1
    loadMchList()
  }

  const handlePageChange = ({
    currentPage,
    pageSize,
  }: {
    currentPage: number
    pageSize: number
  }) => {
    pagination.value.current = currentPage
    pagination.value.size = pageSize
    loadMchList()
  }

  // Initialize with current value
  onMounted(() => {
    if (props.value) {
      // We'll load the name when we fetch the list
    }
  })

  // Expose methods to parent
  defineExpose({
    showModal,
    handleOk,
    handleCancel,
  })
</script>

<style scoped>
  .mch-select-content {
    max-height: 600px;
    overflow-y: auto;
  }

  .mch-select-search {
    display: flex;
    align-items: center;
  }

  .mch-select-table {
    margin-bottom: 16px;
  }

  .mch-select-pagination {
    text-align: right;
  }

  .mb-3 {
    margin-bottom: 1rem;
  }

  .mt-3 {
    margin-top: 1rem;
  }
</style>
