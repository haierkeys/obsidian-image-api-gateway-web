import env from "@/env.ts"
import { useConfirmDialog } from "@/components/context/confirm-dialog-context"
import { StorageConfig } from "@/lib/types/storage"
import { getBrowserLang } from "@/lib/i18n/utils"

export function handleStorage() {
  const { openConfirmDialog } = useConfirmDialog() // 使用 useContext 来获取上下文值
  const token = localStorage.getItem("token")!

  const handleStorageList = async (callback: (key: any) => void) => {
    const response = await fetch(env.API_URL + "/api/user/cloud_config?limit=100", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Domain: window.location.origin,
        Token: token,
        Lang: getBrowserLang(),
      },
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const res = await response.json()
    if (res.code !== 1) {
      return { success: false, error: res.message + ": " + res.details }
    } else {
      callback(res.data.list)
    }
  }

  const handleStorageDelete = async (id: string) => {
    const data = {
      id: id,
    }
    const response = await fetch(env.API_URL + "/api/user/cloud_config", {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Domain: window.location.origin,
        Token: token,
        Lang: getBrowserLang(),
      },
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const res = await response.json()
    if (res.code > 100) {
      openConfirmDialog(res.message + ": " + res.details, "error")
    }
  }

  const handleStorageUpdate = async (data: StorageConfig, callback: (data2: StorageConfig) => void) => {
    const formData = { ...data, isEnabled: data.isEnabled ? 1 : 0 } as Omit<StorageConfig, "isEnabled"> & { isEnabled: number }

    const response = await fetch(env.API_URL + "/api/user/cloud_config", {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        Domain: window.location.origin,
        Token: token,
        Lang: getBrowserLang(),
      },
    })
    if (!response.ok) {
      throw new Error("Network response was not ok")
    }
    const res = await response.json()
    if (res.code < 100) {
      openConfirmDialog(res.message, "success")
      data.id = res.data
      callback(data)
    } else {
      openConfirmDialog(res.message + ": " + res.details, "error")
    }
  }

  return {
    handleStorageList,
    handleStorageDelete,
    handleStorageUpdate,
  }
}
