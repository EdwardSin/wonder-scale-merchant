import { Role } from '@enum/Role.enum';
import { Contributor } from "@objects/contributor";

export class ContributorController {
    selectedContributor?: Contributor;
    exists_contributors?: Array<Contributor>;
    new_contributors?: Array<Contributor>;
    new_role?: Role = Role.Admin;
    searchEmail?: string;
    searchText?: string;
    seachClicked?: boolean;
    errors: { contributor: string };


    constructor() {
        this.new_contributors = new Array;
        this.exists_contributors = new Array;
        this.selectedContributor = new Contributor;
        this.errors = { contributor: '' };
    }

    validate() {
        var valid = true;
        var filteredContributors = this.exists_contributors.filter(x => x != this.selectedContributor);
        if (this.new_role === Role.Maintainer && !filteredContributors.find(x => x.role === Role.Admin)
        ) {
            this.errors.contributor = 'At least 1 admin in the shop!';
            valid = false;
        }
        return valid;
    }
    reset() {
        this.errors.contributor = '';
    }
}