import {
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_PUBLISHABLE_KEY
} from '$env/static/public'
import type { Database } from '$lib/database.types';
import { createServerClient } from '@supabase/ssr'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {

  event.locals.supabase = createServerClient<Database>(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: '/' })
          })
        },
      },
    });

  event.locals.getSafeUser = async () => {

    const {
      data: claimsData,
      error: claimsError
    } = await event.locals.supabase.auth.getClaims();

    if (claimsError) {
      return {
        error: claimsError,
        user: null
      };
    }

    if (!claimsData) {
      return {
        error: null,
        user: null
      };
    }

    return {
      error: null,
      user: claimsData.claims
    };
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name: string) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    }
  });
}