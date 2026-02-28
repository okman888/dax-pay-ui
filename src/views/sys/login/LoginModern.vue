<template>
  <div class="modern-login-container">
    <!-- 顶部导航 -->
    <div class="top-header">
      <div class="header-content">
        <AppLogo :alwaysShowTitle="true" class="logo" />
        <div class="header-actions">
          <AppDarkModeToggle class="theme-toggle" v-if="!sessionTimeout" />
        </div>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="main-wrapper">
      <div class="content-container">
        <!-- 左侧信息区 -->
        <div class="info-section">
          <div class="info-content">
            <div class="welcome-text">
              <h1 class="main-title">欢迎使用</h1>
              <h2 class="sub-title">{{ getSystemName() }}</h2>
              <p class="description">
                简单、安全、高效的支付解决方案。 支持支付、分账、进件、分润等功能，
                为您的业务提供全方位的支付服务支持。
              </p>
            </div>

            <!-- 优势展示 -->
            <div class="advantages">
              <div class="advantage-item">
                <div class="advantage-icon">
                  <CheckCircleOutlined />
                </div>
                <span>安全可靠：使用企业级架构开发</span>
              </div>
              <div class="advantage-item">
                <div class="advantage-icon">
                  <RocketOutlined />
                </div>
                <span>快速接入：对外提供标准接口对接</span>
              </div>
              <div class="advantage-item">
                <div class="advantage-icon">
                  <CustomerServiceOutlined />
                </div>
                <span>专业服务：业务 + 技术全能开发团队</span>
              </div>
            </div>

            <!-- 装饰图形 -->
            <div class="decoration">
              <div class="circle circle-1"></div>
              <div class="circle circle-2"></div>
              <div class="circle circle-3"></div>
            </div>
          </div>
        </div>

        <!-- 右侧登录区 -->
        <div class="login-section">
          <div class="login-container">
            <div class="login-header">
              <h3 class="login-title">{{ getFormTitle }}</h3>
            </div>
            <div class="form-container">
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 底部版权信息 -->
    <div class="footer">
      <div class="footer-reserved">
        <span
          ><a :href="getCopyrightLink()" target="_blank">{{ getCopyright() }}</a></span
        >
      </div>
      <div class="footer-content">
        <div>
          <span v-if="getIcpInfo()"
            ><img :src="icp" /><a :href="getIcpLink()" target="_blank">{{ getIcpInfo() }}</a></span
          >
          <span v-if="getMpsInfo()"
            ><img :src="beian" /><a :href="getMpsLink()" target="_blank">{{
              getMpsInfo()
            }}</a></span
          >
          <span v-if="getPcacInfo()"
            ><img :src="zf" /><a :href="getPcacLink()" target="_blank">{{ getPcacInfo() }}</a></span
          >
          <span v-if="getIcpPlusInfo()"
            ><img :src="zz" /><a :href="getIcpPlusLink()" target="_blank">{{
              getIcpPlusInfo()
            }}</a></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { AppDarkModeToggle, AppLogo } from '@/components/Application'
  import { computed } from 'vue'
  import {
    CheckCircleOutlined,
    RocketOutlined,
    CustomerServiceOutlined,
  } from '@ant-design/icons-vue'
  import LoginForm from './LoginForm.vue'
  import { isAdmin } from '@/utils/env'
  import {
    getCopyright,
    getCopyrightLink,
    getIcpInfo,
    getIcpLink,
    getIcpPlusInfo,
    getIcpPlusLink,
    getMpsInfo,
    getMpsLink,
    getPcacInfo,
    getPcacLink,
    getSystemName,
  } from '@/logics/initWebsiteConfig'
  import icp from '@/assets/system/icp.png'
  import zz from '@/assets/system/zz.png'
  import zf from '@/assets/system/zf.png'
  import beian from '@/assets/system/beian.png'

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  })

  const loginTitle = () => {
    if (isAdmin()) {
      return '运营端登录'
    }
    return '商户登录'
  }

  const getFormTitle = computed(() => {
    return loginTitle()
  })
</script>

<style lang="less" scoped>
  .modern-login-container {
    height: 100vh;
    background: #f8fafc;
    display: flex;
    flex-direction: column;

    .top-header {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      padding: 0;
      flex-shrink: 0;
      height: 64px; // 固定顶部导航高度

      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 16px 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 100%;
        .logo {
          :deep(img) {
            width: 32px;
          }
        }
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;

          .theme-toggle {
            :deep(.anticon) {
              color: #64748b;
            }
          }

          .lang-btn {
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 4px;

            &:hover {
              color: #3b82f6;
              background: #f1f5f9;
            }
          }
        }
      }
    }

    .main-wrapper {
      flex: 1;
      display: flex;
      align-items: flex-start;
      justify-content: center;
      overflow-y: auto;
      padding: 60px 0;

      .content-container {
        width: 100%;
        max-width: 1000px;
        display: grid;
        grid-template-columns: 1fr 400px;
        gap: 80px;
        align-items: flex-start;

        @media (max-width: 1024px) {
          grid-template-columns: 1fr;
          gap: 40px;
          max-width: 400px;
          align-items: center;
        }

        .info-section {
          @media (max-width: 1024px) {
            display: none;
          }

          .info-content {
            position: relative;
            margin-top: 80px;
            .welcome-text {
              margin-bottom: 48px;

              .main-title {
                font-size: 48px;
                font-weight: 300;
                color: #1e293b;
                margin: 0 0 8px 0;
                line-height: 1.2;
              }

              .sub-title {
                font-size: 32px;
                font-weight: 700;
                color: #3b82f6;
                margin: 0 0 24px 0;
                line-height: 1.2;
              }

              .description {
                font-size: 16px;
                color: #64748b;
                line-height: 1.6;
                margin: 0;
              }
            }

            .advantages {
              display: flex;
              flex-direction: column;
              gap: 20px;

              .advantage-item {
                display: flex;
                align-items: center;
                gap: 16px;
                font-size: 16px;
                color: #475569;

                .advantage-icon {
                  width: 40px;
                  height: 40px;
                  border-radius: 50%;
                  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 18px;
                }
              }
            }

            .decoration {
              position: absolute;
              top: 0;
              right: -40px;
              width: 200px;
              height: 200px;
              pointer-events: none;
              z-index: -1;

              .circle {
                position: absolute;
                border-radius: 50%;
                opacity: 0.1;

                &.circle-1 {
                  width: 120px;
                  height: 120px;
                  background: #3b82f6;
                  top: 20px;
                  right: 20px;
                  animation: float 6s ease-in-out infinite;
                }

                &.circle-2 {
                  width: 80px;
                  height: 80px;
                  background: #10b981;
                  top: 80px;
                  right: 80px;
                  animation: float 4s ease-in-out infinite reverse;
                }

                &.circle-3 {
                  width: 60px;
                  height: 60px;
                  background: #f59e0b;
                  top: 140px;
                  right: 40px;
                  animation: float 5s ease-in-out infinite;
                }
              }
            }
          }
        }

        .login-section {
          .login-container {
            background: #ffffff;
            border-radius: 16px;
            padding: 40px;
            box-shadow:
              0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid #e2e8f0;

            .login-header {
              text-align: center;
              margin-bottom: 32px;

              .login-title {
                font-size: 24px;
                font-weight: 600;
                color: #1e293b;
                margin: 0 0 8px 0;
              }

              .login-desc {
                color: #64748b;
                margin: 0;
                font-size: 14px;
              }
            }

            .form-container {
              margin-bottom: 24px;
            }

            .quick-login {
              .divider-text {
                color: #94a3b8;
                font-size: 12px;
              }

              .quick-options {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin-top: 16px;

                .quick-btn {
                  border: 1px solid #e2e8f0;
                  color: #64748b;

                  &:hover {
                    border-color: #3b82f6;
                    color: #3b82f6;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .footer {
    padding: 14px 32px;
    background: #ffffff;
    border-top: 1px solid #e2e8f0;
    color: #94a3b8;
    font-size: 14px;
    flex-shrink: 0;
    height: 80px; // 固定底部导航高度

    .footer-reserved {
      display: flex;
      justify-content: center;
      margin-bottom: 8px;
    }
    .footer-content {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        margin: 0 12px;
      }
    }
    img {
      width: 14px;
      margin-right: 4px;
      vertical-align: middle;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
  }
</style>
