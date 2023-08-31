import {Provider} from "react-redux";
import {store} from "../config/store";
import {ReactNode} from "react";

interface StoreProviderProps {
    children?: ReactNode;
}
export const StoreProvider = (props: StoreProviderProps) => {
    const { children } = props;

    // const navigate = useNavigate();


    console.log('RENDER');

    return <Provider store={store}>{children}</Provider>;
};
