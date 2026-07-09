import { NextRouter } from "next/router"

export const getBaseRouterPath = (router: NextRouter) => {
  const segments = router.asPath.split("?")[0].split("/").filter(Boolean)
  const basePath = segments[0] === router.locale ? segments[1] : segments[0]
  return `/${basePath || ""}`
}