// class Person {
//     constructor(name, age){
//         this.name = name;
//         this.age = age
//     }
    // getUserDesc(){
    //     return `${this.name} is ${this.age} years old`;
    // }
// }

// let me = new Person('Steven', 50);
// console.log('this.name: ', me.name)

// let description = me.getUserDesc();
// console.log(description);

class Users {
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser(id){
        // var remainingUsers = this.users.filter(user => user.id !== id);
        // if(remainingUsers){
        //     return remainingUsers;
        // }
        // return console.log('didnt find that user to delete');
        //or:
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter(user => user.id !== id);
        }
        return user;
    }

    getUser(id){
        // var user = this.users.find(user => user.id === id)
        //or:
        //when such user exist return its object
        var user = this.users.filter(user => user.id === id)[0]

        if(user){
            return user;
        }
        return console.log('cant find user');
    }
    getUserList(room){
        //we filter the array and get the users with the matching rooms first, we now used map to pick only their names
        //also note, map converted the array of objects to an array of strings
        var userNames = this.users
            .filter(user => user.room === room)
            .map(user => user.name)

        return userNames;
    }
}

module.exports = {Users};