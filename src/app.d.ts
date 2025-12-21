import type { Database } from '$lib/database.types'
import {
	SupabaseClient,
	type UserAppMetadata,
	type UserMetadata
} from '@supabase/supabase-js'
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {

	type UserData = {
		id: string;
		email: string | null;
		phone: string | null;
		user_metadata: UserMetadata | null;
		app_metadata: UserAppMetadata | null;
		role: string | null;
		expires_at: number;
	};

	namespace App {
		// interface Error {}

		interface Locals {
			supabase: SupabaseClient<Database>
			getUser(latestFromServer?: boolean): Promise<{
				user: UserData | null
				error: Error | null
			}>
		}
		interface PageData {
			user: UserData | null
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
