# Page objects

Page Objects help you write cleaner tests by encapsulating information about
the elements on your application page. A Page Object can be reused across
multiple tests, and if the template of your application changes, you only need
to update the Page Object.

### Declare one page object per file

* Each page object should be defined in its own file.

* Why? Keeps code clean and makes things easy to find.

### Use a single module.exports at the end of the page object file

* Each page object should declare a single class. You only need to export one
  class.

```js
// avoid

var UserProfilePage = function() {};
var UserSettingsPage = function() {};

module.exports = UserPropertiesPage;
module.exports = UserSettingsPage;
```

```javascript
// recommend

/** @constructor */
var UserPropertiesPage = function() {};

module.exports = UserPropertiesPage;
```

* Why? One Page Object per file means there's only one class to export.

### Require all the modules at the top

* You should declare all the required modules at the top of your page object,
  test, or helper module.

```js
var UserPage = require('./user-properties.page');
var MenuPage = require('./menu.page');
var FooterPage = require('./footer.page');

describe('User properties page', function() {
    ...
});
```

* Why? The module dependencies should be clear and easy to find.

### Instantiate all Page Objects at the beginning of the test suite

* Create new instances of the page object at the top of your top-level describe.
* Use upper case for the constructor name; lowercase for the instance name.

```js
var UserPropertiesPage = require('./user-properties.page');
var MenuPage = require('./menu.page');
var FooterPage = require('./footer.page');

describe('User properties page', function() {
  var userProperties = new UserPropertiesPage();
  var menu = new MenuPage();
  var footer = new FooterPage();

  // specs
});
```

* Why? Separates dependencies from the test code.
* Why? Makes the dependencies available to all specs of the suite.


### Declare all the page object public elements in the constructor

* All the elements that will be visible to the test should be declared in the
  constructor.

```html
<form>
  Name: <input type="text" ng-model="ctrl.user.name">
  E-mail: <input type="text" ng-model="ctrl.user.email">
  <button id="save-button">Save</button>
</form>
```

```javascript
/** @constructor */
var UserPropertiesPage = function() {
  // List all public elements here.
  this.name = element(by.model('ctrl.user.name'));
  this.email = element(by.model('ctrl.user.email'));
  this.saveButton = $('#save-button');
};
```

* Why? The user of the Page Object should have quick access to the available
  elements on a page


### Declare page object functions for operations that require more than one step.

```javascript
/**
 * Page object for the user properties view.
 * @constructor
 */
var UserPropertiesPage = function() {
  this.newPhoneButton = $('button.new-phone');

  /**
   * Encapsulate complex operations in a function.
   * @param {string} phone Phone number.
   * @param {string} contactType Phone type (work, home, etc.).
   */
  this.addContactPhone = function(phone, contactType) {
    this.newPhoneButton.click();
    $$('#phone-list .phone-row').first().then(function(row) {
      row.element(by.model('item.phoneNumber')).sendKeys(phone);
      row.element(by.model('item.contactType')).sendKeys(contactType);
    });
  };
};
```

* Why? Most elements are already exposed by the Page Object and can be used
  directly in the test.
* Why? Doing otherwise will not have any added value

## Page object locators

### Favor protractor locator strategies when possible

* Prefer protractor-specific locators such as `by.model` and `by.binding`.
* These locators are usually specific, short, and easy to read.

```html
<ul class="red">
  <li>{{color.name}}</li>
  <li>{{color.shade}}</li>
  <li>{{color.code}}</li>
</ul>

<div class="details">
  <div class="personal">
    <input ng-model="person.name">
  </div>
</div>
```

```js
// avoid
var nameElement = element.all(by.css('.red li')).get(0);
var personName = element(by.css('.details .personal input'));

// recommended
var nameElement = element(by.binding('color.name'));
var personName = element(by.model('person.name'));
```

* Why? It is easier to write your locator
* Why? The code is less likely to change than other markup
* Why? The locators are more readable

### Try to avoid text locators for text that changes frequently

* Try to avoid text-based locators such as `by.linkText`, `by.buttonText`,
  `by.cssContainingText`.

* Why? Text for buttons, links, and labels tends to change over time. Minor text
  changes in your application should not break your tests.

### Add Page Object wrappers for directives, dialogs, and common elements

* Some directives render complex HTML or they change frequently. Avoid code
  duplication by writing wrappers to interact with complex directives.
* Dialogs or modals are frequently used across multiple views.
* When the directive changes you only need to change the wrapper once.

For example, the Protractor website has navigation bar with multiple dropdown
menus. Each menu has multiple options. A page object for the menu would look
like this:

```js
/**
 * Page object for Protractor website menu.
 * @constructor
 */
var MenuPage = function() {
  this.dropdown = function(dropdownName) {
    /**
     * Dropdown api. Used to click on an element under a dropdown.
     * @param {string} dropdownName
     * @return {{option: Function}}
     */
    var openDropdown = function() {
      element(by.css('.navbar-nav'))
          .element(by.linkText(dropdownName))
          .click();
    };

    return {
      /**
       * Get an option element under a dropdown.
       * @param {string} optionName
       * @return {ElementFinder}
       */
      option: function(optionName) {
        openDropdown();
        return element(by.css('.dropdown.open'))
            .element(by.linkText(optionName));
      }
    }
  };
};

module.exports = MenuPage;
```

```js
var Menu = require('./menu');

describe('protractor webstie', function() {

  var menu = new Menu();

  it('should navigate to API view', function() {
    browser.get('http://www.protractortest.org/#/');

    menu.dropdown('Reference').option('Protractor API').click();

    expect(browser.getCurrentUrl())
        .toBe('http://www.protractortest.org/#/api');
  });
});
```

* Why? When you have a large team and multiple e2e tests people tend to write
  their own custom locators for the same directives.


# Tests

### Use Jasmine 2

* TODO: (you can use beforeAll)

### Make your tests independent at least at the file level

* Protractor can run your tests in parallel when you enable sharding. The files
  are executed across different browsers as they become available.
* Make your tests independent at the file level because the order in which
  they run is not guaranteed and it's easier to run a test in isolation.
