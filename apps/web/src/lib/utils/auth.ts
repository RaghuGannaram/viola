import { redirect, error } from "@sveltejs/kit";
import { AccessLevel, UserRole, type IProfile, type IEnforceAccessProps } from "$lib/types/auth.types";

export function getUserRole(user: IProfile | null, ownerId?: string): UserRole {
	if (!user) {
		return UserRole.GUEST;
	}

	if (!ownerId || ownerId !== user.id) {
		return UserRole.MEMBER;
	}

	return UserRole.ARTIST;
}

export function enforceAccess(props: IEnforceAccessProps): void {
	const userRole = getUserRole(props.profile, props.ownerId);

	const accessMatrix: Record<AccessLevel, UserRole[]> = {
		[AccessLevel.PUBLIC]: [UserRole.GUEST, UserRole.MEMBER, UserRole.ARTIST],
		[AccessLevel.PRIVATE]: [UserRole.MEMBER, UserRole.ARTIST],
		[AccessLevel.PROTECTED]: [UserRole.ARTIST],
	};

	const permittedRoles = accessMatrix[props.requiredAccessLevel];

	if (!permittedRoles.includes(userRole)) {
		if (!props.profile) {
			throw redirect(302, `/login?redirect=${props.redirectPath}`);
		}

		throw error(403, "Access Denied");
	}
}
