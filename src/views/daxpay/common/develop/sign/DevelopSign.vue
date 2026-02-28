<template>
  <div class="develop-sign-debug">
    <a-tabs>
      <a-tab-pane key="sign" tab="签名生成">
        <!-- 签名生成区域 -->
        <div class="sign-section">
          <a-form
            ref="signFormRef"
            :model="signForm"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            @finish="handleGenSign"
          >
            <a-form-item
              label="待签名参数"
              name="param"
              :rules="[{ required: true, message: '请输入待签名参数' }]"
            >
              <a-textarea
                v-model:value="signForm.param"
                placeholder="请输入待签名参数（JSON格式）"
                :rows="4"
              />
            </a-form-item>
            <a-form-item
              label="私钥"
              name="privateKey"
              :rules="[{ required: true, message: '请输入私钥' }]"
            >
              <a-textarea
                v-model:value="signForm.privateKey"
                placeholder="请输入RSA私钥"
                :rows="6"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
              <a-space>
                <a-button type="primary" html-type="submit" :loading="signLoading">
                  生成签名
                </a-button>
                <a-button @click="genSignString" :loading="signStrLoading">
                  生成签名字符串
                </a-button>
                <a-button @click="resetSignForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
          <!-- 签名结果显示 -->
          <div v-if="signResult.signStr || signResult.sign" class="result-section">
            <a-divider>签名结果</a-divider>
            <div v-if="signResult.signStr" class="result-item">
              <h4>签名字符串：</h4>
              <a-textarea :value="signResult.signStr" :rows="4" readonly class="result-textarea" />
              <a-button size="small" @click="copyToClipboard(signResult.signStr)" class="copy-btn">
                复制
              </a-button>
            </div>
            <div v-if="signResult.sign" class="result-item">
              <h4>签名值：</h4>
              <a-textarea :value="signResult.sign" :rows="2" readonly class="result-textarea" />
              <a-button size="small" @click="copyToClipboard(signResult.sign)" class="copy-btn">
                复制
              </a-button>
            </div>
          </div>
        </div>
      </a-tab-pane>
      <a-tab-pane key="verify" tab="签名验证">
        <!-- 签名验证区域 -->
        <div class="verify-section">
          <!-- 验证结果显示 -->
          <div v-if="verifyResult !== null" class="result-section">
            <div class="verify-result">
              <a-result
                :status="verifyResult ? 'success' : 'error'"
                :title="verifyResult ? '签名验证成功' : '签名验证失败'"
                :sub-title="
                  verifyResult
                    ? '签名有效，参数完整性验证通过'
                    : '签名无效，请检查参数和公钥是否正确'
                "
              />
            </div>
          </div>
          <a-form
            ref="verifyFormRef"
            :model="verifyForm"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            @finish="handleVerifySign"
          >
            <a-form-item
              label="待验证参数"
              name="param"
              :rules="[{ required: true, message: '请输入待验证参数' }]"
            >
              <a-textarea
                v-model:value="verifyForm.param"
                placeholder="请输入待验证参数（包含签名的完整参数, JSON格式）"
                :rows="4"
              />
            </a-form-item>
            <a-form-item
              label="公钥"
              name="publicKey"
              :rules="[{ required: true, message: '请输入公钥' }]"
            >
              <a-textarea
                v-model:value="verifyForm.publicKey"
                placeholder="请输入RSA公钥"
                :rows="4"
              />
            </a-form-item>
            <a-form-item :wrapper-col="{ offset: 4, span: 20 }">
              <a-space>
                <a-button type="primary" html-type="submit" :loading="verifyLoading">
                  验证签名
                </a-button>
                <a-button @click="resetVerifyForm">重置</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref } from 'vue'
  import { genSign, genSignStr, verifySign } from './DevelopSign.api'
  import { useMessage } from '@/hooks/web/useMessage'
  import { FormInstance } from 'ant-design-vue'

  const { createMessage } = useMessage()

  // 签名表单
  const signForm = reactive({
    param: '',
    privateKey: '',
  })

  // 验证表单
  const verifyForm = reactive({
    param: '',
    publicKey: '',
  })

  // 加载状态
  const signLoading = ref(false)
  const signStrLoading = ref(false)
  const verifyLoading = ref(false)

  // 结果数据
  const signResult = reactive({
    signStr: '',
    sign: '',
  })
  const verifyResult = ref<boolean | null>(null)
  const verifyFormRef = ref<FormInstance>()
  const signFormRef = ref<FormInstance>()

  /**
   * 生成签名字符串
   */
  async function genSignString() {
    if (!signForm.param) {
      createMessage.warning('请输入待签名参数')
      return
    }

    try {
      signStrLoading.value = true
      const { data } = await genSignStr(signForm.param)
      signResult.signStr = data
      createMessage.success('签名字符串生成成功')
    } catch (error) {
      createMessage.error('生成签名字符串失败')
    } finally {
      signStrLoading.value = false
    }
  }

  /**
   * 生成签名
   */
  async function handleGenSign() {
    try {
      signLoading.value = true
      const { data } = await genSign(signForm.param, signForm.privateKey)
      signResult.sign = data
      createMessage.success('签名生成成功')
    } catch (error) {
      createMessage.error('生成签名失败')
    } finally {
      signLoading.value = false
    }
  }

  /**
   * 验证签名
   */
  async function handleVerifySign() {
    try {
      verifyLoading.value = true
      const { data } = await verifySign(verifyForm.param, verifyForm.publicKey)
      createMessage.success('签名验证完成')
      verifyResult.value = data
    } catch (error) {
      createMessage.error('验证签名失败')
      verifyResult.value = false
    } finally {
      verifyLoading.value = false
    }
  }

  /**
   * 重置签名表单
   */
  function resetSignForm() {
    signForm.param = ''
    signForm.privateKey = ''
    signResult.signStr = ''
    signResult.sign = ''
    signFormRef.value?.resetFields()
  }

  /**
   * 重置验证表单
   */
  function resetVerifyForm() {
    verifyForm.param = ''
    verifyForm.publicKey = ''
    verifyResult.value = null
    verifyFormRef.value?.resetFields()
  }

  /**
   * 复制到剪贴板
   */
  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text)
      createMessage.success('复制成功')
    } catch (error) {
      createMessage.error('复制失败')
    }
  }
</script>

<style scoped lang="less">
  :deep(.result-section) {
    padding: 16px;
  }
  :deep(.ant-result) {
    padding: 0 32px;
  }
  :deep(.ant-result-icon) {
    margin-bottom: 0;
    svg {
      height: 50px;
    }
  }
  .develop-sign-debug {
    padding: 16px;
    background-color: #fff;

    .result-section {
      padding: 16px;
      border-radius: 6px;

      .result-item {
        margin-bottom: 16px;
        position: relative;

        &:last-child {
          margin-bottom: 0;
        }
        .copy-btn {
          position: absolute;
          top: 32px;
          right: 8px;
        }
      }

      .verify-result {
        text-align: center;
        svg {
          font-size: 32px;
        }
      }
    }
  }
</style>
