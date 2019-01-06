const chai = require('chai');
const expect = chai.expect;

const {isRealString} = require('./validation');


describe('isRealString', () => {
    it('should reject non string values', () => {
        var str = 3444;
        var res = isRealString(str);
        expect(res).equal(false);
        console.log(res);
    });

    it('should reject with spaces', () => {
        var str = "  ";
        var res = isRealString(str);
        expect(res).equal(false);
        console.log(res);
    });

    it('should allow string with non space characters', () => {
        var str = "  Steven   ";
        var res = isRealString(str);
        expect(res).equal(true);
        console.log(res);
    });
});