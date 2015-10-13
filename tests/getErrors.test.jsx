var should = require('should');
var React = require('react/addons');
var TestUtils = React.addons.TestUtils;
var assign = require('react/lib/Object.assign');

describe('CreateForm', function () {

  var Formation = require('../src/form');

  describe('#getErrors', function () {
    var form;
    beforeEach(function () {
      var Form = Formation.CreateForm({
        getSchema: function () {
          return {
            foo: {label: 'Foo', required: true},
            bar : {validations: function (val) {
              if (val > this.state.max) return false;
              return 'Must be greater than ' + this.state.max;
            }},
            fizz: {type: 'email'},
            email: {required: true, validations: 'email'},
            name: {validations: Formation.Validator.maxLength(10)},
            lastName: {required: function () {
              return this.state.name;
            }},
            apples: {validations: Formation.Validator.min(10, {message: 'Must be ${min} apples'})},
            oranges: {validations: Formation.Validator.number({message: 'Orange'})}
          };
        },
        onSuccess: function () {},
        render: function () {
          return <form />;
        }
      });
      form = TestUtils.renderIntoDocument(<Form  />);
    });

    it('should return an error if value is falsey and required', function () {
      should.deepEqual(form.getErrors('foo'), ['Foo is required']);
    });

    it('should evaluate a conditional required function in the right contextConfig', function () {
      should.equal(form.getErrors('lastName'), false);
      form.setState({name: 'Kate'});
      should.deepEqual(form.getErrors('lastName'), ['lastName is required']);
    });
    it('should validate built in validators in the right context', function () {
      form.setState({name: 'Kate'});
      should.deepEqual(form.getErrors('name'), false);
      form.setState({name: 'Kateasdasdsadasdasdasdasd'});
      should.deepEqual(form.getErrors('name'), ['Must be less than 10 characters']);
    });
    it('should return a validation error for string', function () {
      should.deepEqual(form.getErrors('email'), ['email is required']);
      form.setState({email: 'hello'});
      should.deepEqual(form.getErrors('email'), ['Must be an email']);
    });
    it('should return a validation error for a custom validation with the right context', function () {
      form.setState({bar: 4, max: 10});
      should.deepEqual(form.getErrors('bar'), ['Must be greater than 10']);
      form.setState({bar: 11});
      should.deepEqual(form.getErrors('bar'), false);
    });
    it('should return true for valid values', function () {
      form.setState({email: 'kate@fff.com'});
      should.equal(form.getErrors('email'), false);
      should.equal(form.getErrors('name'), false);
    });

    it('should warn to use validations instead of type in schema', function () {
      var warn = console.warn;
      var didWarn;
      console.warn = function () {
        didWarn = true;
      };

      form.getErrors('fizz');
      should.equal(didWarn, true);

      console.warn = warn;
    });
    it('should use custom validation errors', function () {
      form.setState({apples: 4});
      should.deepEqual(form.getErrors('apples'), ['Must be 10 apples']);
    });
    it('should use custom validation errors with the right context', function () {
      form.setState({oranges: 'fooo'});
      should.deepEqual(form.getErrors('oranges'), ['Orange']);
    });
  });

});
