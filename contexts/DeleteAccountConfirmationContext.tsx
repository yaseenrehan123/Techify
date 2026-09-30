import { DeleteAccountConfirmationContextFields } from "@/lib/types";
import { createContext, useContext, useState } from "react";

const DeleteAccountConfirmationContext = createContext<DeleteAccountConfirmationContextFields>({
    enabled: false,
    setEnabled: () => { }
});


const DeleteAccountConfirmationContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [enabled, setEnabled] = useState<boolean>(false);

    return (
        <DeleteAccountConfirmationContext.Provider value={{ enabled, setEnabled }}>
            {children}
        </DeleteAccountConfirmationContext.Provider>
    )
}

export default DeleteAccountConfirmationContextProvider

export function useDeleteAccountConfirmationContext(): DeleteAccountConfirmationContextFields {
    const context = useContext(DeleteAccountConfirmationContext);
    if (!context) throw new Error("Profile Floating Panel Context Null!");
    return context
}