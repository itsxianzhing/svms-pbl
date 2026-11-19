import { Modal } from './Modal';
import { Button } from './Button';
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message,
  isLoading,
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Kembali
        </Button>
        <Button variant="danger" isLoading={isLoading} onClick={onConfirm}>
          Ya, lanjutkan
        </Button>
      </div>
    </Modal>
  );
}
