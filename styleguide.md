## Declare one page object per file

Each page object should be defined in its own file.

## Use a single module.exports at the end of the page object file

Each page object should declare a single class. You only need to export one
class.

```javascript
/** @constructor */
var UserPropertiesPage = function() {};

module.exports = UserPropertiesPage;
```
