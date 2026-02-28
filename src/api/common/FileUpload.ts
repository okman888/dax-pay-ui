import { defHttp } from '@/utils/http/axios'
import { UploadFileParams } from '#/axios'
import { UploadApiResult } from '@/api/sys/model/uploadModel'
import { getAppEnvConfig } from '@/utils/env'
import { AxiosProgressEvent } from 'axios'

const { VITE_GLOB_API_URL, VITE_GLOB_API_URL_PREFIX } = getAppEnvConfig()

/**
 * 上传文件
 * @param params
 * @param onUploadProgress
 */
export function uploadFile(
  params: UploadFileParams,
  onUploadProgress: (progressEvent: AxiosProgressEvent) => void,
) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: VITE_GLOB_API_URL + VITE_GLOB_API_URL_PREFIX + '/file/upload',
      onUploadProgress,
    },
    params,
  )
}
