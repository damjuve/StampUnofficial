var store = new FS.Store.S3("files", {
    region: "eu-west-3", //optional in most cases
    accessKeyId: "AKIAIZTR3OTYBLFUG4DQ", //required if environment variables are not set
    secretAccessKey: "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", //required if environment variables are not set
    bucket: "stampbucket", //required
    maxTries: 2, //optional, default 5
    ACL: "private", //optional, default is 'private', but you can allow public or secure access routed through your app URL
    /*folder: "meteor", //optional, which folder (key prefix) in the bucket to use
    // The rest are generic store options supported by all storage adapters
    transformWrite: "", //optional
    transformRead: "", //optional
    */
  });

export const Files = new FS.Collection("files", {
  stores: [store]
});

Files.allow({
    insert: function() {
        // add custom authentication code here
        return true;
    },
    update: function() {
        // add custom authentication code here
        return true;
    },
    download: function(userId, fileObj) {
        // add custom authentication code here
		return true;
    },
    remove: function(userId, fileObj) {
        let isOwner = userId == fileObj.owner;
        let isTempFile = fileObj.temporary == true;
        return isOwner/* && isTempFile*/;
    }
});