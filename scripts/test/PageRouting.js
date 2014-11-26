var expect = require('expect.js');


describe('Page Routing', function() {

	it('Edit', function() {
		browser.get('#edit');
		element(by.xpath('/html/body/div[1]/div/div/div/div/div[1]')).getText().then(function(text) {
			expect(text).to.contain('Concepteur de TP'); 
		}); 
	});

	it('New', function() {
		browser.get('#new');
		element(by.xpath('/html/body/div[1]/div/div/div/div/div[1]')).getText().then(function(text) {
			expect(text).to.contain('Créer un TP');
		});
	});

	it('List', function() {
		browser.get('#list');
		element(by.xpath('/html/body/div[1]/div/div/div/div/div[1]')).getText().then(function(text) {
			expect(text).to.contain('Mes TP');
		});
	});

	it('Wrong link', function() {
		browser.get('#fail');
		element(by.xpath('/html/body/div[1]/div/div/div/div/div[1]')).getText().then(function(text) {
			expect(text).to.contain('Mes TP');
		});
	});

});