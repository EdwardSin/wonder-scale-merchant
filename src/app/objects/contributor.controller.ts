import { Role } from '@enum/Role.enum';
import { Contributor } from "@objects/contributor";

export class ContributorController {
    selectedContributor?: Contributor;
    existsContributors?: Array<Contributor>;
    newContributors?: Array<Contributor>;
    newRole?: Role = Role.Admin;
    searchEmail?: string;
    searchText?: string;
    seachClicked?: boolean;
    errors: { contributor: string };


    constructor() {
        this.newContributors = new Array;
        this.existsContributors = new Array;
        this.selectedContributor = new Contributor;
        this.errors = { contributor: '' };
    }

    validate() {
        var valid = true;
        var filteredContributors = this.existsContributors.filter(x => x != this.selectedContributor);
        if (this.newRole === Role.Maintainer && !filteredContributors.find(x => x.role === Role.Admin)
        ) {
            this.errors.contributor = 'At least 1 admin in the store!';
            valid = false;
        }
        return valid;
    }
    reset() {
        this.errors.contributor = '';
    }
}