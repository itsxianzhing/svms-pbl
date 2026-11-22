import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { DEMO_ACCOUNTS } from '@/config/constants';
import { env } from '@/config/env';
export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' }),
    [error, setError] = useState(''),
    [loading, setLoading] = useState(false);
  const { login } = useAuth(),
    go = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(form);
      go(u.role === 'ADMIN' ? '/admin/dashboard' : '/venues');
    } catch (x) {
      setError(x.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Masuk ke SVMS</h1>
      <p className="mb-6 text-sm text-slate-500">Kelola booking Anda dengan rapi.</p>
      <form onSubmit={submit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <Input
          label="Password"
          type="password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <Button isLoading={loading} className="w-full">
          Masuk
        </Button>
      </form>
      {env.showDemoAccounts && (
        <div className="mt-6 rounded-xl bg-indigo-50 p-4 text-sm">
          <b className="text-indigo-900">Akun demo</b>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {Object.entries(DEMO_ACCOUNTS).map(([k, v]) => (
              <Button
                size="sm"
                variant="secondary"
                key={k}
                type="button"
                onClick={() => setForm(v)}
              >
                 {k === 'ADMIN' ? 'Demo Admin' : 'Demo Customer'}
              </Button>
            ))}
          </div>
        </div>
      )}
      <p className="mt-5 text-sm">
        Belum punya akun?{' '}
        <Link className="text-indigo-600" to="/register">
          Daftar
        </Link>
      </p>
    </>
  );
}
