import { configureStore } from '@reduxjs/toolkit'
import {rtkApi} from "../../../../shared/api/rtkApi";
import userSlice from "../../../../entities/User/model/slices/userSlice";

export const store = configureStore({
    reducer: {
        [rtkApi.reducerPath]: rtkApi.reducer,
        user: userSlice,
    },
    devTools: true,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(rtkApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
