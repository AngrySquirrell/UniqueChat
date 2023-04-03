import PocketBase, {
    Record as pRecord,
    BaseAuthStore,
    RecordListQueryParams as pQueryParams,
    UnsubscribeFunc,
    RecordAuthResponse,
    Record,
    Admin,
    RecordQueryParams,
    RecordListQueryParams,
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
interface AdminAuthResponse {
    [key: string]: any;
    token: string;
    admin: Admin;
}

export interface useCollectionOptions {
    queryParams?: RecordQueryParams;
    realtime?: boolean;
    pageParams?: {
        perPage: number;
        page: number;
    }
}

export const isAdmin = () => {
    if (pb.authStore.model instanceof Admin) return "admin";
    if (pb.authStore.model instanceof Record) return "user";
    return "none";
};


export const pb = new PocketBase(pocketBaseUrl);
pb.autoCancellation(false);

// < !-- // HOOK \\ --! > \\

export function useCollection<T extends Record>(
    collection: string,
    defaultValue: any = [],
    { queryParams: defaultQueryParams, realtime, pageParams: newPageParams }: useCollectionOptions = {},
    callbackOnUpdate?: () => void
) {
    let pageParams = {page:1, perPage:50, ...newPageParams}
    interface base {
        items: T[];
        others?: {
            page: number;
            perPage: number;
            totalItems: number;
        };
    }
    const [result, setResult] = useState<base>({items:defaultValue});
    const [loading, setLoading] = useState<boolean>(true);
    const [params, setParams] = useState<RecordQueryParams>(
        defaultQueryParams || {}
    );

    const getList = async (
        newQueryParams: RecordListQueryParams = {},
        reset: boolean = false
    ) => {
        try {
            let newParsedQueryParams: RecordListQueryParams = {
                ...params,
                ...newQueryParams,
            };
            if (reset) {
                newParsedQueryParams = defaultQueryParams
                    ? defaultQueryParams
                    : {};
            }
            setLoading(true);
            setParams(newParsedQueryParams);
            const { items, page, perPage, totalItems } = await pb
                .collection(collection)
                // .getFullList(200, newParsedQueryParams);
                .getList(pageParams.page, pageParams.perPage, newParsedQueryParams);
            setResult({
                items: items as T[],
                others: { page, perPage, totalItems },
            });
        } catch (e) {
            console.log({
                message: "Impossible d'executer la requête",
                title: "Erreur !",
            });
        }
        setLoading(false);
    };

    const unsubcribe = async (unsub: Promise<UnsubscribeFunc>) => {
        unsub && (await unsub)();
    };

    useEffect(() => {
        getList();
        let unsub: Promise<UnsubscribeFunc>;
        if (realtime)
            unsub = pb.collection(collection).subscribe("*", () => getList());

        return () => {
            unsubcribe(unsub);
        };
    }, []);

    return {
        records: result.items.reverse(),
        invalidate: getList,
        loading,
        otherResult: result.others,
    };
}

// export const useCollection = <T extends pRecord>( //<inType>
//     collectionName: string,
//     defaultValue: any = [],
//     { params, realtime }: options = {}
// ): {
//     records: T[];
//     invalidate: (newParams?: pQueryParams) => Promise<void>;
//     loading: boolean;
// } => {
//     // :type du return
//     const [records, setRecords] = useState<T[]>(defaultValue);
//     const [loading, setLoading] = useState<boolean>(true);

//     const unsubcribe = async (unsub: Promise<UnsubscribeFunc>) => {
//         unsub && (await unsub)();
//     };

//     useEffect(() => {
//         getFullList();
//         let unsub: Promise<UnsubscribeFunc>;
//         if (realtime) {
//             unsub = pb.collection(collectionName).subscribe("*", () => {
//                 getFullList();
//             });
//         }

//         return () => {
//             // realtime && pb.collection(collectionName).unsubscribe("*");
//             unsubcribe(unsub);
//         };
//     }, []);

//     const getFullList = async (newParams: pQueryParams = {}) => {
//         let combineParams = { ...params, ...newParams }; // Corriger l'indélibilité des params
//         setLoading(true);
//         let list = (await pb
//             .collection(collectionName)
//             .getList(1, 50, combineParams)) as T[];
//         setRecords(list.items);
//         setLoading(false);
//     };

//     return { records, invalidate: getFullList, loading };
// };

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
