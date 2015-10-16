# Page objects

Page Objects help you write cleaner tests by encapsulating information about
the elements on your application page. A Page Object can be reused across
multiple tests, and if the template of your application changes, you only need
to update the Page Object.

### Declare one page object per file

* Each page object should be defined in its own file.

### Use a single module.exports at the end of the page object file

* Each page object should declare a single class. You only need to export one
  class.

```javascript
/** @constructor */
var UserPropertiesPage = function() {};

module.exports = UserPropertiesPage;
```

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

* Why? The user of the page object should be able to quickly find which element
  are available to write the test.

### Declare page object functions for operations that require more that one step.

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

### Try to avoid text locators for text text that changes frequently

* Try to avoid text-based locators such as `by.linkText`, `by.buttonText`,
  `by.cssContainingText`.

* Why? Text for buttons, links, and labels tends to change over time. Minor text
  changes in your application should not break your tests.

### Add Page Object wrappers for directives

* Some directives render complex HTML or they change frequently. Avoid code
  duplication by writing wrappers to interact with complex directives.
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
    var openDropdown = function() {
      $('.navbar-nav')
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
        return $('.dropdown.open')
            .element(by.linkText(optionName));
      }
    }
  };
};

module.exports = MenuPage();
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

# Tests

### Use Jasmine 2

* TODO: (you can use beforeAll)

### Make your tests independent at least at the file level

* Protractor can run your tests in parallel when you enable sharding. The files
  are executed across different browsers as they become available.
* Make your tests independent at the file level because the order in which
  they run is not guaranteed and it's easier to run a test in isolation.
