sendEmail = function(userId,title,body){
  var user = Meteor.users.findOne(userId);

  if (user) {
	  Meteor.call( 'sendEmail',
	    user.emails[0].address,
	    title,
	    body
	  );
  }else{
    console.log("User is undefined for sending emails");
  }
}

categories =  [
        { name_long: 'student organization'       , name_short: 'club'    }
      , { name_long: 'athletics and recreation'   , name_short: 'sport'   }
      , { name_long: 'greek organization'         , name_short: 'greek'   }
      , { name_long: 'class'                      , name_short: 'class'   }
      , { name_long: 'academic department'        , name_short: 'major'   }
      , { name_long: 'administrative office'      , name_short: 'office'  }
      , { name_long: 'community resource/service' , name_short: 'service' }
      , { name_long: 'residence hall'             , name_short: 'dorm'    }
      , { name_long: 'arts and entertainment'     , name_short: 'art'     }
      , { name_long: 'custom'                     , name_short: 'custom'  }
    ]