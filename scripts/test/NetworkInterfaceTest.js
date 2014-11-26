// Describe the test suite for this module.
describe(
    "The NetworkInterfac provides the drawing and more tools",
    function(){

        it(
            "should resize correctly",
            function(){
                browser.get('#edit');
                var el = element(by.id('mainSvg'));
                console.log(el);
                console.log(el.getCssValue('width'));
                //element(by.id('mainCanvas').getText().then(function(text) {
                //    expect(text).to.contain('Concepteur de TP');
                //}));

            }
        );



    }
);
