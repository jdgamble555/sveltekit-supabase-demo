import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dev } from '$app/environment';

export const load = (async ({ url, locals: { supabase } }) => {

    const errorDescription = url.searchParams.get('error_description');

    if (errorDescription) {
        if (dev) {
            console.error(errorDescription);
        }
        error(400, errorDescription);
    }

    const code = url.searchParams.get('code');
    const next = url.searchParams.get('next') || '/';

    if (!code) {
        error(400, 'No code provided');
    }

    const { error: codeError } = await supabase
        .auth
        .exchangeCodeForSession(code);

    if (!codeError) {
        redirect(303, next);
    }
    if (dev) {
        console.error(codeError);
    }
    error(400, codeError.message);


}) satisfies PageServerLoad;