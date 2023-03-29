import PocketBase, {
    Record as pRecord,
    BaseAuthStore,
    RecordListQueryParams as pQueryParams,
    UnsubscribeFunc,
    RecordAuthResponse,
    Record,
    Admin,
} from "pocketbase";
import { useEffect, useState } from "react";
import { collection, pocketBaseUrl } from "./globalVariable";

interface options {
    params?: pQueryParams;
    realtime?: boolean;
}
interface PromiseReturn {
    authData: RecordAuthResponse<Record> | AdminAuthResponse | void;
    error: string | null;
    status: "admin" | "user" | "none";
}

export const isAdmin = () => {
    if (pb.authStore.model instanceof Admin) return "admin";
    if (pb.authStore.model instanceof Record) return "user";
    return "none";
};

interface AdminAuthResponse {
    [key: string]: any;
    token: string;
    admin: Admin;
}

export const pb = new PocketBase(pocketBaseUrl);
pb.autoCancellation(false);

// < !-- // HOOK \\ --! > \\

export const useCollection = <T extends pRecord>( //<inType>
    collectionName: string,
    defaultValue: any = [],
    { params, realtime }: options = {}
): {
    records: T[];
    invalidate: (newParams?: pQueryParams) => Promise<void>;
    loading: boolean;
} => {
    // :type du return
    const [records, setRecords] = useState<T[]>(defaultValue);
    const [loading, setLoading] = useState<boolean>(true);

    const unsubcribe = async (unsub: Promise<UnsubscribeFunc>) => {
        unsub && (await unsub)();
    };

    useEffect(() => {
        getFullList();
        let unsub: Promise<UnsubscribeFunc>;
        if (realtime) {
            unsub = pb.collection(collectionName).subscribe("*", () => {
                getFullList();
            });
        }

        return () => {
            // realtime && pb.collection(collectionName).unsubscribe("*");
            unsubcribe(unsub);
        };
    }, []);

    const getFullList = async (newParams: pQueryParams = {}) => {
        let combineParams = { ...params, ...newParams }; // Corriger l'indélibilité des params
        setLoading(true);
        let list = (await pb
            .collection(collectionName)
            .getFullList(undefined, combineParams)) as T[];
        setRecords(list);
        setLoading(false);
    };

    return { records, invalidate: getFullList, loading };
};

export const useAuthStore = () => {
    const [authStore, setAuthStore] = useState<{
        store: BaseAuthStore;
        id: number;
        status: PromiseReturn["status"];
    }>({
        store: pb.authStore,
        id: 0,
        status: isAdmin(),
    });

    useEffect(() => {
        const removeListener = pb.authStore.onChange((token, model) => {
            setAuthStore((old: { store: BaseAuthStore; id: number }) => ({
                store: pb.authStore,
                id: old.id + 1,
                status: isAdmin(),
            }));
        }, false);
        return () => {
            removeListener();
        };
    }, []);

    return { auth: authStore?.store, status: authStore.status };
};

// export const useAuth = (
//     collectionName: string,
//     { username, password }: credentials,
//     defaultValue: any = []
// ): { auth: RecordAuthResponse; invalidate: () => void; loading: boolean } => {
//     const [auth, setAuth] = useState<RecordAuthResponse>(defaultValue);
//     const [loading, setLoading] = useState<boolean>(true);

//     const disconnect = () => {
//         pb.authStore.clear();
//     };

//     useEffect(() => {
//         authentificate();

//         return () => {
//             disconnect();
//         };
//     }, []);

//     const authentificate = async () => {
//         setLoading(true);
//         let authP = await pb
//             .collection("users")
//             .authWithPassword(username, password);
//         setAuth(authP);
//         setLoading(false);
//     };

//     return { auth, invalidate: disconnect, loading };
// };

export default pb;
