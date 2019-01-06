const chai = require('chai');
const expect = chai.expect;

const {generateMessage, generateLocationMessage} = require('./message');

//this is synchronous so we dont need the done
describe('generateMessage', () => {
    it('should generate correct message object', () => {
        var from = "Steven";
        var text = "this is it"
        var res = generateMessage(from, text);
        expect(res.from).equal('Steven');
        expect(res.text).equal('this is it');
        expect(res).to.include({from, text});
        expect(res.createdAt).to.be.a('number');
        console.log(res);
    });
});

describe('generateLocationMessage', () => {
    it('should generate correct location object', () => {
        var from = "Me";
        var latitude = 1
        var longitude = 1;
        var res = generateLocationMessage(from, latitude, longitude);
        expect(res.from).equal('Me');
        console.log(res)
        expect(res).to.include({
            from
        }); 
        expect(res.createdAt).to.be.a("number");
        expect(res.url).equal('https://www.google.com/maps?q=1,1');
    });
});