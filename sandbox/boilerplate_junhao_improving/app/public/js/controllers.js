'use strict';

/* Controllers */

function IndexCtrl($scope, $http,socket ) {
  //Update list of post for Add
  socket.on('add:post', function (data) {
    $scope.posts.push(data.post);
  });

  //Update list of post for Edit
  socket.on('edit:post', function (data) {
    console.log([$scope.posts.indexOf(data.post)]);
    for (var i=0;i<$scope.posts.length;i++){
      if ($scope.posts[i]._id == data.post._id) {
        $scope.posts[i] = data.post;
      }
    }
  });

  //Update list of post for Delete
  socket.on('delete:post', function (data) {
    for (var i=0;i<$scope.posts.length;i++){
      if ($scope.posts[i]._id == data.post._id) {
        $scope.posts.splice(i,1);
      }
    }
  });

  $http.get('/api/posts').
    success(function(data, status, headers, config) {
      $scope.posts = data.posts;
    });
}

function AddPostCtrl($scope, $http, $location, socket) {
  $scope.form = {};
  $scope.submitPost = function () {
    $http.post('/api/post', $scope.form).
      success(function(data) {
        socket.emit('add:post', {
          post: data
        });
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

function EditPostCtrl($scope, $http, $location, $routeParams, socket) {
  $scope.form = {};
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.editPost = function () {
    socket.emit('edit:post', {
      post: $scope.form
    });
    $http.put('/api/post/' + $routeParams.id, $scope.form).
      success(function(data) {
        $location.url('/readPost/' + $routeParams.id);
      });
  };
}

function DeletePostCtrl($scope, $http, $location, $routeParams, socket) {
  $http.get('/api/post/' + $routeParams.id).
    success(function(data) {
      $scope.form = data.post;
    });

  $scope.deletePost = function () {
    socket.emit('delete:post', {
      post: $scope.form
    });
    $http.delete('/api/post/' + $routeParams.id).
      success(function(data) {
        $location.url('/');
      });
  };

  $scope.home = function () {
    $location.url('/');
  };
}

