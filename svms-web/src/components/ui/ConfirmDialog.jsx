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
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button className="w-full" variant="secondary" onClick={onClose}>
          Kembali
        </Button>
        <Button className="w-full" variant="danger" isLoading={isLoading} onClick={onConfirm}>
          Ya, lanjutkan
        </Button>
      </div>
    </Modal>
  );
}
