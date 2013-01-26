define(function(require) {

    Base = function() {};

    // basic inheritence
    var makeExtender = function(Parent)
    {
        return function(Child)
        {
            Child = Child || Parent;

            // setup proto chain
            var ctor = function() {};
            ctor.prototype = Parent.prototype;
            Child.prototype = new ctor();
            Child.prototype.constructor = Child;

            // propagate extender
            Child.extend = makeExtender(Child);
            return Child;
        };
    };

    Base.extend = makeExtender(Base);
    return Base;
});
