'use strict';

/* Controllers */

function IndexCtrl($scope, $http,socket ) {
  // socket.on('send:time', function (data) {
  //   $scope.time = data.time;
  // });
  
  // socket.on('send:name', function (data) {
  //   $scope.name = data.name;
  // });

  socket.on('send:post', function (data) {
    console.log("Angular post is: " + JSON.stringify(data.post));
    $scope.posts.push(data.post);
  });

  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });

}

function AddPostCtrl($scope, $http, $location, socket) {
  $scope.form = {};
  $scope.submitPost = function () {
    socket.emit('send:post', {
      post: $scope.form
    });
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
