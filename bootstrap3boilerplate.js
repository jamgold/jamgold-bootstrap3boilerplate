//
// navbar-default navbar-inverse navbar-fixed-top navbar-static-top
//
Bootstrap3boilerplate = {
	ProjectName: new ReactiveVar({text:'Project Name',href:'#'}),
	fluid: new ReactiveVar(false),
	notFound: undefined,
	__content: new ReactiveVar('hello'),
	__alert: new ReactiveVar([]),
	layout: 'Bootstrap3boilerplatePlain',
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
		content: new ReactiveVar( Meteor.release ),
		classes(){
			return this.show.get() ? 'footer-shown':''
		}
	},
	Modal: {
		template: null,
		id: 'Bootstrap3boilerplateModal',
		title: new ReactiveVar( 'Modal Header' ),
		body: new ReactiveVar( 'Modal Body' ),
		large: new ReactiveVar(false),
		effect: new ReactiveVar( 'fade' ),
		dynamicTemplate: new ReactiveVar(),
		formId: new ReactiveVar(),
		show: function(){
			Bootstrap3boilerplate.Modal.template.$('#'+this.id).modal();
		},
		hide: function(){
			Bootstrap3boilerplate.Modal.template.$('#'+this.id).modal('hide');
		},
		save: {
			classes: 'btn-default',
			text: 'Save Changes',
			action: null
		}
	},
	__events: {
		'click button.close': function (e,t) {
			var alertid = t.$(e.target).attr('alertid');
			Bootstrap3boilerplate.removeAlert(alertid);
		}
	},
	alert: function(type, text, dismiss) {
		var alertid = Meteor.uuid();
		type = _.indexOf(Bootstrap3boilerplate._alertTypes, type)>=0 ? type : 'info';
		dismiss = dismiss === undefined ? false : dismiss === true;
		var alerts = Bootstrap3boilerplate.__alert.get();
		if(alerts === undefined) alerts = [];
		alerts.push({
			type: type,
			text: text,
			dismiss: dismiss,
			alertid: alertid
		});
		Bootstrap3boilerplate.__alert.set(alerts);
		return alertid;
	},
	removeAlert: function(alertid) {
		var newalerts = [];
		if(_.indexOf(['all','clear'],alertid) <0)
		{
			var alerts = Bootstrap3boilerplate.__alert.get();
			if(alerts === undefined) alerts = [];
			_.each(alerts,function(alert){
				if(alert.alertid != alertid)
					newalerts.push(alert);
			});
		}
		Bootstrap3boilerplate.__alert.set(newalerts);
	},
	//
	// function used for Template.dynamic
	//
	content: function() {
		var t = Bootstrap3boilerplate.__content.get();
		return Template[t] == undefined ? Bootstrap3boilerplate.notFound : t;
	},
	setContent: function(linkhash) {
		var t = linkhash.split('#')[1];
		if(t) Bootstrap3boilerplate.__content.set(t);
		else Bootstrap3boilerplate.__content.set('hello');
	},
	setTemplate: function(linkhash) {
		console.error('Bootstrap3boilerplate.setTemplate is depcrecated, please use setContent instead');
		this.setContent(linkhash);
	},
	_alertTypes: ['success', 'info', 'warning', 'danger'],
	__router: false,
	// have an init function to setup a Tracker for the body class
	init: function(customEvents){
		if(this.notFound === undefined) this.notFound = 'Bootstrap3boilerplateNotFound';
		if(Package['iron:router'] !== undefined) {
			this.__router = 'iron:router';
			this.layout = 'Bootstrap3boilerplateIronRouter';
			Router.configure({
			  layoutTemplate: 'Bootstrap3boilerplate',
			});
			Router.plugin('dataNotFound', {notFoundTemplate: this.notFound});
			Template.Bootstrap3boilerplateIronRouter.events( Bootstrap3boilerplate.__events);
		}
		if(Package['kadira:flow-router'] !== undefined) {
			var self = this;
			self.__router = 'kadira:flow-router';
			self.layout = 'Bootstrap3boilerplateFlowRouter';
			FlowRouter.notFound = {
			    // Subscriptions registered here don't have Fast Render support.
			    action: function() {
			      BlazeLayout.render(self.layout, {
			        content: self.notFound
			      });
			    }
			};
			Template.Bootstrap3boilerplateFlowRouter.events( Bootstrap3boilerplate.__events);
		}
		if(Package['ostrio:flow-router-extra'] !== undefined) {
			var self = this;
			self.__router = 'ostrio:flow-router-extra';
			self.layout = 'Bootstrap3boilerplateFlowRouter';
			import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
			window.FlowRouter = FlowRouter;
			FlowRouter.route('*', {
			  title: '404: Page not found',
			  action(params, queryParams) {
			    // console.log(Meteor.isServer, params[0], queryParams);
			    this.render(self.layout, self.notFound, {
			    	queryParams: queryParams,
			    	url: params[0],
			    });
			  },  
			});
			Template.Bootstrap3boilerplateFlowRouter.events( Bootstrap3boilerplate.__events);
		}

		if(!this.__router)
		{
			this.setContent(document.location.hash);
		}
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

Template.Bootstrap3boilerplateModal.onRendered( function () {
	Bootstrap3boilerplate.Modal.template = this;
	if(Bootstrap3boilerplate.Modal.rendered !== undefined)
		Bootstrap3boilerplate.Modal.rendered();
});
Template.Bootstrap3boilerplateModal.helpers({
	modal: function() {
		return Bootstrap3boilerplate.Modal;
	}
});
Template.Bootstrap3boilerplateModal.events({
	"click button.save": function(e,t) {
		// $('#' + Bootstrap3boilerplate.Modal.formId.get()).submit();
		if(Bootstrap3boilerplate.Modal.save.action)
		{
			console.log('triggering save action');
			Bootstrap3boilerplate.Modal.save.action();
		}
	}
});

Template.Bootstrap3boilerplateNavbar.onRendered( function() {
	Bootstrap3boilerplate.Navbar.template = this;
	if(Bootstrap3boilerplate.Navbar.rendered != undefined)
		Bootstrap3boilerplate.Navbar.rendered();
});
Template.Bootstrap3boilerplateNavbar.helpers({
	// return type of navbar
	// layout: function() {
	// 	return Bootstrap3boilerplate.layout;
	// },
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

Template.registerHelper('Bootstrap3boilerplate', function(){
	return {
		fluid: function () {
			return Bootstrap3boilerplate.fluid.get() ? 'container-fluid' : 'container';
		},
		content: function() {
			return Bootstrap3boilerplate.content();
		},
		alert: function() {
			return Bootstrap3boilerplate.__alert.get();
		},
		footer: function() {
			return Bootstrap3boilerplate.Footer;
		},
		iron_router() {
			return Bootstrap3boilerplate.__router == 'iron:router';
		},
		layout: function() {
			return Bootstrap3boilerplate.layout;
		},
	};
});
Template.Bootstrap3boilerplate.onRendered(function(){
	Bootstrap3boilerplate.template = this;
	// console.log(`${this.view.name}.onRendered`);
	if(Bootstrap3boilerplate.rendered !== undefined)
		Bootstrap3boilerplate.rendered();
});
Template.Bootstrap3boilerplate.events( Bootstrap3boilerplate.__events);

// Template._bootstrap3boilerplateNavbar_link.onRendered(function(){
// 	console.log(`${this.view.name}.onRendered`,this.data);
// });
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
			switch(Bootstrap3boilerplate.__router)
			{
				case 'iron:router':
					try {
						var c = Router.current();
						if(c)
							r = c.location.get().path == href ? 'active' : ' ';
						else
							r = href == '/' ? 'active' : ' ';
					} catch(e) {
						console.log(e);
					}
				break;

				case 'kadira:flow-router':
				case 'ostrio:flow-router-extra':
					try {
						FlowRouter.watchPathChange();

						var c = FlowRouter.current();
						if(c)
							r = c.path == href ? 'active' : ' ';
						else
							r = href == '/' ? 'active' : ' ';

					} catch(e) {
						console.log(e);
					}
				break;

				default:
					var t = Bootstrap3boilerplate.__content.get();
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
		var p = 'undefined';
		switch(Bootstrap3boilerplate.__router) {
			case 'iron:router':
				var c = Router.current();
				if(c)
					p = c.location.get().path;
				break;

			case 'kadira:flow-router':
			case 'ostrio:flow-router-extra':
				try {
					FlowRouter.watchPathChange();

					var c = FlowRouter.current();
					if(c)
						p = c.path;
				} catch(e) {
					console.log(e);
				}
				break;

			default: p = document.location.hash;
		}
		return p;
	}
});

Template.Bootstrap3boilerplateDevelopment.helpers({
	isDevelopment: function () {
		return Meteor.isDevelopment;
	}
});
