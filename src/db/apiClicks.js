import supabase from '@/db/supabase.ts';
import { UAParser } from "ua-parser-js";

const parser = new UAParser();

export async function getClicks( urlIds = [] ) {
    const { data: clicks, error }
      = await supabase.from('clicks').select('*').in('url_id', urlIds);

    if ( error ) {
        console.log(error);
        throw new Error('Cannot load Clicks');
    }

    return clicks;
}

export const storeClicks = async ( { urlId, originalUrl } ) => {
    try {
        const res = parser.getResult();
        const device = res.type || "desktop";

        const response = await fetch("https://ipapi.co/json");
        const { city, country_name: country } = await response.json();

        await supabase.from('clicks').insert([ {
            url_id: urlId,
            city: city,
            country: country,
            device: device
        } ]);

        window.location.href = originalUrl;
    } catch ( e ) {
        console.error("Error Recording Click");
    }
}

export async function getClicksForUrl( urlId ) {
    const { data: clicks, error }
      = await supabase.from('clicks').select('*').eq('url_id', urlId);

    if ( error ) {
        console.log(error);
        throw new Error('Cannot load Clicks');
    }

    return clicks;
}