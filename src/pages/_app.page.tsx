import { ChakraProvider } from "@chakra-ui/react";
import theme from "../theme";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { store } from "@component/store";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";
import "@fontsource/poppins";
import { SocketProvider } from "@component/utils/";
import { roleProtectedRoutes } from "../configs/protectedRoutes/";
import { useRouter } from "next/router";
import { WithRoleProtection } from "@component/hoc";
import { useState, useEffect } from "react";
import { AxiosUrl } from "@component/configs/AxiosConfig";
import "@component/assets/css/tableStyles.css";
import "@component/assets/css/calendarStyle.scss";
import BotModal from "@component/components/BotModal";
import { useAuthStore } from "@component/store/auth";
import { ApolloProvider } from "@apollo/client";
import initializeApollo from "../../apollo-client";
import { useError } from "@component/utils/errorContext";
import { PopUpProvider } from "@component/utils/PopUpProvider";
import { ErrorProvider } from "@component/utils/ErrorProvider";
import { isTemporaryAccessEnabled } from "@component/utils/temporaryAccess";

const excludedRoutes = ["/404", "/auth/login"];

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const { pathname } = router;
  const [ProtectedComponent, setProtectedComponent] = useState<
    React.ComponentType<any>
  >(() => Component);

  const { showError } = useError()


  const { token } = useAuthStore()
  const Apollo = initializeApollo(token)

  const isExcludedRoute = excludedRoutes.includes(router.pathname);

  useEffect(() => {
    const allowedRoles = roleProtectedRoutes[pathname] || [];
    if (allowedRoles.length && !isExcludedRoute) {
      setProtectedComponent(() =>
        WithRoleProtection(Component, allowedRoles, excludedRoutes)
      );
    } else {
      setProtectedComponent(() => Component);
    }
  }, [pathname, Component, isExcludedRoute]);

  useEffect(() => {
    const interceptor = AxiosUrl.interceptors.response.use(
      (response) => response,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        const errorCode = error.response?.data?.code;
        if (errorCode === 401 && !isTemporaryAccessEnabled) {
          useAuthStore.getState().logout();
        } else if (!router.pathname.includes("/auth/login")) {
          showError(errorMessage);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      AxiosUrl.interceptors.response.eject(interceptor);
    };
  }, [router.pathname, showError]);

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={Apollo}>
        <Provider store={store}>
          <SocketProvider>
            <PopUpProvider>
              <ErrorProvider>
                <>
                  <ProtectedComponent {...pageProps} />
                  <BotModal />
                </>
              </ErrorProvider>
            </PopUpProvider>
          </SocketProvider>
        </Provider>
      </ApolloProvider>
    </ChakraProvider>
  );
};
export default appWithTranslation(App);
