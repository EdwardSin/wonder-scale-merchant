export class User {
	_id: string;
	firstName: string;
	lastName: string;
	dateOfBirth: Date;
	tel: string;
	password?: string;
	email: string;
	gender?: string;
	profileImage?: string;
	receiveInfo?: boolean;
	resetToken?: string;
	active?: boolean;
	type?: string;
	token?: string;
	existsPassword?: boolean;
	blacklist?: Array<string>
	follow?: {
		item: Array<string>,
		store: Array<string>,
		job: Array<string>
	}
	like?: {
		item: Array<string>,
		store: Array<string>,
		job: Array<string>
	}
}
