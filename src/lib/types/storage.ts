export type StorageType = "oss" | "s3" | "r2" | "minio" | "localfs"
export const StorageTypeValue = ["oss", "s3", "r2", "minio", "localfs"]

export interface StorageConfig {
  id: string
  type: StorageType
  endpoint?: string
  region?: string
  accountId?: string
  bucketName?: string
  accessKeyId?: string
  accessKeySecret?: string
  customPath?: string
  accessUrlPrefix: string
  isEnabled: boolean
}
