'use strict';

/* Controllers */

function IndexCtrl($scope, $http,socket ) {
  socket.on('send:time', function (data) {
    $scope.time = data.time;
  });
  socket.on('send:name', function (data) {
    $scope.name = data.name;
  });
  
 //  $scope.sendMessage = function () {
	//     socket.emit('send:message', {
	//         message: $scope.message
	//     });

	//     // add the message to our model locally
	//     $scope.messages.push({
	//         user: $scope.name,
	//         text: $scope.message
	//     });

	//     // clear message box
	//     $scope.message = '';
	// };
    
  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http, $location) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        $location.path('/');
      });
  };
}

function ReadPostCtrl($scope, $http, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });
}

function EditPostCtrl($scope, $http, $location, $routeParams) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.post = data.post;
    });

  $scope.deletePost = function () {
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

// function AppCtrl($scope, socket) {
//   socket.on('send:name', function (data) {
//     $scope.name = data.name;
//   });
// }

// function MyCtrl1($scope, socket) {
//   socket.on('send:time', function (data) {
//     $scope.time = data.time;
//   });
// }
// MyCtrl1.$inject = ['$scope', 'socket'];


// function MyCtrl2() {
// }
// MyCtrl2.$inject = [];
