var Home = require('./Home');

describe('home:', function () {
    this.timeout(99999);

    var home;
    var dob = '07/06/1986';
   
    beforeEach(function () {
        home = new Home();
        home.load();
    });

    it('entering zip code displays single county', function () {
        home.location.enterZip('17012');
        home.location.assertCountyCount(1);
    })

    it('entering zip code displays multiple counties', function () {
        home.location.enterZip('17055');
        home.location.assertCountyCount(2);
        home.location.assertCountyName(0, /Cumberland/);
        home.location.assertCountyName(1, /York/);
    });

    it('with required fields returns medical quote', function () {
        Home.login();
    });

    it('with spouse and child dependency fields returns medical quote', function () {
        home.location.enterZip('17055');
        home.location.selectCounty();
        
        home.dependents.addSelf(true, dob, false);
        home.dependents.addSpouse(false, dob, true);
        home.dependents.addChild(true, dob, false);
        
        home.quote();
    });
    
    it('allows addition and deletion of dependents', function () {
        home.location.enterZip('17012');
        home.dependents.addSelf();
        home.dependents.assertDependentsCount(1);
        home.dependents.addSpouse();
        home.dependents.assertDependentsCount(2);
        home.dependents.addChild();
        home.dependents.assertDependentsCount(3);
        home.dependents.removeDependent();
        home.dependents.assertDependentsCount(2);
        home.dependents.removeDependent();
        home.dependents.assertDependentsCount(1);
    });

});