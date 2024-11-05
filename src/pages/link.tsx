import { UrlState } from '@/context/url-context.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '@/hooks/use-fetch.js';
import { deleteUrl, getUrlDetails } from '@/db/apiUrls.js';
import { getClicksForUrl } from '@/db/apiClicks.js';
import { BarLoader, BeatLoader } from 'react-spinners';
import { useEffect } from 'react';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.tsx';
import Location from '@/components/location-stats';
import Device from '@/components/device-stats.tsx';

const Link = () => {
    const navigate = useNavigate();
    const { user } = UrlState();
    const { id } = useParams();

    const {
        data: urlDetails,
        loading,
        error,
        fn: fnUrlDetails
    } = useFetch(getUrlDetails, id);
    const {
        data: clicks,
        loading: loadingClicks,
        fn: fnClicks
    } = useFetch(getClicksForUrl, id);
    const {
        loading: loadingDelete,
        fn: fnDeleteUrl
    } = useFetch(deleteUrl, id);

    useEffect(() => {
        fnUrlDetails();
        fnClicks();
    }, []);

    if ( error ) {
        navigate("/dashboard");
    }

    const link = import.meta.env.VITE_SITE_URL + "/" + (urlDetails?.short_url || urlDetails?.custom_url);

    const downloadImage = () => {
        const imageUrl = urlDetails?.qr_code;
        const fileName = urlDetails?.title;

        // Create an anchor element
        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;

        // Append the anchor to the body
        document.body.appendChild(anchor);

        // Trigger the download by simulating a click event
        anchor.click();

        // Remove the anchor from the document
        document.body.removeChild(anchor);
    };

    return <>
        {(loading || loadingClicks) && (<BarLoader className={"mb-4"} width={"100%"} color="#36d7b7"/>)}
        <div className={"p-10 flex flex-col gap-8 sm:flex-row justify-between"}>
            <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
              <span className="text-6xl font-extrabold hover:underline cursor-pointer">
                {urlDetails?.title}
              </span>
                <a
                  href={link}
                  target="_blank"
                  className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer"
                >
                    {link}
                </a>
                <a
                  href={urlDetails?.original_url}
                  target="_blank"
                  className="flex items-center gap-1 hover:underline cursor-pointer"
                >
                    <LinkIcon className="p-1"/>
                    {urlDetails?.original_url}
                </a>
                <span className="flex items-end font-extralight text-sm">
                    {new Date(urlDetails?.created_at).toLocaleString()}
                </span>
                <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        navigator.clipboard.writeText(`https://trimrr.in/${link}`)
                      }
                    >
                        <Copy/>
                    </Button>
                    <Button variant="ghost" onClick={downloadImage}>
                        <Download/>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() =>
                        fnDeleteUrl().then(() => {
                            navigate("/dashboard");
                        })
                      }
                      disable={loadingDelete}
                    >
                        {loadingDelete ? (
                          <BeatLoader size={5} color="white"/>
                        ) : (
                          <Trash/>
                        )}
                    </Button>
                </div>
                <img
                  src={urlDetails?.qr_code}
                  className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"
                  alt="qr code"
                />
            </div>
            <Card className="sm:w-3/5">
                <CardHeader>
                    <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
                </CardHeader>
                {clicks && clicks.length ? (
                  <CardContent className="flex flex-col gap-6">
                      <Card>
                          <CardHeader>
                              <CardTitle>Total Clicks</CardTitle>
                          </CardHeader>
                          <CardContent>
                              <p>{clicks?.length}</p>
                          </CardContent>
                      </Card>

                      <CardTitle>Location Data</CardTitle>
                      <Location clicks={clicks}/>
                      <CardTitle>Device Data</CardTitle>
                      <Device clicks={clicks}/>
                  </CardContent>
                ) : (
                  <CardContent>
                      {!loadingClicks ? "No Statistics yet" : "Loading Statistics.."}
                  </CardContent>
                )}
            </Card>
        </div>
    </>;
}

export default Link
