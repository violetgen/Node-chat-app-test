const chai = require('chai');
const expect = chai.expect;
const {Users} = require('./users');

describe('Users', () => {
    //we want the user to be accessible in the beforeEach and in the test case, so, we initialize it:
    var users;

    beforeEach(() => {
        users = new Users();
        //lets populate the users array from the class
        users.users = [{
            id: '234',
            name: 'Steven',
            room: 'Office 1'
        }, {
            id: '321',
            name: 'Ojo Ken',
            room: 'Office 2'
        }, {
            id: '444',
            name: 'don sas',
            room: 'Office 1'
        }];
    })

    it('should add a user', () => {
        // var users = new Users();
        let user = {
            id: '123',
            name: 'Steven',
            room: 'the back room' 
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(resUser).deep.equal(user)
        // console.log(resUser);
    });

    // it('should remove a user', () => {
    //     var userId = users.users[0].id;
    //     var remainingUsers = users.removeUser(userId);
    //     expect(remainingUsers).is.not.null;
    //     expect(remainingUsers.length).equal(2);

    //     // console.log(remainingUsers);
    // })
    // it('should not remove a user', () => {
    //     var userId = '2334';
    //     var remainingUsers = users.removeUser(userId);
    //     expect(remainingUsers.length).equal(3);
    // })
    // or:
    it('should remove a user', () => {
        var userId = users.users[0].id;
        var deletedUser = users.removeUser(userId);
        expect(deletedUser.id).equal(userId);
        expect(users.users.length).equal(2)
        // console.log(deletedUser);
    });
    it('should not remove a user', () => {
        var userId = '2334';
        var deletedUser = users.removeUser(userId);
        expect(users.users.length).equal(3);
    });

    it('should find a user', () => {
        var userId = users.users[2].id;
        var user = users.getUser(userId);
        // expect(user.name).equal(users.users[2].name);
        expect(user).to.include({
            id: users.users[2].id,
            name: users.users[2].name,
            room: users.users[2].room,
        });
    });

    it('should not find a user', () => {
        var userId = '3421';
        var user = users.getUser(userId);
        expect(user).to.include({})
    });

    it('should get list of user names for office 1', () => {
        var roomName =  'Office 1';
        var userNames = users.getUserList(roomName);
        console.log(userNames);
        expect(userNames).deep.equal([
            users.users[0].name,
            users.users[2].name
        ]);
    });

    it('should get list of user names for office 2', () => {
        var roomName =  'Office 2';
        var userNames = users.getUserList(roomName);
        console.log(userNames);
        expect(userNames).deep.equal([
            users.users[1].name,
        ]);
    });
});