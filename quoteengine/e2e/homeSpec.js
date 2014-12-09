var Home = require('./util/Home');

describe.only('home:', function () {
    this.timeout(99999);

    var home = new Home();
    var zipWithSingleCounty = '17402';
    var zipWithMultipleCounties = '17055';
    
    beforeEach(function () {
        home.load();
        home.clearZip();
    });

    it('entering zip code displays single county', function () {
        home.enterZip(zipWithSingleCounty);
        home.assertCountyCount(1);
    })

    it('entering zip code displays multiple counties', function () {
        home.enterZip(zipWithMultipleCounties);
        home.assertCountyCount(2);
        home.assertCountyName(0, /Cumberland/);
        home.assertCountyName(1, /York/);
    });

    it('with required fields returns medical quote', function () {
        home.enterZip(zipWithMultipleCounties);
        home.selectCounty();
        home.self.dob = dob;
        home.quote();
    });

    it('with spouse and child dependency fields returns medical quote', function () {
        home.enterZip(zipWithMultipleCounties);
        home.selectCounty();
        
        home.addSpouse(false, dob, true);
        home.addChild(true, dob, false);
        
        home.quote();
    });
    
    it('allows addition and deletion of dependents', function () {
        home.enterZip(zipWithSingleCounty);
        home.assertDependentsCount(1);
        home.addSpouse();
        home.assertDependentsCount(2);
        home.addChild();
        home.assertDependentsCount(3);
        home.removeDependent();
        home.assertDependentsCount(2);
        home.removeDependent();
        home.assertDependentsCount(1);
    });

});