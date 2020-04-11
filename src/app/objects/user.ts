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
	resetToken?: String;
	active?: boolean;
	type?: string;
	token?: string;
	blacklist?: Array<string>
	follow?: {
		items: Array<string>,
		shops: Array<string>,
		jobs: Array<string>
	}
	like?: {
		items: Array<string>,
		shops: Array<string>,
		jobs: Array<string>
	}
}
