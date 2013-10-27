define(['person_templates', 'jquery', 'thorax'], function(templates) {
	var person = new Thorax.Model({
		name: 'Mikhail',
		age: '25',
		location: 'Atlanta'
	});

	var childView = new Thorax.View({
		name:'childview',
		model: person,
		events: {
			'click #location': function(){
				this.model.set('location', 'Severodovinsk');
			}
		},
		template: templates.personDetails
	});

	var anotherChildView = new Thorax.View({
		name: 'anotherChildView',
		template: templates.personAddress
	});

	var parentView = new Thorax.View({
		model: person,
		child: childView,
		anotherChild: anotherChildView,
		events: {
			'click #name': function(){
				this.model.set('name', 'Max');
				this.model.set('age', Math.floor(Math.random()*25+25));
			}
		},
		template: templates.personView
	});

	parentView.on('render', function(){
		console.log('Rendered');
	});

	parentView.appendTo('body');
});
