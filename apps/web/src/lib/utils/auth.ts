import { redirect, error } from "@sveltejs/kit";
import { AccessLevel, UserRole, type IProfile } from "$lib/types/auth.types";

export function getUserRole(user: IProfile | null, ownerId?: string): UserRole {
	if (!user) {
		return UserRole.GUEST;
	}

	if (!ownerId || ownerId !== user.id) {
		return UserRole.MEMBER;
	}

	return UserRole.ARTIST;
}

export function enforceAccess(user: IProfile | null, requiredAccessLevel: AccessLevel, ownerId?: string): void {
	const userRole = getUserRole(user, ownerId);

	const accessMatrix: Record<AccessLevel, UserRole[]> = {
		[AccessLevel.PUBLIC]: [UserRole.GUEST, UserRole.MEMBER, UserRole.ARTIST],
		[AccessLevel.PRIVATE]: [UserRole.MEMBER, UserRole.ARTIST],
		[AccessLevel.PROTECTED]: [UserRole.ARTIST],
	};

	const permittedRoles = accessMatrix[requiredAccessLevel];

	if (!permittedRoles.includes(userRole)) {
		if (!user) {
			throw redirect(302, "/login");
		}

		throw error(403, "Access Denied");
	}
}
