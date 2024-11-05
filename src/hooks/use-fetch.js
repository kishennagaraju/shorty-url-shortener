import { useState } from "react";

const useFetch = ( callback, options = {} ) => {
    const [ data, setData ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const fn = async ( ...args ) => {
        setLoading(true);
        setError(null);

        try {
            const response = await callback(options, ...args);
            setData(response);
        } catch ( e ) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    return { data, loading, error, fn }
}

export default useFetch;