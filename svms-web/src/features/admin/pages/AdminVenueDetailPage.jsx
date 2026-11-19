import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { venuesApi } from '@/features/venues/api';
import { courtsApi } from '@/features/courts/api';
import { useFetch } from '@/hooks/useFetch';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import { rupiah } from '@/lib/format';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';

const emptyCourt = { name: '', pricePerHour: '', isActive: true };

export function CourtFormModal({ court, venueId, onClose, onSaved }) {
  const [form, setForm] = useState(
    court ? { ...court, pricePerHour: String(court.pricePerHour) } : emptyCourt
  );
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { show } = useToast();
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const body = { ...form, pricePerHour: Number(form.pricePerHour) };
      const saved = court
        ? await courtsApi.update(court.id, body)
        : await courtsApi.create(venueId, body);
      show(court ? 'Court diperbarui' : 'Court ditambahkan');
      onSaved(saved);
      onClose();
    } catch (error) {
      setErrors(error.errors || {});
      show(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal open onClose={onClose} title={court ? 'Ubah court' : 'Tambah court'}>
      <form className="space-y-3" onSubmit={submit}>
        <Input
          label="Nama court"
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Harga per jam"
          type="number"
          min="1"
          required
          value={form.pricePerHour}
          error={errors.pricePerHour}
          onChange={(e) => setForm({ ...form, pricePerHour: e.target.value })}
        />
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />{' '}
          Aktif dan dapat dipesan
        </label>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button isLoading={saving}>{court ? 'Simpan perubahan' : 'Tambah court'}</Button>
        </div>
      </form>
    </Modal>
  );
}

export function AdminVenueDetailPage() {
  const { venueId } = useParams();
  const { data: venue, error, refetch } = useFetch(() => venuesApi.get(venueId), [venueId]);
  const [editing, setEditing] = useState();
  const [deleting, setDeleting] = useState();
  const [isDeleting, setDeletingState] = useState(false);
  const { show } = useToast();
  const remove = async () => {
    setDeletingState(true);
    try {
      await courtsApi.remove(deleting.id);
      show('Court dihapus');
      setDeleting();
      refetch();
    } catch (error) {
      show(
        error.status === 409
          ? 'Court tidak dapat dihapus karena sudah memiliki booking. Nonaktifkan court sebagai gantinya.'
          : error.message,
        'error'
      );
    } finally {
      setDeletingState(false);
    }
  };
  if (error) return <ErrorState error={error} refetch={refetch} />;
  if (!venue) return <p>Memuat venue...</p>;
  return (
    <>
      <PageHeader
        title={venue.name}
        subtitle={`${venue.type} · ${venue.address}, ${venue.city}`}
        action={
          <div className="flex gap-2">
            <Link to="/admin/venues">
              <Button variant="secondary">Kembali</Button>
            </Link>
            <Button onClick={() => setEditing(emptyCourt)}>Tambah court</Button>
          </div>
        }
      />
      <Card className="mb-6">
        <h2 className="font-semibold">Informasi venue</h2>
        <p className="mt-2 text-sm text-slate-600">{venue.description || 'Tidak ada deskripsi.'}</p>
        <p className="mt-3 text-sm text-slate-500">{venue.courtCount} court terdaftar</p>
      </Card>
      <ResponsiveTable columns={[{ key: 'name', label: 'Court' }, { key: 'pricePerHour', label: 'Harga/jam', render: (court) => <span className="tabular-nums">{rupiah(court.pricePerHour)}</span> }, { key: 'isActive', label: 'Status', render: (court) => court.isActive ? 'Aktif' : 'Nonaktif' }]} rows={venue.courts} renderActions={(court) => <><Button size="sm" variant="secondary" onClick={() => setEditing(court)} title="Ubah court">Ubah</Button><Button size="sm" variant="danger" onClick={() => setDeleting(court)} title="Hapus court">Hapus</Button></>} />
        {!venue.courts.length && (
          <p className="rounded-b-2xl p-6 text-center text-sm text-slate-500">Belum ada court.</p>
        )}
      {editing && (
        <CourtFormModal
          court={editing.id ? editing : undefined}
          venueId={venueId}
          onClose={() => setEditing()}
          onSaved={refetch}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting()}
        onConfirm={remove}
        isLoading={isDeleting}
        title="Hapus court"
        message={`Hapus ${deleting?.name}? Court dengan booking tidak dapat dihapus.`}
      />
    </>
  );
}
