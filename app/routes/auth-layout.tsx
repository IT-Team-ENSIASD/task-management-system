import { Outlet } from 'react-router';
import { Card, CardBody } from '~/components/common';
import { CheckIcon, ShieldIcon, SparklesIcon } from '~/components/icons';

export default function AuthLayout() {
  return (
    <div className="app-canvas flex h-screen overflow-hidden px-4 py-4 md:px-6 md:py-6">
      <div className="grid h-full w-full max-w-350 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="soft-card flex-1 hidden h-full overflow-hidden border-0 xl:block">
          <CardBody className="relative h-full min-h-0 p-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(238,226,255,0.9),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(214,233,255,0.7),_transparent_32%),linear-gradient(135deg,_#f7f2ff_0%,_#f5f7ff_100%)]" />
            <div className="relative flex h-full flex-col justify-between p-10">
              <div className="flex items-center gap-3">
                <div className="grid h-14 w-14 place-items-center rounded-[22px] bg-slate-900 text-sm font-semibold text-white shadow-lg shadow-slate-900/15">
                  S
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">TaskHub</p>
                  <p className="text-sm text-slate-500">Distributed task management</p>
                </div>
              </div>

              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Secure access</p>
                <h1 className="mt-4 text-5xl font-semibold tracking-tight text-slate-900">
                  Focus on work, not the interface.
                </h1>
                <p className="mt-5 max-w-lg text-base leading-8 text-slate-600">
                  A polished command center for tasks, deadlines, notifications, and team flow with a calm light-mode workspace.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {[
                  { label: 'Protected routes', icon: ShieldIcon },
                  { label: 'Fast collaboration', icon: CheckIcon },
                  { label: 'Smart workflow', icon: SparklesIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-[24px] border border-white/70 bg-white/75 p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] backdrop-blur">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-900 text-white">
                        <Icon size={18} />
                      </div>
                      <p className="mt-4 text-sm font-medium text-slate-700">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardBody>
        </Card>
        <Outlet />
      </div>
    </div>
  );
}
