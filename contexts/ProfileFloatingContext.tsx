import { ProfileFloatingContextFields } from "@/lib/types";
import { createContext, useContext, useState } from "react";

const ProfileFloatingContext = createContext<ProfileFloatingContextFields>({
    enabled: false,
    setEnabled: () => { }
});


const ProfileFloatingContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [enabled, setEnabled] = useState<boolean>(false);

    return (
        <ProfileFloatingContext.Provider value={{ enabled, setEnabled }}>
            {children}
        </ProfileFloatingContext.Provider>
    )
}

export default ProfileFloatingContextProvider

export function useProfileFloatingContext(): ProfileFloatingContextFields {
    const context = useContext(ProfileFloatingContext);
    if (!context) throw new Error("Profile Floating Panel Context Null!");
    return context
}