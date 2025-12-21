import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals: { supabase, getUser } }) => {

    const { user } = await getUser()

    if (!user) {
        redirect(303, '/')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select(`username, full_name, website, avatar_url`)
        .eq('id', user.id)
        .single()

    return { user, profile }
}

export const actions: Actions = {

    update: async ({ request, locals: { supabase, getUser } }) => {
        const formData = await request.formData()
        const fullName = formData.get('fullName') as string
        const username = formData.get('username') as string
        const website = formData.get('website') as string
        const avatarUrl = formData.get('avatarUrl') as string

        const { user } = await getUser()

        if (!user) {
            return fail(403, { fullName, username, website, avatarUrl })
        }

        const { error } = await supabase.from('profiles').upsert({
            id: user.id,
            full_name: fullName,
            username,
            website,
            avatar_url: avatarUrl,
            updated_at: new Date().toISOString(),
        })

        if (error) {
            return fail(500, {
                fullName,
                username,
                website,
                avatarUrl,
            })
        }

        return {
            fullName,
            username,
            website,
            avatarUrl,
        }
    },
    signout: async ({ locals: { supabase, getUser } }) => {
        
        const { user } = await getUser()
        if (user) {
            await supabase.auth.signOut()
            redirect(303, '/')
        }
    },
}