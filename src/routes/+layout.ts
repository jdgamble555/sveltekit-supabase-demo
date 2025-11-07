import {
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    PUBLIC_SUPABASE_URL
} from '$env/static/public';
import type { Database } from '$lib/database.types';
import type { LayoutLoad } from './$types';
import {
    createBrowserClient,
    createServerClient,
    isBrowser
} from '@supabase/ssr';

export const load: LayoutLoad = async ({ fetch, data }) => {

    const supabase = isBrowser()
        ? createBrowserClient<Database>(
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                global: {
                    fetch,
                },
            })
        : createServerClient<Database>(
            PUBLIC_SUPABASE_URL,
            PUBLIC_SUPABASE_PUBLISHABLE_KEY,
            {
                global: {
                    fetch,
                },
                cookies: {
                    getAll() {
                        return data.cookies
                    },
                },
            });

    return {
        supabase,
        user: data.user
    };
}