import supabase, { supabaseUrl } from '@/db/supabase.ts'

export async function login( { email, password } ) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if ( error ) {
        throw new Error(error.message);
    }

    return data;
}

export async function getCurrentUser() {
    const { data: session, error } = await supabase.auth.getSession();
    if ( !session.session ) return null;

    // const {data, error} = await supabase.auth.getUser();

    if ( error ) throw new Error(error.message);

    return session.session?.user;
}

export async function signup( data ) {
    const fileName = `dp-${data.name.split(" ").join("-")}-${Date.now()}`;
    const { error: uploadError } = await supabase.storage.from('pictures').upload(fileName, data.profile_pic);

    if ( uploadError ) {
        throw new Error(uploadError.message);
    }

    const { data: details, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: data.name,
                profile_pic: `${supabaseUrl}/storage/v1/object/public/pictures/${fileName}`
            }
        }
    });

    if ( error ) {
        throw new Error(error.message);
    }

    return details;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();

    if ( error ) {
        throw new Error(error.message);
    }

    return true;
}