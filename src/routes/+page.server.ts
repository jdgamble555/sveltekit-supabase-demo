import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { getSafeUser } }) => {

    const { user } = await getSafeUser()

    // if the user is already logged in return them to the account page
    if (user) {
        redirect(303, '/account')
    }

    return { url: url.origin }
}

export const actions: Actions = {

    default: async (event) => {
        const {
            request,
            locals: { supabase }
        } = event
        const formData = await request.formData()
        const email = formData.get('email') as string
        const next = formData.get('next') as string || '/'
        const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)

        if (!validEmail) {
            return fail(400, { errors: { email: "Please enter a valid email address" }, email })
        }

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${event.url.origin}/auth/callback?next=${next}`
            }
        })

        if (error) {
            return fail(400, {
                success: false,
                email,
                message: `There was an issue, Please contact support.`
            })
        }

        return {
            success: true,
            message: 'Please check your email for a magic link to log into the website.'
        }
    }
}