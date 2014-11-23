var expect = require('expect.js'); 


describe('Design page', function() { 

	it('should contain', function() { 
		browser.get('#edit');
		//browser.sleep(1000000);
		element(by.xpath('//*[@id="tpCreatorCanvas"]/div/div/div/div[1]')).getText().then(function(text) { 
			expect(text).to.contain('Concepteur de TP'); 
		}); 
	}); 
});