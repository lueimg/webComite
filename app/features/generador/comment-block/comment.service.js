
angular
  .module('doc.features')
  .factory('CommentSvc', ['$resource','ServicesConfig', function ($resource, ServicesConfig) {
    var Comment = $resource(ServicesConfig.url + '/comments/index.php?key=:key', {key: '@key'},
      {
        query: {
          isArray: false
        },
        update: {
          method: 'PUT'
        },
        getFilesByKey: {
          isArray: false,
          method: 'GET',
          url: ServicesConfig.url + '/uploads/index.php?getFilesByKey=1'
        },
        removeFile: {
          isArray: false,
          method: 'GET',
          url: ServicesConfig.url + '/uploads/index.php?removeFile=1'
        },
        updateFile: {
          isArray: false,
          method: 'GET',
          url: ServicesConfig.url + '/uploads/index.php?updateFile=1'
        }
        
      });

    return Comment;
  }]);