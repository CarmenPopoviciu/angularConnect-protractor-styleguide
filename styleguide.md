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

# Tests

### Use Jasmine 2

* TODO: (you can use beforeAll)

### Make your tests independent at least at the file level

* Protractor can run your tests in parallel when you enable sharding. The files
  are executed across different browsers as they become available.
* Make your tests independent at the file level because the order in which
  they run is not guaranteed and it's easier to run a test in isolation.
