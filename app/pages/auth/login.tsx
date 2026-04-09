import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button, Card, CardBody, Checkbox, Input } from '../../components/common';
import { ArrowUpRightIcon, SparklesIcon } from '../../components/icons';
import { authApi } from '../../api';
import { saveUser } from '../../auth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) nextErrors.email = 'Email is invalid';
    if (!password) nextErrors.password = 'Password is required';
    else if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validateForm();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const { user } = await authApi.login(email, password);
      saveUser(user);
      navigate('/app/dashboard', { replace: true });
    } catch (err: unknown) {
      setErrors({ general: err instanceof Error ? err.message : 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
        <Card className="soft-card border-0">
          <CardBody className="flex h-full items-center p-5 md:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8 flex items-center justify-between xl:hidden">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">TaskHub</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h1>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-slate-900 text-white shadow-lg shadow-slate-900/15">
                  <SparklesIcon size={18} />
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Sign in</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
                <p className="mt-3 text-sm leading-7 text-slate-500">Use your workspace account to continue into the dashboard and task board.</p>
              </div>

              {errors.general && (
                <div className="mb-6 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Email address"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                />

                <div className="flex items-center justify-between gap-4 text-sm">
                  <Checkbox label="Remember me" />
                  <a href="#" className="font-medium text-slate-900 transition-colors hover:text-slate-600">Forgot password?</a>
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full rounded-[18px] bg-black text-white hover:bg-zinc-900 focus:ring-zinc-500">
                  {isLoading ? 'Signing in...' : 'Sign in to TaskHub'}
                </Button>
              </form>

              <div className="mt-8 rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
                New here?{' '}
                <Link to="/auth/register" className="font-semibold text-slate-900 transition-colors hover:text-slate-600">
                  Create an account <ArrowUpRightIcon size={14} className="inline-block align-[-2px]" />
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
  );
}
