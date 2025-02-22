import * as z from "zod"
import { StorageTypeValue, type StorageType } from "@/lib/types/storage"

export const storageSchema = z.object({
  type: z.enum(StorageTypeValue as [StorageType], {
    required_error: "请选择存储类型",
  }),
  endpoint: z.string().optional(),
  region: z.string().optional(),
  accountId: z.string().optional(),
  bucketName: z.string().min(1, "存储桶名称不能为空"),
  accessKeyId: z.string().min(1, "AccessKey ID 不能为空"),
  accessKeySecret: z.string().min(1, "AccessKey Secret 不能为空"),
  customPath: z.string().optional(),
  accessUrlPrefix: z.string().min(1, "访问地址前缀不能为空"),
  isEnabled: z.union([z.boolean(), z.number()])
    .transform((val) => Boolean(val))
    .default(false)
    .optional(),
})

export type StorageFormData = z.infer<typeof storageSchema>