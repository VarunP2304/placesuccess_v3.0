// This file is a holdover from shadcn/ui's older toast system.
// With the `sonner` component, this hook is often not needed, as you can
// import `toast` directly from "sonner".
// However, if you need a custom hook, it might look like this:

import { toast } from "sonner";

export const useAppToast = () => {
    return {
        show: toast,
        success: toast.success,
        error: toast.error,
        info: toast.info,
        warning: toast.warning,
        loading: toast.loading,
        dismiss: toast.dismiss,
    };
};