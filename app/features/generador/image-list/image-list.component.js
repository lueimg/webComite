var Controller = function (CommentSvc, Upload, $timeout, Lightbox) {
    var vm = this;
    vm.apiPath = '/STAGE/Comite/phpserverv1/uploads/index.php';
    
    vm.imageList = [];
    vm.title = '';
    
    vm.$onInit = () => {
        vm.getImagesList();
        // console.log("image list ", vm.key);
        let [year, week]= vm.key.split("-");
        vm.title = `Semana ${year} - ${week}`;
    };
    vm.$onChanges = (data) => {
        vm.getImagesList();
        // console.log("image list ", vm.key);
        let [year, week]= vm.key.split("-");
        vm.title = `Semana ${year} - ${week}`;
    }

    vm.getImagesList = () => {
        CommentSvc.getFilesByKey({key: vm.key}, (response) => {
            console.log(response);
           vm.imageList = response.results.list;
        })
    }

    vm.openLightboxModal = function (index) {
        Lightbox.openModal(vm.imageList, index, {
            backdropClass: 'lightbox-modal-backdrop',
            windowClass: 'lightbox-modal',
            windowTopClass: 'lightbox-modal-top'
        });
    };
    

    vm.uploadFiles = function(file, errFiles) {
            vm.f = file;
            vm.errFile = errFiles && errFiles[0];
            if (file) {
                file.upload = Upload.upload({
                    url: vm.apiPath,
                    data: {
                        file: file,
                        key: vm.key    
                    }
                });

                file.upload.then(function (response) {
                    vm.getImagesList();
                    $timeout(function () {
                        file.result = response.data;
                    });
                }, function (response) {
                  
                    if (response.status > 0)
                        vm.errorMsg = response.status + ': ' + response.data;
                }, function (evt) {
                    
                    file.progress = Math.min(100, parseInt(100.0 *
                    evt.loaded / evt.total));
                });
            }
        }

        vm.removeFile = (item) => {
            CommentSvc.removeFile({id: item.ID}, (response) => {
                vm.getImagesList();
            })
        }
        vm.temporaldata = {};
        vm.showEditFileDialog = (item) => {
            vm.temporaldata = item;
            angular.element('#confirm-dialog').modal();
        }
        vm.updateFile = ({ID, NAME}) => {
           
            CommentSvc.updateFile({ name: NAME, id: ID }, (response) => {
                vm.getImagesList();
            })
        }

    
}

angular.module('doc.features').component('imageListComponent', {
  template: require('./image-list.component.html'),
  controller: ['CommentSvc', 'Upload', '$timeout', 'Lightbox', Controller],
  bindings: {
      key: "<"
  }
});