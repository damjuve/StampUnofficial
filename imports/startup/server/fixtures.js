// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { createFullUser } from '/imports/api/account/utils.js';
import { 
	createSpace,
	addUserToSpace
} from '/imports/api/space/utils.js';
import {
	createFolder,
	addUserToFolder
} from '/imports/api/folder/utils.js';
import { Spaces } from '../../api/space/space';

//import { Links } from '/imports/api/links/links.js';

Meteor.startup(() => {
	// if the Users collection is empty
	return ;
	if (Meteor.users.find().count() === 0) {
		console.log("FIXTURES CREATION");
		let user1 = createFullUser("Pierrot", "user1@gmail.com", "password");
		console.log("New User Created : user1@gmail.com / password");
		let user2 = createFullUser("John44", "user2@gmail.com", "password");
		console.log("New User Created : user2@gmail.com / password");
		let user3 = createFullUser("Valerian", "user3@gmail.com", "password");
		console.log("New User Created : user3@gmail.com / password");
		
		let spaceId = createSpace("Projet Tuileries", user1);
		console.log("New Space Created : Projet Tuileries");
		addUserToSpace(user2, spaceId);
		addUserToSpace(user3, spaceId);

		let space = Spaces.findOne(spaceId);
		let usersInvited = [
			{
				userId: user2,
				read: true,
				addDocument: true,
				addVersion: true,
				stamp: true,
				admin: true
			},
			{
				userId: user3,
				read: true,
				addDocument: true,
				addVersion: true,
				stamp: true,
				admin: true
			}
		];
		createFolder("Photos", space.rootFolder, user1, usersInvited);
		createFolder("Plans", space.rootFolder, user1, usersInvited);
		createFolder("Archives", space.rootFolder, user1, usersInvited);
		createFolder("Documents", space.rootFolder, user1, usersInvited);
		console.log("FIXTURES CREATED");
	}


    /* if the Links collection is empty
    if (Links.find().count() === 0) {
      const data = [
        {
          title: 'Do the Tutorial',
          url: 'https://www.meteor.com/try',
          createdAt: new Date(),
        },
        {
          title: 'Follow the Guide',
          url: 'http://guide.meteor.com',
          createdAt: new Date(),
        },
        {
          title: 'Read the Docs',
          url: 'https://docs.meteor.com',
          createdAt: new Date(),
        },
        {
          title: 'Discussions',
          url: 'https://forums.meteor.com',
          createdAt: new Date(),
        },
      ];

      data.forEach(link => Links.insert(link));
    }*/
});
