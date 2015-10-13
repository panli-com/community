var React = require('react/addons');
var {Link} = require('react-router');


var Header = React.createClass({
  render: function () {

    return (
      <header>
        <a href="#" className="logo-a"><img src="www/logo.png" /></a>
          <span className="icon-github3 icon-head"></span>
      </header>
    );
  }
});


module.exports = Header;
