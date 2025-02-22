import { useState } from "react"
import type { LoginFormData, RegisterFormData } from "@/lib/validations/user-schema"
import { getBrowserLang } from "@/lib/i18n/utils"
import env from "@/env.ts"

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)

  const login = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(env.API_URL + "/api/user/login", {
        method: "POST",
        body: JSON.stringify(data), // 使用 FormData 发送数据
        headers: {
          "Content-Type": "application/json",
          Domain: window.location.origin,
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
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("username", res.data.username)
        localStorage.setItem("uid", res.data.uid)
        localStorage.setItem("avatar", res.data.avatar)
        localStorage.setItem("email", res.data.email)
        return { success: true, message: res.data.message }
      }
    } catch (error) {
      return { success: false, error: "接口请求失败,请检查网络状态" }
    } finally {
      setIsLoading(false)
    }
  }

  const registerUser = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch(env.API_URL + "/api/user/register", {
        method: "POST",
        body: JSON.stringify(data), // 使用 FormData 发送数据
        headers: {
          "Content-Type": "application/json",
          Domain: window.location.origin,
          Lang: getBrowserLang()
        },
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const res = await response.json()
      if (res.code !== 1) {
        return { success: false, error: res.message + ": " + res.details }
      } else {
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("username", res.data.username)
        localStorage.setItem("uid", res.data.uid)
        localStorage.setItem("avatar", res.data.avatar)
        localStorage.setItem("email", res.data.email)
        return { success: true }
      }
    } catch (error) {
      return { success: false, error: "注册失败，请重试" }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    login,
    registerUser,
  }
}
