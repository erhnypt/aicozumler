import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { LazyComponentWrapper } from "../components/LazyComponentWrapper";

// Lazy load components for better performance
const NotFound = lazy(() => import("../pages/NotFound"));
const Home = lazy(() => import("../pages/home/page"));
const Solutions = lazy(() => import("../pages/solutions/page"));
const Pricing = lazy(() => import("../pages/pricing/page"));
const Contact = lazy(() => import("../pages/contact/page"));
const About = lazy(() => import("../pages/about/page"));
const Blog = lazy(() => import("../pages/blog/page"));
const Login = lazy(() => import("../pages/auth/login"));
const Register = lazy(() => import("../pages/auth/register"));
const VerifyEmail = lazy(() => import("../pages/auth/verify-email"));
const Dashboard = lazy(() => import("../pages/dashboard/page"));
const TenantLayout = lazy(() => import("../components/TenantLayout").then(module => ({ default: module.TenantLayout })));
const TenantHome = lazy(() => import("../pages/tenant/TenantHome"));
const TenantAbout = lazy(() => import("../pages/tenant/TenantAbout"));
const TenantContact = lazy(() => import("../pages/tenant/TenantContact"));

// Ana site route'ları
const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <LazyComponentWrapper><Home /></LazyComponentWrapper>,
  },
  {
    path: "/cozumler",
    element: <LazyComponentWrapper><Solutions /></LazyComponentWrapper>,
  },
  {
    path: "/fiyatlandirma",
    element: <LazyComponentWrapper><Pricing /></LazyComponentWrapper>,
  },
  {
    path: "/iletisim",
    element: <LazyComponentWrapper><Contact /></LazyComponentWrapper>,
  },
  {
    path: "/hakkimizda",
    element: <LazyComponentWrapper><About /></LazyComponentWrapper>,
  },
  {
    path: "/blog",
    element: <LazyComponentWrapper><Blog /></LazyComponentWrapper>,
  },
  {
    path: "/giris",
    element: <LazyComponentWrapper><Login /></LazyComponentWrapper>,
  },
  {
    path: "/kayit",
    element: <LazyComponentWrapper><Register /></LazyComponentWrapper>,
  },
  {
    path: "/dogrulama",
    element: <LazyComponentWrapper><VerifyEmail /></LazyComponentWrapper>,
  },
  {
    path: "/dashboard",
    element: <LazyComponentWrapper><Dashboard /></LazyComponentWrapper>,
  }
];

// Tenant route'ları
const tenantChildRoutes: RouteObject[] = [
  {
    index: true,
    element: <LazyComponentWrapper><TenantHome /></LazyComponentWrapper>
  },
  {
    path: 'hakkimda',
    element: <LazyComponentWrapper><TenantAbout /></LazyComponentWrapper>
  },
  {
    path: 'iletisim',
    element: <LazyComponentWrapper><TenantContact /></LazyComponentWrapper>
  }
];

// Sektör bazlı tenant route'ları
const sectorRoutes = ['dentist', 'beauty', 'restaurant', 'fitness', 'retail'].map(sector => ({
  path: `${sector}/:tenantSlug/*`,
  element: <LazyComponentWrapper><TenantLayout /></LazyComponentWrapper>,
  children: tenantChildRoutes
}));

const routes: RouteObject[] = [
  ...mainRoutes,
  ...sectorRoutes,
  {
    path: "*",
    element: <LazyComponentWrapper><NotFound /></LazyComponentWrapper>,
  },
];

export default routes;
