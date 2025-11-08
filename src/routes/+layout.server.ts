import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = async ({
    locals: { getUser },
    cookies,
    depends
}) => {

    depends('supabase:auth');

    const { user } = await getUser();

    return {
        user,
        cookies: cookies.getAll()
    };
}