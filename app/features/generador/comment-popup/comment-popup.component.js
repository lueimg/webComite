var Controller = function (CommentSvc) {
    var vm = this;
    vm.list = [];
    vm.comment = {
        user: '',
        comment: ''
    };

    vm.isViewMode = false;;
    
    vm.$onInit = () => {
         vm.getCommentList();
          angular.element(`#comment-popup-form`).modal();
    };
    vm.$onChanges = (data) => {
        vm.getCommentList();
        angular.element(`#comment-popup-form`).modal();
        console.log("key", vm.key);
    }

    vm.showCommentForm = function () {
        vm.comment =  {
            user: '',
            comment: ''
        };
        
        angular.element(`#comment-popup-form`).modal();
    };

    vm.saveComment = () => {
        if (!vm.comment.user) return false;
        if (!vm.comment.comment) return false;
        
        vm.comment.key = vm.key;
        if (vm.comment.id) {
            CommentSvc.update(vm.comment, (reponse) => {
                vm.comment = { user: '', comment: '' };
                vm.getCommentList();
            });
        } else {
            CommentSvc.save(vm.comment, (response ) => {
                vm.comment = { user: '', comment: '' };
                vm.getCommentList();
            });
        }
        
    }

    vm.deleteComment = () => {
        if (vm.comment.id) {
            CommentSvc.delete(vm.comment, (reponse) => {
                vm.comment = { user: '', comment: '' };
                vm.getCommentList();
            });
        }
    }

    vm.editComment = (comment) => {
        vm.comment.id = comment.ID;
        vm.comment.user = comment.USUARIO;
        vm.comment.comment = comment.COMENTARIO;
        // console.log(vm.comment);
        angular.element(`#comment-popup-form`).modal();
    }
    vm.getCommentList = () => {
        if (!vm.key) return false;
        
        CommentSvc.query({key: vm.key}, (response) => {
            vm.list = response.results.list;
        });
    }
}

angular.module('doc.features').component('commentPopupComponent', {
  template: require('./comment-popup.component.html'),
  controller: ['CommentSvc', Controller],
  bindings: {
      key: "<",
      title: "@"
  }
});