import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
export function RegisterPage() {
  const [f, setF] = useState({ name: '', email: '', password: '', confirm: '' }),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(false);
  const { register } = useAuth(),
    go = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    if (f.password.length < 6 || f.password !== f.confirm)
      return setError('Password minimal 6 karakter dan harus cocok');
    setLoading(true);
    try {
      await register(f);
      go('/venues');
    } catch (x) {
      setError(x.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Buat akun</h1>
      <p className="mb-6 text-sm text-slate-500">Mulai booking lapangan dengan mudah.</p>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Nama"
          required
          value={f.name}
          onChange={(e) => setF({ ...f, name: e.target.value })}
        />
        <Input
          label="Email"
          type="email"
          required
          value={f.email}
          onChange={(e) => setF({ ...f, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          value={f.password}
          onChange={(e) => setF({ ...f, password: e.target.value })}
        />
        <Input
          label="Konfirmasi password"
          type="password"
          required
          value={f.confirm}
          onChange={(e) => setF({ ...f, confirm: e.target.value })}
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Button isLoading={loading} className="w-full">
          Daftar
        </Button>
      </form>
      <p className="mt-5 text-sm">
        Sudah punya akun?{' '}
        <Link className="text-indigo-600" to="/login">
          Masuk
        </Link>
      </p>
    </>
  );
}
