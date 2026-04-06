import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Auth routes
  layout("routes/auth-layout.tsx", [
    route("/auth/login", "pages/auth/login.tsx"),
    route("/auth/register", "pages/auth/register.tsx"),
  ]),

  // App routes
  layout("routes/app-layout.tsx", [
    route("/app/dashboard", "pages/app/dashboard.tsx"),
    route("/app/tasks", "pages/app/tasks.tsx"),
    route("/app/settings", "pages/app/settings.tsx"),
  ]),

  // Home/Redirect
  index("routes/home.tsx"),
] satisfies RouteConfig;
