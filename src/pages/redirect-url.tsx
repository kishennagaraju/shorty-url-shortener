import { useParams } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch.js';
import { getLongUrl } from '@/db/apiUrls.js';
import { storeClicks } from '@/db/apiClicks.js';
import { useEffect } from 'react';
import { BarLoader } from 'react-spinners';

const RedirectUrl = () => {
    const { id } = useParams();
    const { data, loading, fn: fnLongUrl } = useFetch(getLongUrl, id);
    const { loading: loadingStats, fn: fnStats } = useFetch(storeClicks, {
        urlId: data?.id,
        originalUrl: data?.original_url
    });

    useEffect(() => {
        fnLongUrl();
    }, []);

    useEffect(() => {
        if ( !loading && data ) {
            fnStats();
        }
    }, [ loading ]);

    if ( loading || loadingStats ) {
        return (<>
            <BarLoader width={"100%"} color="#36d7b7"/>
            <br/>
            Redirecting...
        </>);
    }

    return null;
}

export default RedirectUrl;