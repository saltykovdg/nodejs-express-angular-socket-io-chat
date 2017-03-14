// spec.js
describe('Chat Demo App', function() {
    it('should have a title', function() {
        browser.get('https://nodejs-express-angular-socket.herokuapp.com/');
        expect(browser.getTitle()).toEqual('nodejs-express-angular-socket-io');
    });
});