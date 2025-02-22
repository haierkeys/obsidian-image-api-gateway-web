import { useState, useEffect } from "react"
import { CirclePlus, Pencil, Trash2, Check, User, LogOut, Clipboard, Info } from "lucide-react"
//https://lucide.dev/icons/
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { StorageConfig } from "@/lib/types/storage"
import { StorageForm } from "@/components/storage/storage-form"
import { handleStorage } from "@/components/api-handle/storage-handle"
import { useAuth } from "@/components/context/auth-context"
import env from "@/env.ts"
import { Cloudflare, Aws, AlibabaCloud } from "@lobehub/icons"
// https://github.com/lobehub/lobe-icons
import { useConfirmDialog } from "@/components/context/confirm-dialog-context"
import { useTranslation } from "react-i18next"

export function StorageList() {
  useEffect(() => {
    reloadList()
  }, [])

  //语言包
  const { t } = useTranslation()

  const { logout } = useAuth()

  const [configs, setConfigs] = useState<StorageConfig[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const username = localStorage.getItem("username")
  const email = localStorage.getItem("email")

  const { openConfirmDialog } = useConfirmDialog() // 使用 useContext 来获取上下文值

  const { handleStorageList, handleStorageDelete } = handleStorage()

  const reloadList = async () => {
    handleStorageList(setConfigs)
  }

  const handleAdd = async () => {
    handleStorageList(setConfigs)
    setIsAddDialogOpen(false)

  }

  const handleEdit = async () => {
    handleStorageList(setConfigs)
    setIsAddDialogOpen(false)
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    openConfirmDialog(t("confirmDelete"), "confirm", async () => {
      setConfigs(configs.filter((config) => config.id !== id))
      handleStorageDelete(id)
    })
  }

  const handleCopyConfig = () => {
    const config = {
      api: env.API_URL + "/api/user/upload",
      apiToken: localStorage.getItem("token")!,
    }

    const configText = JSON.stringify(config, null, 2)

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(configText)
        .then(() => {
         openConfirmDialog(t("copyConfigSuccess"), "success")
        })
        .catch((err) => {
          openConfirmDialog(t("error") + err)
        })
    } else {
      openConfirmDialog(t("error") + "Clipboard API 不可用")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">{t("storageManagement")}</h2>
          <Button className="bg-gray-500 hover:bg-gray-600" onClick={() => setIsAddDialogOpen(true)}>
            <CirclePlus className=" h-4 w-4" />
            {t("add")}
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <User className="h-4 w-4" />
          <span className="text-sm">
            {username} ( {email} )
          </span>
          <Button variant="outline" onClick={logout}>
            {t("logout")}
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-right">{t("actions")}</TableHead>
            <TableHead>{t("type")}</TableHead>

            <TableHead>{t("isEnabled")}</TableHead>
            <TableHead>{t("bucketName")}</TableHead>
            <TableHead>{t("customPath")}</TableHead>
            <TableHead>{t("accessUrlPrefix")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {configs.map((config) => (
            <TableRow key={config.id} className={config.isEnabled ? "bg-green-100" : ""}>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" className="text-gray-400 p-0 m-0" size="sm" onClick={() => setEditingId(config.id)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 p-0 m-0" onClick={() => handleDelete(config.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                {config.type.toLowerCase() == "s3" ? <Aws size={18} className="flex float-left mr-2 text-blue-500 " /> : ""}
                {config.type.toLowerCase() == "r2" ? <Cloudflare size={18} className="flex float-left mr-2 text-blue-500 " /> : ""}
                {config.type.toLowerCase() == "oss" ? <AlibabaCloud size={18} className="flex float-left mr-2 text-blue-500 " /> : ""}
                {config.type.toUpperCase()}
              </TableCell>

              <TableCell>{config.isEnabled ? <Check className="h-4 w-4" /> : ""}</TableCell>
              <TableCell>{config.bucketName}</TableCell>
              <TableCell>{config.customPath ? "/" + config.customPath + "/" : ""}</TableCell>
              <TableCell>{config.accessUrlPrefix || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <p className="flex text-sm text-gray-500">
          <Info className="mr-1   h-4 w-4 place-self-center " />
          {t("tableScrollsShowMore")}
        </p>
        <Button variant="outline" className="text-gray-500" size="sm" onClick={handleCopyConfig}>
          <Clipboard className="h-4 w-4" />
          {t("copyConfig")}
        </Button>
        {/* <Button onClick={() => openConfirmDialog(t("copyConfigSuccess"), "success")}>success</Button>
        <Button onClick={() => openConfirmDialog(t("copyConfigSuccess"), "error")}>error</Button>
        <Button onClick={() => openConfirmDialog(t("copyConfigSuccess"), "warning")}>warning</Button>
        <Button onClick={() => openConfirmDialog(t("copyConfigSuccess"), "info")}>info</Button>
        <Button onClick={() => openConfirmDialog(t("copyConfigSuccess"), "confirm")}>confirm</Button> */}
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("addStorage")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <StorageForm onSubmit={handleAdd} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingId} onOpenChange={() => setEditingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("editStorage")}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {editingId && <StorageForm config={configs.find((c) => c.id === editingId)} onSubmit={handleEdit} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
