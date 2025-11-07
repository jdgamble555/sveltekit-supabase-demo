import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
    locals: { getSafeUser },
    cookies,
    depends
}) => {

    depends('supabase:auth');

    const { user } = await getSafeUser();

    return {
        user,
        cookies: cookies.getAll()
    };
}