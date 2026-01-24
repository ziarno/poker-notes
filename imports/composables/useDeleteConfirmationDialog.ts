import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useDeleteConfirmationDialog(
  onConfirm: (...args: any[]) => Promise<void>
) {
  const confirm = useConfirm()
  const toast = useToast()
  const { t } = useI18n()

  return function (...args: any[]) {
    confirm.require({
      header: t('delete_confirm_title'),
      message: t('delete_confirm_description'),
      rejectProps: {
        label: t('cancel'),
        severity: 'secondary',
        outlined: true,
      },
      acceptProps: {
        label: t('delete_confirm_button'),
      },
      accept: async () => {
        try {
          await onConfirm(...args)
          toast.add({
            severity: 'success',
            summary: t('delete_confirm_title'),
            detail: t('delete_toast_confirmed'),
            life: 1000,
          })
        } catch (error) {
          toast.add({
            severity: 'error',
            summary: t('error'),
            detail: t('something_wrong'),
            life: 3000,
          })
        }
      },
    })
  }
}
