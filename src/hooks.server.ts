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

  event.locals.getUser = async () => {

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

    const now = Math.floor(Date.now() / 1000);
    const exp = claimsData?.claims.exp;
    const isExpired = exp && exp < now;

    if (!isExpired) {
      return {
        error: null,
        user: claimsData.claims
      };
    }

    await event.locals.supabase.auth.signOut();

    return {
      error: null,
      user: null
    };
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name: string) {
      return name === 'content-range' || name === 'x-supabase-api-version'
    }
  });
}