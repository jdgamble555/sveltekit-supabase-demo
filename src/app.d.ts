import { SupabaseClient, type JwtPayload } from '@supabase/supabase-js'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			supabase: SupabaseClient
			getUser(): Promise<{
				user: JwtPayload | null
				error: Error | null
			}>
		}
		interface PageData {
			user: JwtPayload | null
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
