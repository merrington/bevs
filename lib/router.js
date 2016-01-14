// General router configuration
Router.configure({
	layoutTemplate: "mainLayout",
	loadingTemplate: 'loading'
});

Iron.Router.hooks.loggedInHook = function() {
	if (!Meteor.userId()) {
		Router.go('root');
	} else {
		this.next();
	}
}

Router.onBeforeAction('loggedInHook', {
	except: ['root']
});

// Routes
Router.route('/', {
	name: 'root',
	template: 'prelaunch',
	action: function() {
		if (Meteor.userId()) {
			this.redirect('index');
		}
	}
});

Router.route('index', {
	template: 'index',
	subscriptions: function() {
		this.subscribe('groups');
	},
	data: function() {
		return {
			groups: Groups.find({}, {sort: {name: 1}}).fetch()
		}
	}
});

Router.route('/groups/:_id', {
	name: 'groups.show',
	template: 'group',
	subscriptions: function() {
		this.subscribe('groups', this.params._id);
		this.subscribe("userData", this.params._id);
	},
	data: function() {
		return Groups.findOne();
	}
});
