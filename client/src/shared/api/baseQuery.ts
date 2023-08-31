import { fetchBaseQuery } from '@reduxjs/toolkit/query'
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { Mutex } from 'async-mutex'
import {logout, setAccessToken, setUser} from "../../entities/User/model/slices/userSlice";
import {User} from "../../entities/User/model/types/types";

const mutex = new Mutex()
const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_SERVICE_API_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token') || '';
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
})
export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    await mutex.waitForUnlock()
    let result = await baseQuery(args, api, extraOptions)
    if (result.error && result.error.status === 401) {
        // checking whether the mutex is locked
        if (!mutex.isLocked()) {
            const release = await mutex.acquire()
            try {
                const refreshResult = await baseQuery(
                    'auth/refresh',
                    api,
                    extraOptions,
                )
                if (refreshResult.data) {

                    api.dispatch(setAccessToken(refreshResult.data))
                    const authResult = await baseQuery(
                        'auth/authorization',
                        api,
                        extraOptions,
                    ) as { data: {user: User, access_token: string}}
                    if(authResult.data) {
                        console.log('authresult',authResult.data)
                        api.dispatch(setUser(authResult.data?.user))
                        api.dispatch(setAccessToken(authResult.data))
                    }

                } else {
                    api.dispatch(logout())

                }
            } finally {
                release()
            }
        } else {
            await mutex.waitForUnlock()
            result = await baseQuery(args, api, extraOptions)
            console.log(result.data)
        }
    }
    return result
}
