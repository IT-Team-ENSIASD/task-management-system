import { useState } from 'react';
import { Link } from 'react-router';
import { Button, Card, CardBody, Checkbox, Input } from '../../components/common';
import { ArrowUpRightIcon, CheckIcon, ShieldIcon, SparklesIcon } from '../../components/icons';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) nextErrors.fullName = 'Full name is required';
    if (!formData.email) nextErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) nextErrors.email = 'Email is invalid';
    if (!formData.password) nextErrors.password = 'Password is required';
    else if (formData.password.length < 8) nextErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeToTerms) nextErrors.agreeToTerms = 'You must agree to the terms';

    return nextErrors;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = event.currentTarget;
    setFormData((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
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
      await new Promise((resolve) => window.setTimeout(resolve, 900));
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
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">Create account</h1>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-[18px] bg-slate-900 text-white shadow-lg shadow-slate-900/15">
                  <SparklesIcon size={18} />
                </div>
              </div>

              <div className="mb-4">
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Create your workspace</h2>
                {/* <p className="mt-3 text-sm leading-7 text-slate-500">Register once and keep your tasks, notifications, and reports in one place.</p> */}
              </div>

              {errors.general && (
                <div className="mb-6 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Full name"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                />
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <div className='flex'>
                    <Input
                      label="Password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      helperText="At least 8 characters with uppercase, lowercase, and numbers."
                    />
                    <Input
                      label="Confirm password"
                      name="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={errors.confirmPassword}
                    />
                </div>

                <div className="space-y-2">
                  <Checkbox
                    label="I agree to the Terms of Service and Privacy Policy"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                  />
                  {errors.agreeToTerms && <p className="text-sm text-rose-600">{errors.agreeToTerms}</p>}
                </div>

                <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full rounded-[18px] bg-black text-white hover:bg-zinc-900 focus:ring-zinc-500">
                  {isLoading ? 'Creating account...' : 'Create workspace account'}
                </Button>
              </form>


              <div className="mt-8 rounded-[22px] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/auth/login" className="font-semibold text-slate-900 transition-colors hover:text-slate-600">
                  Sign in <ArrowUpRightIcon size={14} className="inline-block align-[-2px]" />
                </Link>
              </div>
            </div>
          </CardBody>
        </Card>
  );
}
