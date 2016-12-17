import chai from 'chai';
import Library from '../lib/library.js';

chai.expect();

const expect = chai.expect;

let lib;

describe('Given an instance of my library', function () {
  before(function () {
    lib = new Library();
  });
  describe('when I need the name', function () {
    it('should return the name', () => {
      expect(lib.name).to.be.equal('Library');
    });
  });
});
