export const Versions = new Mongo.Collection('versions');
export const STATES = {
    WAITING: 0,
    SEEN: 1,
    COMMENT: 2
};