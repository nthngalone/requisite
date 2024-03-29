export default {
    'users': [{
        'domain': 'local',
        'userName': 'nthngaloneTechOwner',
        'name': { 'firstName': 'NthngAloneTech', 'lastName': 'Owner' },
        'emailAddress': 'nthngaloneTechOwner@requisite.io',
        'avatar': '',
        'locked': false,
        'expired': false
    }, {
        'domain': 'local',
        'userName': 'requisiteOwner',
        'name': { 'firstName': 'Requisite', 'lastName': 'Owner' },
        'emailAddress': 'requisiteOwner@requisite.io',
        'avatar': '',
        'locked': false,
        'expired': false
    }, {
        'domain': 'local',
        'userName': 'requisiteStakeholder',
        'name': { 'firstName': 'Requisite', 'lastName': 'Stakeholder' },
        'emailAddress': 'requisiteStakeholder@requisite.io',
        'avatar': '',
        'locked': false,
        'expired': false
    }, {
        'domain': 'local',
        'userName': 'requisiteContributor',
        'name': { 'firstName': 'Requisite', 'lastName': 'Contributor' },
        'emailAddress': 'requisiteContributor@requisite.io',
        'avatar': '',
        'locked': false,
        'expired': false
    }],
    'organization': {
        'name': 'nthngalone-technologies',
        'memberships': [{
            'user': { 'userName': 'nthngaloneTechOwner' },
            'role': 'OWNER'
        }, {
            'user': { 'userName': 'requisiteOwner' },
            'role': 'MEMBER'
        }, {
            'user': { 'userName': 'requisiteStakeholder' },
            'role': 'MEMBER'
        }, {
            'user': { 'userName': 'requisiteContributor' },
            'role': 'MEMBER'
        }],
        'products': [{
            'name': 'requisite',
            'description': 'convention over configuration for requirements and work tracking',
            'memberships': [{
                'user': { 'userName': 'requisiteOwner' },
                'role': 'OWNER'
            }, {
                'user': { 'userName': 'requisiteStakeholder' },
                'role': 'STAKEHOLDER'
            }, {
                'user': { 'userName': 'requisiteContributor' },
                'role': 'CONTRIBUTOR'
            }],
            'personas': [
                { 'name': 'All' },
                { 'name': 'Administrator' },
                { 'name': 'Product-Owner' },
                { 'name': 'Project-Manager' },
                { 'name': 'Stakeholder' },
                { 'name': 'Contributor' }
            ],
            'features': [{
                'name': 'Authentication',
                'description': '',
                'stories': [{
                    'title': 'Login View',
                    'description': 'Displays the login form for all users',
                    'personas': [{ 'id': 1, 'name': 'All' }],
                    'revisions': [{
                        'revisionNumber': 1,
                        'completionState': 'REFINEMENT',
                        'size': 0,
                        'mockup': null,
                        'screenshot': null,
                        'modificationState': 'NEW',
                        'billingCode': null,
                        'acceptanceCriteria': [{
                            'description': 'Displays a text input to collect the user name',
                            'modificationState': 'NEW'
                        }, {
                            'description': 'Displays a password input to collect the user\'s password',
                            'modificationState': 'NEW'
                        }, {
                            'description': 'Displays instructional content',
                            'modificationState': 'NEW'
                        }, {
                            'description': 'Displays a registration link that navigates the user to the registration view',
                            'modificationState': 'NEW'
                        }]
                    }, {
                        'revisionNumber': 2,
                        'completionState': 'REFINEMENT',
                        'size': 0,
                        'mockup': null,
                        'screenshot': null,
                        'modificationState': 'UPDATED',
                        'billingCode': null,
                        'acceptanceCriteria': [{
                            'description': 'Displays a text input to collect the user name',
                            'modificationState': 'UNCHANGED'
                        }, {
                            'description': 'Displays a password input to collect the user\'s password',
                            'modificationState': 'UNCHANGED'
                        }, {
                            'description': 'Displays instructional content',
                            'modificationState': 'UNCHANGED'
                        }, {
                            'description': 'Displays a registration link that navigates the user to the registration view',
                            'modificationState': 'UNCHANGED'
                        }, {
                            'description': 'Displays a forgot password link that navigates the user to the forgot password view',
                            'modificationState': 'NEW'
                        }]
                    }]
                }, {
                    'title': 'Invalid Credentials',
                    'description': 'When invalid credentials are submitted, a warning or error is displayed to the user',
                    'personas': [{ 'id': 1, 'name': 'All' }],
                    'revisions': [{
                        'revisionNumber': 1,
                        'completionState': 'REFINEMENT',
                        'size': 0,
                        'mockup': null,
                        'screenshot': null,
                        'modificationState': 'NEW',
                        'billingCode': null,
                        'acceptanceCriteria': [{
                            'description': 'When the user name is blank, a warning is displayed that the user name is required',
                            'modiciationState': 'NEW'
                        }, {
                            'description': 'When the password is blank, a warning is displayed that the password is required',
                            'modiciationState': 'NEW'
                        }, {
                            'description': 'When the user name is invalid, an error is displayed to indicate invalid credentials',
                            'modiciationState': 'NEW'
                        }, {
                            'description': 'When the password is invalid, an error is displayed to indicate invalid credentials',
                            'modiciationState': 'NEW'
                        }]
                    }]
                }]
            }, {
                'name': 'Registration',
                'description': '',
                'stories': []
            }, {
                'name': 'Home',
                'description': '',
                'stories': []
            }]
        }]
    }
};
