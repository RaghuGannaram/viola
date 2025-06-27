//####################################### Entity Data Types ####################################
//User
// export interface IUser {
// 	id: string;
// 	fullname: string;
// 	handle: string;
// 	email: string;
// 	password: string;
// 	avatar: string;
// 	background: string;
// 	bio: string;
// 	city: string;
// 	from: string;
// 	role: "user" | "moderator" | "admin";
// 	followers: string[] | Pick<IUser, "id" | "fullname" | "handle" | "avatar">[];
// 	followees: string[] | Pick<IUser, "id" | "fullname" | "handle" | "avatar">[];
// 	createdAt: Date;
// 	updatedAt: Date;
// }

export interface IUserUpdate {
	username: string;
	bio: string;
	city: string;
	from: string;
}

export interface IUserFileUpdate {
	type: "avatar" | "background";
	file: Express.Multer.File;
}

//Post
export interface IPost {
	id: string;
	// author: string | Pick<IUser, "id" | "fullname" | "handle" | "avatar">;
	description: string;
	image: {
		thumbnail: string;
		original: string;
	};
	likes: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface IPostCreate {
	description: string;
	image: string | Express.Multer.File;
}

export interface IPostUpdate {
	description?: string;
	image?: string;
	file?: Express.Multer.File;
}

export interface IComment {
	id: string;
	post: string;
	// author: string | Pick<IUser, "id" | "fullname" | "handle" | "avatar">;
	description: string;
	likes: string[];
	hidden: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export * from "./auth.types";
export * from "./cache.types";
export * from "./error.types";
export * from "./logger.types";
export * from "./middleware.types";
export * from "./token.types";
export * from "./audio.types";
