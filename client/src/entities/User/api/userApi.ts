import {rtkApi} from "../../../shared/api/rtkApi";
import {IUserBet, User} from "../model/types/types";

interface AuthorizationData {
    access_token: string,
    user: User;
}
export const userApi = rtkApi.injectEndpoints({
    endpoints: (build) => ({
        authorization: build.query<AuthorizationData, null>({
            query: () => ({
                url: '/auth/authorization',
                method: 'GET',
            })
        }),
        getUser: build.query<User, null>({
            query: () => ({
                url: '/user/user',
                method: 'GET',
            }),
            providesTags: ['user']
        }),
        logout: build.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            })
        }),
        getBets: build.query<IUserBet[], null>({
            query: () => ({
                url: '/user/bets',
                method: 'GET',
            }),
        }),
    })
})

export const {useLogoutMutation, useLazyAuthorizationQuery, useLazyGetBetsQuery} = userApi
