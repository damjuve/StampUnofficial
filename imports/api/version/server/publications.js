import { Versions } from '../version.js';

Meteor.publish('version.details', (versionId) => {
    return Versions.find({_id: versionId});
});