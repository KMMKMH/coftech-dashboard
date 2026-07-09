import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthStore } from "@component/store/auth";
import Loading from "../components/Loading";

const WithRoleProtection = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: string[],
  excludedRoutes: string[]
) => {
  const ComponentWithRoleProtection = (props: P) => {
    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();
    const canAccessRoute =
      allowedRoles.includes("ALL") || allowedRoles.includes(user?.rol_key || "");

    useEffect(() => {
      if (excludedRoutes.includes(router.pathname)) {
        return;
      }
      if (!isAuthenticated && !router.pathname.includes("/auth/login")) {
        router.push("/auth/login");
      } else if (!canAccessRoute && !router.pathname.includes("/404")) {
        router.push("/404");
      }
    }, [isAuthenticated, canAccessRoute, router]);

    if (excludedRoutes.includes(router.pathname)) {
      return <WrappedComponent {...props} />;
    }
    if (isAuthenticated === undefined || user === undefined) {
      return <Loading mode="normal"/>;
    }

    if (isAuthenticated && canAccessRoute) {
      return <WrappedComponent {...props} />;
    }

    return null;
  };

  return ComponentWithRoleProtection;
};

export default WithRoleProtection;
