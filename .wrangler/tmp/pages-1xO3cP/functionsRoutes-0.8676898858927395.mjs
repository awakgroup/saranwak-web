import { onRequestPost as __api_admin_login_ts_onRequestPost } from "/Users/vikyfand/saranwak/functions/api/admin/login.ts"
import { onRequestPost as __api_admin_logout_ts_onRequestPost } from "/Users/vikyfand/saranwak/functions/api/admin/logout.ts"
import { onRequestDelete as __api_admin_places_ts_onRequestDelete } from "/Users/vikyfand/saranwak/functions/api/admin/places.ts"
import { onRequestGet as __api_admin_places_ts_onRequestGet } from "/Users/vikyfand/saranwak/functions/api/admin/places.ts"
import { onRequestPatch as __api_admin_places_ts_onRequestPatch } from "/Users/vikyfand/saranwak/functions/api/admin/places.ts"
import { onRequestPost as __api_admin_places_ts_onRequestPost } from "/Users/vikyfand/saranwak/functions/api/admin/places.ts"
import { onRequestGet as __api_places__slug__ts_onRequestGet } from "/Users/vikyfand/saranwak/functions/api/places/[slug].ts"
import { onRequestGet as __api_places_ts_onRequestGet } from "/Users/vikyfand/saranwak/functions/api/places.ts"
import { onRequestHead as __api_places_ts_onRequestHead } from "/Users/vikyfand/saranwak/functions/api/places.ts"

export const routes = [
    {
      routePath: "/api/admin/login",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_login_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/logout",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/places",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_places_ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/places",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_places_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/places",
      mountPath: "/api/admin",
      method: "PATCH",
      middlewares: [],
      modules: [__api_admin_places_ts_onRequestPatch],
    },
  {
      routePath: "/api/admin/places",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_places_ts_onRequestPost],
    },
  {
      routePath: "/api/places/:slug",
      mountPath: "/api/places",
      method: "GET",
      middlewares: [],
      modules: [__api_places__slug__ts_onRequestGet],
    },
  {
      routePath: "/api/places",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_places_ts_onRequestGet],
    },
  {
      routePath: "/api/places",
      mountPath: "/api",
      method: "HEAD",
      middlewares: [],
      modules: [__api_places_ts_onRequestHead],
    },
  ]