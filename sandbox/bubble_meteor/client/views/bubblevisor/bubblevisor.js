Template.bubblevisor.rendered = function(){
	$("#bubbles").hide();
	$("#users").hide();

	

	  var Renderer = function(canvas){
	    var canvas = $(canvas).get(0)
	    var ctx = canvas.getContext("2d");
	    var particleSystem

	    var that = {
	      init:function(system){
	        //
	        // the particle system will call the init function once, right before the
	        // first frame is to be drawn. it's a good place to set up the canvas and
	        // to pass the canvas size to the particle system
	        //
	        // save a reference to the particle system for use in the .redraw() loop
	        particleSystem = system

	        // inform the system of the screen dimensions so it can map coords for us.
	        // if the canvas is ever resized, screenSize should be called again with
	        // the new dimensions
	        particleSystem.screenSize(canvas.width, canvas.height) 
	        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side
	        
	        // set up some event handlers to allow for node-dragging
	        that.initMouseHandling()
	      },
	      
	      redraw:function(){
	        // 
	        // redraw will be called repeatedly during the run whenever the node positions
	        // change. the new positions for the nodes can be accessed by looking at the
	        // .p attribute of a given node. however the p.x & p.y values are in the coordinates
	        // of the particle system rather than the screen. you can either map them to
	        // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
	        // which allow you to step through the actual node objects but also pass an
	        // x,y point in the screen's coordinate system
	        // 
	        ctx.fillStyle = "white";
	        ctx.fillRect(0,0, canvas.width, canvas.height);
	        
	        particleSystem.eachEdge(function(edge, pt1, pt2){
	          // edge: {source:Node, target:Node, length:#, data:{}}
	          // pt1:  {x:#, y:#}  source position in screen coords
	          // pt2:  {x:#, y:#}  target position in screen coords

	          // draw a line from pt1 to pt2
	          //console.log('Edge: ', edge);
	          if(edge.data.type == 'member'){
		          ctx.strokeStyle = "rgba(0,0,0, .333)";
		      }
		      else if(edge.data.type == 'admin'){
		      	//console.log('Admin edge');
		      	ctx.strokeStyle = "rgba(255,0,0, .333)";
		      }
		      else if(edge.data.type == 'applicant'){
		      	ctx.strokeStyle = "rgba(0,255,0, .333)";
		      	//ctx.setLineDash([5,5,2,2]);
		      }
		      else if(edge.data.type == 'invitee'){
		      	ctx.strokeStyle = "rgba(0,0,255, .333)";
		      	//ctx.setLineDash([1, 0]);
		      };

	          ctx.lineWidth = 1;
	          ctx.beginPath();
	          ctx.moveTo(pt1.x, pt1.y);
	          ctx.lineTo(pt2.x, pt2.y);
	          ctx.stroke();
	        });

	        particleSystem.eachNode(function(node, pt){
	          // node: {mass:#, p:{x,y}, name:"", data:{}}
	          // pt:   {x:#, y:#}  node position in screen coords

	          // draw a rectangle centered at pt
	          //console.log(node);
	          var radius = 10;
	          if(node.data.type == 'bubble'){
	          	//console.log('Bubble node');
	          	ctx.fillStyle = 'blue';
				ctx.beginPath();
				ctx.arc(pt.x, pt.y, radius, 0, 2*Math.PI, false);
				ctx.fill();
				ctx.lineWidth= 1;
				ctx.strokeStyle = '#000000';
				ctx.stroke();	          	

	          }
	          else if (node.data.type == 'user'){
		          //console.log('User node');
		          ctx.fillStyle = 'green';
		          var w = 10;
		          ctx.fillRect(pt.x-w/2, pt.y-w/2, w,w);
	          }

				

				ctx.font = "10px Arial";
				ctx.fillStyle = 'black';
				ctx.fillText(node.name, pt.x + radius + 5, pt.y);

	        })    			
	      },
	      
	      initMouseHandling:function(){
	        // no-nonsense drag and drop (thanks springy.js)
	        var dragged = null;

	        // set up a handler object that will initially listen for mousedowns then
	        // for moves and mouseups while dragging
	        var handler = {
	          clicked:function(e){
	            var pos = $(canvas).offset();
	            _mouseP = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)
	            dragged = particleSystem.nearest(_mouseP);

	            if (dragged && dragged.node !== null){
	              // while we're dragging, don't let physics move the node
	              dragged.node.fixed = true
	            }

	            $(canvas).bind('mousemove', handler.dragged)
	            $(window).bind('mouseup', handler.dropped)

	            return false
	          },
	          dragged:function(e){
	            var pos = $(canvas).offset();
	            var s = arbor.Point(e.pageX-pos.left, e.pageY-pos.top)

	            if (dragged && dragged.node !== null){
	              var p = particleSystem.fromScreen(s)
	              dragged.node.p = p
	            }

	            return false
	          },

	          dropped:function(e){
	            if (dragged===null || dragged.node===undefined) return
	            if (dragged.node !== null) dragged.node.fixed = false
	            dragged.node.tempMass = 1000
	            dragged = null
	            $(canvas).unbind('mousemove', handler.dragged)
	            $(window).unbind('mouseup', handler.dropped)
	            _mouseP = null
	            return false
	          }
	        }
	        
	        // start listening
	        $(canvas).mousedown(handler.clicked);

	      },
	      
	    }
	    return that
	  };    

	  $(document).ready(function(){
	    var sys = arbor.ParticleSystem(1000, 600, 0.5) // create the system with sensible repulsion/stiffness/friction
	    sys.parameters({gravity:true}) // use center-gravity to make the graph settle nicely (ymmv)
	    sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...

		var bubbleresults = Template.bubblevisor.bubbles();
		//console.log("Bubblevisor ", bubbleresults);
		var bubbleedges = [];
		var nodes = [];
	    for(var i=0; i < bubbleresults.length; i++){
	    	console.log(i);
			var a = bubbleresults[i].title;
			//nodes.push({name: a, type: 'bubble'});
			sys.addNode(a, {type: 'bubble'});
			//console.log('A: ', a);
			for(var j=0; j < bubbleresults[i].users.members.length; j++){
				var memberId = bubbleresults[i].users.members[j];
				//console.log('Member: ', memberId);
				var member = Meteor.users.findOne({_id: memberId});
				var b = member.username;
				//nodes.push({name: b, type: 'user'});
				//console.log('B: ', b);
				//bubbleedges.push({'a': a, 'b':b, type: 'member'});
				//sys.addEdge(a, b);
				sys.addNode(b, {type: 'user'});
				//console.log('Adding edge: ', a,b);
				sys.addEdge(a, b, {type: 'member'});

			};
			for(var j=0; j < bubbleresults[i].users.admins.length; j++){
				var adminId = bubbleresults[i].users.admins[j];
				//console.log('Admin: ', adminId);
				var admin = Meteor.users.findOne({_id: adminId});
				var b = admin.username;
				//console.log('Admin username: ', b);
				//nodes.push({name: b, type: 'users'});
				//bubbleedges.push({'a': a, 'b':b, type: 'admin'});
				sys.addNode(b, {type: 'user'});
				//console.log('Adding edge: ', a,b);
				sys.addEdge(a, b, {type: 'admin'});
			};
			for(var j=0; j < bubbleresults[i].users.applicants.length; j++){
				var applicantId = bubbleresults[i].users.applicants[j];
				var applicant = Meteor.users.findOne({_id: applicantId});
				var b = applicant.username;
				//nodes.push({name: b, type: 'users'});
				//bubbleedges.push({'a': a, 'b':b, type: 'applicant'});
				//sys.addEdge(a, b);
				sys.addNode(b, {type: 'user'});
				//console.log('Adding edge: ', a,b);
				sys.addEdge(a, b, {type: 'applicant'});
			};
			for(var j=0; j < bubbleresults[i].users.invitees.length; j++){
				var inviteeId = bubbleresults[i].users.invitees[j];
				invitee = Meteor.users.findOne({_id: inviteeId});
				var b = invitee.username;
				//nodes.push({name: b, type: 'users'});
				//bubbleedges.push({'a': a, 'b':b, type: 'invitee'});
				//sys.addEdge(a, b);
				//console.log('Adding edge: ', a,b);
				sys.addNode(b, {type: 'user'});
				sys.addEdge(a, b, {type: 'invitee'});
			};
		};
	    
	  });

};


Template.bubblevisor.bubbles = function(){
	return Bubbles.find().fetch();
};


Template.bubblevisor.users = function(){
	return Meteor.users.find().fetch();
}