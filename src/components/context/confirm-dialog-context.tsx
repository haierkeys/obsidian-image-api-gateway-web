import React, { createContext, useContext, useState, ReactNode } from "react"
import { ConfirmDialog } from "@/components/dialog/confirm-dialog"

// 定义上下文的类型
interface ConfirmDialogContextType {
  isDialogOpen: boolean
  message: string
  type: string
  openConfirmDialog: (message: string, type?: string, onConfirm?: () => void) => void
}

// 创建上下文
const ConfirmDialogContext = createContext<ConfirmDialogContextType | undefined>(undefined)

// 提供者组件
export const ConfirmDialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const handleCancel = () => setIsDialogOpen(false)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [type, setType] = useState("error")
  const [handleConfirm, setHandleConfirm] = useState<() => {}>()

  const openConfirmDialog = (message: string, type?: string, onConfirm?: () => void) => {
    setHandleConfirm(() => handleCancel)
    setMessage(message)
    setType(type!)
    setIsDialogOpen(true)
    if (onConfirm) {
      setHandleConfirm(() => () => {
          onConfirm()
          handleCancel()
      })
    }
  }

  return (
    <ConfirmDialogContext.Provider value={{ isDialogOpen, message, type, openConfirmDialog }}>
      {children}
      <ConfirmDialog isOpen={isDialogOpen} onCancel={handleCancel} onConfirm={handleConfirm} message={message} type={type} />
    </ConfirmDialogContext.Provider>
  )
}

// 自定义钩子
export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext)
  if (!context) {
    throw new Error("useConfirmDialog must be used within a ConfirmDialogProvider")
  }
  return context
}
