
$(document).ready(function() {

  var rect;
  var view;
  var group;

  module("Backbone.KonvaView", {

    setup: function() {
      view = new Backbone.KonvaView({
        id        : 'test-view',
        other     : 'non-special-option'
      });
    }

  });

  test("constructor", 2, function() {
    equal(view.el.id(), 'test-view');
    equal(view.el.other, void 0);
  });

  test("el", 2, function() {
    var view = new Backbone.KonvaView();
    strictEqual(view.el.nodeType, "Group");

    ok(view.el instanceof Konva.Group);
  });

  test("initialize", 1, function() {
    var View = Backbone.KonvaView.extend({
      initialize: function() {
        this.one = 1;
      }
    });

    strictEqual(new View().one, 1);
  });

  test("delegateEvents", 3, function() {
    var group = new Konva.Group();
    var rect = new Konva.Rect({
      id : "test"
    });
    group.add(rect);
    var view = new Backbone.KonvaView({
      el : group
    });
    var counter1 = 0;

    view.increment = function() {
        counter1++;
    };
    var events = {
        'foo #test': 'increment'
    };
    view.delegateEvents(events);

    view.el.find('#test')[0].fire('foo');
    equal(counter1, 1);

    view.el.find('#test')[0].fire('foo');
    equal(counter1, 2);

    view.delegateEvents(events);
    view.el.find('#test')[0].fire('foo');
    equal(counter1, 3);
  });

   test("delegateEvents2", 3, function() {
    var group = new Konva.Group();
    var rect = new Konva.Rect({
      id : "test"
    });
    group.add(rect);
    var view = new Backbone.KonvaView({
      el : group
    });
    var counter1 = 0;

    view.increment = function() {
        counter1++;
    };
    var events = {
        'click': 'increment'
    };
    view.delegateEvents(events);

    view.el.findOne('#test')._fireAndBubble('click', {});
    equal(counter1, 1);

    view.el.findOne('#test')._fireAndBubble('click', {});
    equal(counter1, 2);

    view.delegateEvents(events);
    view.el.findOne('#test')._fireAndBubble('click', {});
    equal(counter1, 3);
  });

  test("delegate", 2, function() {
    var group = new Konva.Group();
    var rect = new Konva.Rect();
    group.add(rect);
    var view = new Backbone.KonvaView({
      el : group
    });
    view.delegate('click', 'Rect', function() {
      ok(true);
    });
    view.delegate('click', function() {
      ok(true);
    });
    view.el.find('Rect')[0]._fireAndBubble('click', {});
  });

  test("delegateEvents allows functions for callbacks", 3, function() {
    var view = new Backbone.KonvaView();
    view.counter = 0;

    var events = {
      click: function() {
        this.counter++;
      }
    };

    view.delegateEvents(events);
    view.el.fire('click');
    equal(view.counter, 1);

    view.el.fire('click');
    equal(view.counter, 2);

    view.delegateEvents(events);
    view.el.fire('click');
    equal(view.counter, 3);
  });


  test("delegateEvents ignore undefined methods", 0, function() {
    var view = new Backbone.KonvaView();
    view.delegateEvents({'click': 'undefinedMethod'});
    view.el.fire('click');
  });

  test("undelegateEvents", 6, function() {
    var group = new Konva.Group();
    var rect = new Konva.Rect({
      name : "test"
    });
    group.add(rect);
    var view = new Backbone.KonvaView({el: group});

    var counter1 = 0, counter2 = 0;
    view.increment = function(){ counter1++; };
    view.el.on('click', function(){
      counter2++;
    });

    var events = {'click .test': 'increment'};

    view.delegateEvents(events);
    rect._fireAndBubble('click', {});
    equal(counter1, 1);
    equal(counter2, 1);

    view.undelegateEvents();
    rect._fireAndBubble('click', {});
    equal(counter1, 1);
    equal(counter2, 2);

    view.delegateEvents(events);
    rect._fireAndBubble('click', {});
    equal(counter1, 2);
    equal(counter2, 3);
  });

  test("undelegate", 0, function() {
    var group = new Konva.Group();
    var rect = new Konva.Rect({
      name : "test"
    });
    group.add(rect);
    view = new Backbone.KonvaView({el: group});
    view.delegate('click', function() { ok(false); });

    view.undelegate('click');

    view.el._fireAndBubble('click', {});
  });

  test("undelegate with selector", 2, function() {
    var group = new Konva.Group();
    var rect = new Konva.Rect({
      name : "test"
    });
    group.add(rect);
    view = new Backbone.KonvaView({el: group});

    view.delegate('click', function() {
      ok(true); });
    view.delegate('click', 'Rect', function() {
      ok(false);
    });

    view.undelegate('click', 'Rect');
    view.el.find("Rect")[0]._fireAndBubble('click', {});
    view.el._fireAndBubble('click', {});
  });

  test("undelegate with handler and selector", 2, function() {
   var group = new Konva.Group();
    var rect = new Konva.Rect({
      name : "test"
    });
    group.add(rect);
    view = new Backbone.KonvaView({el: group});
    view.delegate('click', function() {ok(true); });
    var handler = function(){ ok(false); };
    view.delegate('click', 'Rect', handler);
    view.undelegate('click', 'Rect', handler);
    view.el.find('Rect')[0]._fireAndBubble('click', {});
    view.el._fireAndBubble('click', {});
  });

  test("with nodeType and id functions", 2, function() {
    var View = Backbone.KonvaView.extend({
      nodeType: function() {
        return 'Rect';
      },
      id: function() {
        return 'id';
      }
    });
    ok(new View().el instanceof Konva.Rect);

    strictEqual(new View().el.id(), 'id');
  });

  test("with attributes", 2, function() {
    var View = Backbone.KonvaView.extend({
      attributes: {
        id: 'id',
      },
      nodeType : 'Circle'
    });
    ok(new View().el instanceof Konva.Circle);
    strictEqual(new View().el.id(), 'id');
  });

  test("with attributes as a function", 1, function() {
    var View = Backbone.KonvaView.extend({
      attributes: function() {
        return {'id': 'id'};
      }
    });

    strictEqual(new View().el.id(), 'id');
  });


  test("multiple views per element", 3, function() {
    var count = 0;

    var group = new Konva.Group();
    var View = Backbone.KonvaView.extend({
      el: group,
      events: {
        click: function() {
          count++;
        }
      }
    });

    var view1 = new View();
    group.fire("click");
    equal(1, count);

    var view2 = new View();
    group.fire("click");
    equal(3, count);

    view1.delegateEvents();
    group.fire("click");
    equal(5, count);
  });

  test("custom events", 2, function() {
    var View = Backbone.KonvaView.extend({
      events: {
        "fake$event": function() { ok(true); }
      }
    });

    var view = new View;
    view.el.fire('fake$event');
    view.el.fire('fake$event');

    view.el.off('fake$event');
    view.el.fire('fake$event');
  });

  test("setElement uses provided object.", 2, function() {
    var el = new Konva.Group();

    var view = new Backbone.KonvaView();
    ok(view.el !== el);

    view.setElement(el);
    ok(view.el === el);
  });

  test("Undelegate before changing element.", 1, function() {
    var button1 = new Konva.Group();
    var button2 = new Konva.Group();

    var View = Backbone.KonvaView.extend({
      events: {
        click: function(e) {
          ok(view.el === button2);
        }
      }
    });

    var view = new View({el: button1});
    view.setElement(button2);

    button1.fire('click');
    button2.fire('click');
  });

  test("views stopListening", 0, function() {
    var View = Backbone.KonvaView.extend({
      initialize: function() {
        this.listenTo(this.model, 'all x', function(){ ok(false); });
        this.listenTo(this.collection, 'all x', function(){ ok(false); });
      }
    });

    var view = new View({
      model: new Backbone.Model,
      collection: new Backbone.Collection
    });

    view.stopListening();
    view.model.trigger('x');
    view.collection.trigger('x');
  });

  test("Provide function for el.", 1, function() {
    var View = Backbone.KonvaView.extend({
      el: function() {
        return new Konva.Circle();
      }
    });

    var view = new View;
    ok(view.el instanceof Konva.Circle);
  });

  test("events passed in options", 1, function() {
    var counter = 0;

    var View = Backbone.KonvaView.extend({
      el: new Konva.Group().add(new Konva.Rect),
      increment: function() {
        counter++;
      }
    });

    var view = new View({
      events: {
        'click Rect': 'increment'
      }
    });

    view.el.find('Rect').fire('click');
    view.el.find('Rect').fire('click');
    equal(counter, 2);
  });

  test("remove", 1, function() {
    var parent = new Konva.Group();
    var view = new Backbone.KonvaView;
    parent.add(view.el);

    view.delegate('click', function() { ok(false); });
    view.listenTo(view, 'all x', function() { ok(false); });

    view.remove();
    view.el.fire('click');
    view.trigger('x');

    // In IE8 and below, parentNode still exists but is not document.body.
    notEqual(view.el.parent, parent);
  });

});
