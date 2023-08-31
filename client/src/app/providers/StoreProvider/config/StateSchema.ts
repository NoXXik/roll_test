import {UserState} from "../../../../entities/User/model/types/types";
import {ReferrerState} from "../../../../entities/Referrer/model/types/types";

export interface StateSchema {
    user: UserState,
    referrer: ReferrerState
}
