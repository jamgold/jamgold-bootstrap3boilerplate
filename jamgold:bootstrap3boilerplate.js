//
// navbar-default navbar-inverse navbar-fixed-top navbar-static-top
//
Bootstrap3boilerplate = {
	ProjectName: new ReactiveVar({text:'Project Name',href:'#'}),
	fluid: new ReactiveVar(false),
	notFound: 'Bootstrap3boilerplateNotFound',
	Navbar: {
		template: null,
		type: new ReactiveVar('navbar-default'),
		inverse: new ReactiveVar(false),
		left: function() {
			return [
				{href:'#hello',text:'Home'},
				{href:'#about',text:'About'},
				{href:'#contact',text:'Contact'},
				{text:'Dropdown',dropdown:[
					{href:'#action1',text: 'Action'},
					{href:'#action2',text: 'Another Action'},
					{divider: true},
					{header: 'Some More'},
					{href:"#sep1", text: 'Separated link'},
					{href:"#sep2", text: 'One more separated link'}
				]}
			];
		},
		right: function() {
			return [
			{href:"#",text:'Default',classes: 'bootstrap3boilerplateNavbar_type navbar_default', active: Bootstrap3boilerplate.Navbar.type.get() == 'navbar-default'},
			{href:"#",text:'Static top', classes: 'bootstrap3boilerplateNavbar_type navbar_static_top', active: Bootstrap3boilerplate.Navbar.type.get() == 'navbar-static-top'},
			{href:"#",text:'Fixed top',classes: 'bootstrap3boilerplateNavbar_type navbar_fixed_top', active: Bootstrap3boilerplate.Navbar.type.get() == 'navbar-fixed-top'},
			]
		},
		events: function(events) {
			Template.Bootstrap3boilerplateNavbar.events( events );
		},
		defaultEvents: function() {
			Template.Bootstrap3boilerplateNavbar.events({
				'click a.bootstrap3boilerplateNavbar_type': function (e,t) {
					var c = t.$(e.target).attr('class').split(/ /)[1].replace(/_/g,'-');
					Bootstrap3boilerplate.Navbar.type.set(c);
				},
				'click .navbar-nav.left a, click a.navbar-brand': function(e,t) {
					if(e.currentTarget.className != 'dropdown-toggle')
						Bootstrap3boilerplate.setContent(e.target.href)
				}
			});
		},
	},
	Footer: {
		template: null,
		show: new ReactiveVar(true),
		content: new ReactiveVar( Meteor.release )
	},
	Modal: {
		template: null,
		id: 'Bootstrap3boilerplateModal',
		title: new ReactiveVar( 'Modal Header' ),
		body: new ReactiveVar( 'Modal Body' ),
		effect: new ReactiveVar( 'fade' ),
		dynamicTemplate: new ReactiveVar(),
		formId: new ReactiveVar(),
		show: function(){
			Bootstrap3boilerplate.Modal.template.$('#'+this.id).modal();

		},
		hide: function(){
			Bootstrap3boilerplate.Modal.template.$('#'+this.id).modal('hide');
		}
	},
	alert: function(type, text, dismiss) {
		type = _.indexOf(Bootstrap3boilerplate._alertTypes, type)>=0 ? type : 'info';
		dismiss = dismiss === undefined ? false : dismiss === true;
		var alerts = Session.get('Bootstrap3boilerplateAlert');
		if(alerts === undefined) alerts = [];
		alerts.push({
			type: type,
			text: text,
			dismiss: dismiss,
			alertid: Meteor.uuid()
		});
		Session.set('Bootstrap3boilerplateAlert',alerts);
	},
	removeAlert: function(alertid) {
		var newalerts = [];
		if(_.indexOf(['all','clear'],alertid) <0)
		{
			var alerts = Session.get('Bootstrap3boilerplateAlert');
			if(alerts === undefined) alerts = [];
			_.each(alerts,function(alert){
				if(alert.alertid != alertid)
					newalerts.push(alert);
			});
		}
		Session.set('Bootstrap3boilerplateAlert',newalerts);
	},
	//
	// function used for Template.dynamic
	//
	content: function() {
		var t = Session.get('Bootstrap3boilerplateContent');
		return Template[t] == undefined ? Bootstrap3boilerplate.notFound : t;
	},
	setContent: function(linkhash) {
		var t = linkhash.split('#')[1];
		if(t) Session.set('Bootstrap3boilerplateContent', t);
		else Session.set('Bootstrap3boilerplateContent','hello');
	},
	setTemplate: function(linkhash) {
		console.error('Bootstrap3boilerplate.setTemplate is depcrecated, please use setContent instead');
		this.setContent(linkhash);
	},
	_alertTypes: ['success', 'info', 'warning', 'danger'],
	_iron_router: false,
	// have an init function to setup a Tracker for the body class
	init: function(customEvents){
		Session.setDefault('Bootstrap3boilerplateAlert', []);
		this._iron_router = Package['iron:router'] !== undefined;
		if(!this._iron_router)
			this.setContent(document.location.hash);
		if(customEvents)
		{
			if(typeof customEvents == 'object')
			{
				this.Navbar.events( customEvents );
			}
		}
		else
		{
			this.Navbar.defaultEvents();
		}
		Tracker.autorun(function () {
			// update body class should Navbar Type change
			$('body').attr('class', 'body-'+Bootstrap3boilerplate.Navbar.type.get());
		});
		// console.info('Bootstrap3boilerplate.init');
	}
};

Template.Bootstrap3boilerplateModal.rendered = function () {
	Bootstrap3boilerplate.Modal.template = this;
	if(Bootstrap3boilerplate.Modal.rendered !== undefined)
		Bootstrap3boilerplate.Modal.rendered();
};

Template.Bootstrap3boilerplateModal.helpers({
	modal: function() {
		return Bootstrap3boilerplate.Modal;
	}
});
Template.Bootstrap3boilerplateModal.events({
	"click button.btn-primary": function() {
		$('#' + Bootstrap3boilerplate.Modal.formId.get()).submit();
	}
});


Template.Bootstrap3boilerplateNavbar.rendered = function() {
	Bootstrap3boilerplate.Navbar.template = this;
	if(Bootstrap3boilerplate.Navbar.rendered != undefined)
		Bootstrap3boilerplate.Navbar.rendered();
};

Template.Bootstrap3boilerplateNavbar.helpers({
	// return type of navbar
	type: function () {
		var t = Bootstrap3boilerplate.Navbar.type.get();
		return t == 'navbar-default' ? t : 'navbar-default '+t;
	},
	fluid: function () {
		return Bootstrap3boilerplate.fluid.get() ? 'container-fluid' : 'container';
	},
	inverse: function() {
		return Bootstrap3boilerplate.Navbar.inverse.get() ? 'navbar-inverse' : '';
	},
	normal: function() {
		Bootstrap3boilerplate.Navbar.type.get() == 'navbar-default';
	},
	project_name: function() {
		return Bootstrap3boilerplate.ProjectName.get();
	},
	left: function() {
		return Bootstrap3boilerplate.Navbar.left();
	},
	right: function() {
		return Bootstrap3boilerplate.Navbar.right();
	}
});

Template.Bootstrap3boilerplate.helpers({
	fluid: function () {
		return Bootstrap3boilerplate.fluid.get() ? 'container-fluid' : 'container';
	},
	iron_router: function() {
		return Bootstrap3boilerplate._iron_router;
	},
	content: function() {
		return Bootstrap3boilerplate.content();
	},
	alert: function() {
		return Session.get('Bootstrap3boilerplateAlert');
	},
	footer: function() {
		return Bootstrap3boilerplate.Footer;
	}
});

Template.Bootstrap3boilerplate.events({
	'click button.close': function (e,t) {
		var alertid = t.$(e.target).attr('alertid');
		Bootstrap3boilerplate.removeAlert(alertid);
	}
});
//
// set the right body class when the Boilerplate gets rendered
//
Template.Bootstrap3boilerplate.rendered = function () {
	Bootstrap3boilerplate.template = this;
	$('body').attr('class', 'body-'+Bootstrap3boilerplate.Navbar.type.get());
	if(Bootstrap3boilerplate.rendered !== undefined)
		Bootstrap3boilerplate.rendered();
};

Template._bootstrap3boilerplateNavbar_link.helpers({
	activeLink: function (href) {
		var linkobject = this;
		var r = ' ';
		if(linkobject.active !== undefined)
		{
			r = linkobject.active ? 'active' : ' ';
		}
		else
		{
			if(Bootstrap3boilerplate._iron_router)
			{
				try {
					var c = Router.current();
					if(c)
						r = c.location.get().path == href ? 'active' : ' ';
					else
						r = href == '/' ? 'active' : ' ';
				} catch(e) {
					console.log(e);
				}
			}
			else
			{
				var t = Session.get('template');
				r = href == document.location.hash ? 'active' : ' ';
			}
		}
		// console.log(href+' '+r);
		return r;
	},
	getTemplate: function() {
		// console.log(this);
		return this.template;
	}
});

Template.Bootstrap3boilerplateNotFound.helpers({
	notFound: function () {
		var t = Session.get('template');
		return document.location.hash;
	}
});

Template.Bootstrap3boilerplateDevelopment.helpers({
	isDevelopment: function () {
		return Meteor.isDevelopment;
	}
});
