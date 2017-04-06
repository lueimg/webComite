var Controller = function () {
    var vm = this;
    vm.selectContent = (content, event, el) => {
        vm.onClick({content: content});
        angular.element('.content-click').removeClass('active');
        angular.element('.content-click[data-id='+ content.ID +']').addClass('active');
        // console.log(content);
    };
}

angular.module('doc.features').component('contentsLinkComponent', {
  template: require('./content-link.component.html'),
  controller: [ Controller],
  bindings: {
      contents: "<",
      onClick: "&"
      
  }
});