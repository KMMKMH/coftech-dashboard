import { useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const useDebounce = (t: any, refreshCooldownTime: number, throttleTime: number) => {

    const [lastClickTime, setLastClickTime] = useState<number>();
    const [lastSwitch, setLastSwitch] = useState<number>();
    const [timer, setTimer] = useState<number | null>(null);
    const [throttleEnd, setThrottleEnd] = useState<boolean>(true);

    const toast = useToast()

    const checkCoolDown = () => {
        const now = Date.now();
        if (now - lastClickTime < refreshCooldownTime) {
            toast({
                title: t("chats.wait"),
                description: t("chats.waitDesc-1") + ((refreshCooldownTime / 1000) - ((now - lastClickTime) / 1000)).toFixed(2) + t("chats.waitDesc-2"),
                status: "info",
                duration: 2000,
                isClosable: true,
            });
            return false;
        }
        setLastClickTime(now)
        return true
    }

    const checkThrottle = () => {
        const now = Date.now();
        if (now - lastSwitch < throttleTime) {
            toast({
                title: t("chats.wait"),
                description: t("chats.waitDesc-1") + ((throttleTime / 1000) - ((now - lastSwitch) / 1000)).toFixed(2) + t("chats.waitDesc-2.2"),
                status: "info",
                duration: 2000,
                isClosable: true,
            });
            return false;
        }
        setLastSwitch(now)
        return true
    }

    const checkThrottleWithFeedback = () => {
        if (timer == null) {
            setTimer(throttleTime)
            setThrottleEnd(false)
        }
    }

    useEffect(() => {
        if (timer != null) {
            const timeout = setTimeout(() => {
                setTimer(null)
                setThrottleEnd(true)
            }, timer)

            return () => clearTimeout(timeout)
        }
    }, [timer])


    return {
        checkCoolDown,
        checkThrottle,
        checkThrottleWithFeedback,
        throttleEnd
    };
};

export default useDebounce;
