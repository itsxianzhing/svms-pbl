import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { venuesApi } from '@/features/venues/api';
import { useFetch } from '@/hooks/useFetch';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ErrorState } from '@/components/ui/ErrorState';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/context/ToastContext';
import { ResponsiveTable } from '@/components/ui/ResponsiveTable';

const emptyVenue = { name: '', type: '', address: '', city: '', description: '' };

export function VenueFormModal({ venue, onClose, onSaved }) {
  const [form, setForm] = useState(venue || emptyVenue);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const { show } = useToast();
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    try {
      const saved = venue ? await venuesApi.update(venue.id, form) : await venuesApi.create(form);
      show(venue ? 'Venue diperbarui' : 'Venue ditambahkan');
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
    <Modal open onClose={onClose} title={venue ? 'Ubah venue' : 'Tambah venue'}>
      <form className="space-y-3" onSubmit={submit}>
        <Input
          label="Nama venue"
          required
          value={form.name}
          error={errors.name}
          onChange={(e) => update('name', e.target.value)}
        />
        <Input
          label="Jenis olahraga"
          required
          value={form.type}
          error={errors.type}
          onChange={(e) => update('type', e.target.value)}
        />
        <Input
          label="Alamat"
          required
          value={form.address}
          error={errors.address}
          onChange={(e) => update('address', e.target.value)}
        />
        <Input
          label="Kota"
          required
          value={form.city}
          error={errors.city}
          onChange={(e) => update('city', e.target.value)}
        />
        <Textarea
          label="Deskripsi"
          value={form.description || ''}
          error={errors.description}
          onChange={(e) => update('description', e.target.value)}
        />
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Batal
          </Button>
          <Button isLoading={saving}>{venue ? 'Simpan perubahan' : 'Tambah venue'}</Button>
        </div>
      </form>
    </Modal>
  );
}

export function AdminVenuesPage() {
  const { data: venues, error, refetch } = useFetch(() => venuesApi.list({}), []);
  const { data: filters = {} } = useFetch(() => venuesApi.filters(), []);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [editing, setEditing] = useState();
  const [deleting, setDeleting] = useState();
  const [isDeleting, setDeletingState] = useState(false);
  const { show } = useToast();
  const rows = useMemo(
    () =>
      (venues || []).filter((venue) => {
        const matchesSearch = `${venue.name} ${venue.address} ${venue.city}`
          .toLowerCase()
          .includes(search.toLowerCase());
        return matchesSearch && (!type || venue.type === type);
      }),
    [venues, search, type]
  );
  const remove = async () => {
    setDeletingState(true);
    try {
      await venuesApi.remove(deleting.id);
      show('Venue dihapus');
      setDeleting();
      refetch();
    } catch (error) {
      show(
        error.status === 409
          ? 'Venue tidak dapat dihapus karena masih memiliki booking.'
          : error.message,
        'error'
      );
    } finally {
      setDeletingState(false);
    }
  };
  return (
    <>
      <PageHeader
        title="Kelola venue"
        subtitle="Tambah, ubah, atau hapus venue."
        action={<Button onClick={() => setEditing(emptyVenue)}>Tambah venue</Button>}
      />
      <div className="mb-5 grid gap-3 md:grid-cols-2">
        <Input label="Cari venue" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Select label="Jenis" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Semua jenis</option>
          {(filters.types || []).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>
      {error ? (
        <ErrorState error={error} refetch={refetch} />
      ) : !venues ? (
        <p>Memuat venue...</p>
      ) : (
        <>
        <ResponsiveTable columns={[{ key: 'venue', label: 'Venue', render: (venue) => <div><Link className="font-medium text-indigo-700 hover:underline" to={`/admin/venues/${venue.id}`}>{venue.name}</Link><p className="text-xs text-slate-500">{venue.address}</p></div> }, { key: 'type', label: 'Jenis' }, { key: 'city', label: 'Kota' }, { key: 'courtCount', label: 'Court' }]} rows={rows} renderActions={(venue) => <><Link to={`/admin/venues/${venue.id}`}><Button size="sm" variant="secondary" title="Lihat detail">Detail</Button></Link><Button size="sm" variant="secondary" onClick={() => setEditing(venue)} title="Ubah venue">Ubah</Button><Button size="sm" variant="danger" onClick={() => setDeleting(venue)} title="Hapus venue">Hapus</Button></>} />
          {!rows.length && (
            <p className="rounded-b-2xl p-6 text-center text-sm text-slate-500">Tidak ada venue yang cocok.</p>
          )}
        </>
      )}
      {editing && (
        <VenueFormModal
          venue={editing.id ? editing : undefined}
          onClose={() => setEditing()}
          onSaved={refetch}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting()}
        onConfirm={remove}
        isLoading={isDeleting}
        title="Hapus venue"
        message={`Hapus ${deleting?.name}? Venue dengan booking tidak dapat dihapus.`}
      />
    </>
  );
}
