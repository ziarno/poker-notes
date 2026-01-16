import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useI18n } from 'vue-i18n'

export function useDeleteConfirmationDialog(onConfirm: () => Promise<void>) {
  const confirm = useConfirm()
  const toast = useToast()
  const { t } = useI18n()

  return function () {
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
          await onConfirm()
          toast.add({
            severity: 'info',
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
