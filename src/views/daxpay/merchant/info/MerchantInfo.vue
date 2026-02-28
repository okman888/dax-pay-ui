<template>
  <div class="merchant-overview">
    <!-- 顶部商户信息和操作区域 -->
    <div class="top-section">
      <a-card class="merchant-info-card" :bordered="false">
        <a-row :gutter="24">
          <!-- 左侧商户信息 -->
          <a-col :span="12">
            <div class="merchant-info">
              <div class="merchant-header">
                <h2 class="merchant-name">{{ merchantInfo.mchName || '' }}</h2>
                <a-tag color="green" v-if="merchantInfo.status === 'enable'" class="merchant-status"
                  >启用</a-tag
                >
                <a-tag color="red" v-else class="merchant-status">停用</a-tag>
              </div>
              <div class="merchant-details">
                <div class="detail-item">
                  <span class="label">商户号：</span>
                  <span class="value">{{ merchantInfo.mchNo }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">所属服务商：</span>
                  <span class="value">{{ merchantInfo.isvName }}</span>
                </div>
              </div>
            </div>
          </a-col>

          <!-- 右侧操作按钮 -->
          <a-col :span="12">
            <div class="action-buttons">
              <a-row :gutter="[16, 16]">
                <a-col :span="24">
                  <a-button type="primary" size="large" block @click="showCredentialConfig">
                    <template #icon>
                      <Icon icon="ant-design:setting-outlined" />
                    </template>
                    对接配置
                  </a-button>
                </a-col>
              </a-row>
            </div>
          </a-col>
        </a-row>
      </a-card>
    </div>

    <!-- 我的应用列表 -->
    <div class="app-section">
      <a-card :bordered="false">
        <template #title>
          <div class="section-title">
            <Icon icon="ant-design:appstore-outlined" />
            我的应用
          </div>
        </template>

        <div class="app-list">
          <a-row :gutter="[24, 24]">
            <a-col :span="6" v-for="item in pagination.records" :key="item?.id">
              <a-card class="app-card" hoverable>
                <div class="app-header">
                  <h4 class="app-name" @click="showApp(item)">
                    {{ item?.appName }}
                    <span v-if="item?.defaultApp" style="color: #ff4d4f; margin-left: 4px"
                      >(默认应用)</span
                    >
                  </h4>
                  <a-button size="small" @click="editApp(item)">修改</a-button>
                </div>
                <div class="app-id">应用ID: {{ item?.appId || '' }}</div>
                <div class="app-actions">
                  <a-tag color="blue">{{
                    dictConvert('mch_app_status', item?.status) || '空'
                  }}</a-tag>
                  <a-button type="link" size="small" @click="showChannelSetup(item)">
                    通道配置
                  </a-button>
                  <a-dropdown>
                    <a-button type="link" size="small">
                      更多 <Icon icon="ant-design:down-outlined" />
                    </a-button>
                    <template #overlay>
                      <a-menu>
                        <a-menu-item @click="showGatewayPay(item)">网关支付</a-menu-item>
                        <a-menu-item @click="toggleDefaultApp(item)">
                          {{ item?.defaultApp ? '清除默认' : '设为默认' }}
                        </a-menu-item>
                        <a-menu-item danger @click="removeApp(item)">删除</a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </div>
              </a-card>
            </a-col>

            <!-- 添加新应用卡片 -->
            <a-col :span="6">
              <a-card class="add-app-card" hoverable @click="addApp">
                <div class="add-content">
                  <Icon icon="ant-design:plus-outlined" :size="32" />
                  <span>添加新应用</span>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-card>
    </div>

    <!-- 弹窗组件 -->
    <mch-app-edit ref="mchApp" @ok="queryPage" />
    <channel-config-list ref="channelSetup" />
    <GatewayConfigModel ref="gatewayConfigModel" />
    <MerchantCredentialConfig ref="merchantCredentialModel" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { Merchant } from '@/views/daxpay/admin/merchant/info/Merchant.api'
  import { get } from './MerchantInfo.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import Icon from '@/components/Icon/Icon.vue'
  import useTablePage from '@/hooks/bootx/useTablePage'
  import { del, page, setDefault, clearDefault } from '../app/MchApp.api'
  import { FormEditType } from '@/enums/formTypeEnum'
  import { useDict } from '@/hooks/bootx/useDict'
  import MchAppEdit from '@/views/daxpay/merchant/app/MchAppEdit.vue'
  import ChannelConfigList from '@/views/daxpay/common/merchant/config/ChannelConfigList.vue'
  import GatewayConfigModel from '@/views/daxpay/common/merchant/gateway/GatewayConfigModel.vue'
  import MerchantCredentialConfig from '@/views/daxpay/common/merchant/credential/MerchantCredentialConfig.vue'

  const { createConfirm, createMessage } = useMessage()
  const { pageQueryResHandel, pagination, pages, model } = useTablePage(queryPage)
  const { dictConvert } = useDict()

  let merchantInfo = ref<Merchant>({})
  let edit = ref(false)

  // 应用相关的refs
  const mchApp = ref<any>()
  const channelSetup = ref<any>()
  const gatewayConfigModel = ref<any>()

  // 商户信息相关的refs
  const merchantCredentialModel = ref<any>()

  onMounted(() => {
    initData()
    queryPage()
  })

  /**
   * 初始化商户数据
   */
  function initData() {
    edit.value = false
    get().then(({ data }) => {
      merchantInfo.value = data
    })
  }

  // 应用列表相关方法
  function queryPage() {
    page({
      ...model.queryParam,
      ...pages,
    }).then(({ data }) => {
      pageQueryResHandel(data)
    })
    return Promise.resolve()
  }

  // 操作按钮点击事件
  function showCredentialConfig() {
    merchantCredentialModel.value.init(merchantInfo.value.mchNo)
  }

  function addApp() {
    mchApp.value.init(null, FormEditType.Add)
  }

  function editApp(record) {
    mchApp.value.init(record.id, FormEditType.Edit)
  }

  function showApp(record) {
    mchApp.value.init(record.id, FormEditType.Show)
  }

  function showChannelSetup(record) {
    channelSetup.value.init(record)
  }

  function showGatewayPay(record) {
    gatewayConfigModel.value.init(record)
  }

  function removeApp(record) {
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

  function toggleDefaultApp(record) {
    const action = record.defaultApp ? '清除默认' : '设为默认'
    createConfirm({
      iconType: 'warning',
      title: '确认操作',
      content: `确定要${action}该应用吗？`,
      onOk: () => {
        const apiCall = record.defaultApp ? clearDefault(record.id) : setDefault(record.id)
        apiCall.then(() => {
          createMessage.success(`${action}成功`)
          queryPage()
        })
      },
    })
  }
</script>

<style scoped lang="less">
  .merchant-overview {
    padding: 16px;
    background-color: #f5f5f5;
    min-height: 80vh;

    .top-section {
      margin-bottom: 24px;

      .merchant-info-card {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;

        .merchant-info {
          .merchant-header {
            display: flex;
            align-items: center;
            margin-bottom: 24px;

            .merchant-name {
              margin: 0 16px 0 0;
              font-size: 24px;
              font-weight: 600;
              color: #1f2937;
            }

            .merchant-status {
              font-size: 14px;
            }
          }

          .merchant-details {
            .detail-item {
              display: flex;
              margin-bottom: 12px;
              font-size: 14px;

              .label {
                color: #6b7280;
                width: 150px;
                flex-shrink: 0;
              }

              .value {
                color: #1f2937;
                font-weight: 500;
              }
            }
          }
        }

        .action-buttons {
          display: flex;
          align-items: center;
          height: 100%;
        }
      }
    }

    .app-section {
      .section-title {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-weight: 600;
        color: #1f2937;

        .anticon {
          margin-right: 8px;
          color: #1890ff;
        }
      }

      .app-list {
        .app-card {
          height: 160px;
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          }

          .app-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            .app-name {
              margin: 0;
              font-size: 16px;
              font-weight: 600;
              color: #1f2937;
              cursor: pointer;

              &:hover {
                color: #1890ff;
              }
            }
          }

          .app-id {
            font-size: 12px;
            color: #6b7280;
            margin-bottom: 16px;
          }

          .app-actions {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
          }
        }

        .add-app-card {
          height: 160px;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;

          &:hover {
            border-color: #1890ff;
            background-color: #f0f9ff;
          }
          :deep(.ant-card-body) {
            height: 100%;
          }
          .add-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #6b7280;

            .anticon {
              margin-bottom: 8px;
              color: #9ca3af;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            span {
              font-size: 14px;
              text-align: center;
            }
          }

          &:hover .add-content {
            color: #1890ff;

            .anticon {
              color: #1890ff;
            }
          }
        }
      }
    }
  }
</style>
