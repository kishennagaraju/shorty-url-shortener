import { BarLoader } from 'react-spinners';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { Filter } from 'lucide-react';
import useFetch from '@/hooks/use-fetch.js';
import { getUrls } from '@/db/apiUrls.js';
import { getClicks } from '@/db/apiClicks.js';
import { UrlState } from '@/context/url-context';
import Error from '@/components/error.tsx';
import LinkCard from '@/components/link-card';
import { CreateLink } from '@/components/create-link.tsx';

const Dashboard = () => {
    const [ searchQuery, setSearchQuery ] = useState("");
    const { user } = UrlState();
    const { data: urls, error, loading, fn: fnUrls } = useFetch(getUrls, user.id);
    const {
        data: clicks,
        error: errorClicks,
        loading: loadingClicks,
        fn: fnClicks
    } = useFetch(getClicks, urls?.map(( url ) => url.id));

    useEffect(() => {
        fnUrls();
    }, []);

    useEffect(() => {
        if ( urls?.length ) fnClicks();
    }, [ urls?.length ]);

    const filteredUrls = urls?.filter(( url ) => url.title.toLowerCase().includes(searchQuery.toLowerCase()));


    return <div className={"flex flex-col gap-8 p-10"}>
        {(loading || loadingClicks) && <BarLoader width={"100%"} color={"#36d7b7"}/>}
        <div className={"grid grid-cols-2 gap-4"}>
            <Card>
                <CardHeader>
                    <CardTitle>Links Created</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{urls?.length}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Total Clicks</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>{clicks?.length}</p>
                </CardContent>
            </Card>
        </div>

        <div className={"flex justify-between"}>
            <h1 className={"text-4xl font-extrabold"}>My Links</h1>
            <CreateLink/>
        </div>

        <div className={"relative"}>
            <Input type={"text"} placeholder={"Filter Links"} value={searchQuery}
                   onChange={( e ) => setSearchQuery(e.target.value)}/>
            <Filter className={"absolute top-2 right-2 p-1"}/>
        </div>
        {error && <Error message={error.message}/>}

        {(filteredUrls || []).map(( url, i ) => (
          <LinkCard key={i} url={url} fetchUrls={fnUrls}/>
        ))}
    </div>;
}

export default Dashboard;
