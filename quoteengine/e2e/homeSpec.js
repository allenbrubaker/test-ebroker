var Home = require('./util/Home');
var constants = require('./util/constants');

describe.only('home:', function () {
    this.timeout(99999);

    var home;
   
    beforeEach(function () {
        home = new Home();
        home.load();
        home.clearZip();
    });

    it('entering zip code displays single county', function () {
        home.enterZip(constants.zipWithSingleCounty);
        home.assertCountyCount(1);
    })

    it('entering zip code displays multiple counties', function () {
        home.enterZip(constants.zipWithMultipleCounties);
        home.assertCountyCount(2);
        home.assertCountyName(0, /Cumberland/);
        home.assertCountyName(1, /York/);
    });

    it('with required fields returns medical quote', function () {
        Home.login();
    });

    it('with spouse and child dependency fields returns medical quote', function () {
        home.enterZip(constants.zipWithMultipleCounties);
        home.selectCounty();
        
        home.addSelf(true, constants.dob, false);
        home.addSpouse(false, constants.dob, true);
        home.addChild(true, constants.dob, false);
        
        home.quote();
    });
    
    it('allows addition and deletion of dependents', function () {
        home.enterZip(constants.zipWithSingleCounty);
        home.addSelf();
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