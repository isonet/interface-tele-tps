var expect = require('expect.js'); 


describe('Page Routing', function() {

	it('Edit', function() {
		browser.get('#edit');
		element(by.xpath('//*[@id="tpCreatorCanvas"]/div/div/div/div[1]')).getText().then(function(text) {
			expect(text).to.contain('Concepteur de TP'); 
		}); 
	});

	it('New', function() {
		browser.get('#new');
		element(by.xpath('/html/body/div[1]/div/div/div/div/div[1]')).getText().then(function(text) {
			expect(text).to.contain('Créer un TP');
		});
	});

});