// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import { type IProfile } from "$lib/types";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
            profile: IProfile | null;
            accessToken: string | null;
        }
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
