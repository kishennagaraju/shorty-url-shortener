import { getCurrentUser } from '@/db/apiAuth.js';
import supabase, { supabaseUrl } from '@/db/supabase.ts';

export async function getUrls( userId ) {
    const { data: urls, error }
      = await supabase.from('urls').select('*').eq('user_id', userId).order('created_at', { ascending: false });

    if ( error ) {
        console.log(error);
        throw new Error('Cannot load URLs');
    }

    return urls;
}

export async function deleteUrl( urlId, qrCodeFile ) {
    const url = URL.parse(qrCodeFile).pathname.split("/");
    const { error: storageError }
      = await supabase.storage.from('qr_codes').remove([ url[url.length - 1] ]);

    if ( storageError ) {
        console.log(storageError);
        throw new Error('Could Not delete file.');
    }

    const { data, error }
      = await supabase.from('urls').delete().eq('id', urlId);

    if ( error ) {
        console.log(error);
        throw new Error('Cannot delete URL');
    }

    return data;
}

export async function createUrl( { title, longUrl, customUrl }, qrCode ) {

    const user = await getCurrentUser();
    if ( !user ) {
        throw new Error('You are not logged in to create the URL');
    }

    const shortUrl = Math.random().toString(36).substr(2, 8);
    const fileName = `qr-${shortUrl}`;

    const { error: storageError }
      = await supabase.storage.from('qr_codes').upload(fileName, qrCode);

    if ( storageError ) {
        console.log("Storage Error", storageError);
        throw new Error('Could not upload QR Code.');
    }

    const { data, error }
      = await supabase.from('urls').insert([ {
        title,
        user_id: user.id,
        original_url: longUrl,
        short_url: shortUrl,
        custom_url: customUrl || null,
        file_name: fileName,
        qr_code: `${supabaseUrl}/storage/v1/object/public/qr_codes/${fileName}`
    } ]).select();

    if ( error ) {
        console.log(error);
        throw new Error('Cannot create URL');
    }

    return data;
}

export async function getLongUrl( url ) {
    const user = await getCurrentUser();
    if ( !user ) {
        throw new Error('You are not logged in to create the URL');
    }

    const { data, error }
      = await supabase.from('urls')
    .select("id, original_url")
    .eq("user_id", user?.id)
    .or(`short_url.eq.${url},custom_url.eq.${url}`)
    .single();

    if ( error ) {
        console.log(error);
        throw new Error("URL Not Found.");
    }

    return data;
}

export async function getUrlDetails( urlId ) {
    console.log(urlId);
    const user = await getCurrentUser();
    if ( !user ) {
        throw new Error('You are not logged in to create the URL');
    }

    const { data: urlDetails, error }
      = await supabase.from('urls')
    .select("*")
    .eq("user_id", user?.id)
    .eq("id", urlId)
    .single();

    if ( error ) {
        console.log(error);
        throw new Error("URL Not Found.");
    }

    return urlDetails;
}