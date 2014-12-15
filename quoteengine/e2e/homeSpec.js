var Home = require('./util/Home');

describe('home:', function () {
    this.timeout(99999);

    var home;
    var dob = '07/06/1986';
   
    beforeEach(function () {
        home = new Home();
        home.load();
    });

    it('entering zip code displays single county', function () {
        home.enterZip('17012');
        home.assertCountyCount(1);
    })

    it('entering zip code displays multiple counties', function () {
        home.enterZip('17055');
        home.assertCountyCount(2);
        home.assertCountyName(0, /Cumberland/);
        home.assertCountyName(1, /York/);
    });

    it('with required fields returns medical quote', function () {
        Home.login();
    });

    it('with spouse and child dependency fields returns medical quote', function () {
        home.enterZip('17055');
        home.selectCounty();
        
        home.addSelf(true, dob, false);
        home.addSpouse(false, dob, true);
        home.addChild(true, dob, false);
        
        home.quote();
    });
    
    it('allows addition and deletion of dependents', function () {
        home.enterZip('17012');
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