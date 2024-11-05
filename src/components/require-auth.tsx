import { useNavigate } from "react-router-dom";
import { UrlState } from "@/context/url-context";
import { useEffect } from "react";
import { BarLoader } from "react-spinners";

const RequireAuth = ( { children } ) => {
    const navigate = useNavigate();
    const { loading, isAuthenticated } = UrlState();

    useEffect(() => {
        if ( !isAuthenticated && !loading ) {
            navigate("/auth");
        }
    }, [ isAuthenticated, loading ]);

    if ( loading ) return <BarLoader width={"100%"} color={"#36d7b7"}/>;

    if ( isAuthenticated ) return children;
}

export default RequireAuth;