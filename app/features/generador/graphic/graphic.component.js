var Controller = function ($scope) {
    var vm = this;
    vm.isLoading = true;
    vm.semanaImageList = ''
   
    vm.$onInit = () => {
      if (!vm.graphic) return false;
      vm.semanaImageList = vm.filtros.year  + '-'+ vm.filtros.week + '-'+ vm.graphic.id
      vm.xAxisData = [];
      vm.title = vm.graphic.title;
      vm.mainGrapicType = (vm.graphic.kpis[0].GRAPHIC_TYPE == 'pie')? 'pie' : 'line';

      // Data for graphic
      vm.chartConfig = {
        chart: {
          zoomType: 'x',
          type: vm.mainGrapicType,
          width: 800
        },
        title: {
          text: vm.graphic.title
        },
        plotOptions: {
          series: {
            stacking: '',
            cursor: 'pointer',
                events: {
                    click: function (event) {
                      switch(vm.mainGrapicType) {
                        case 'area':
                        case 'line': 
                          // console.log('points', this.points);
                          // console.log('useroptions', this.userOptions);
                          
                          var pointValue = _.filter(this.points, ["state", "hover"])[0].y; // 443262.13632
                          var yearWeek = _.filter(this.points, ["state", "hover"])[0].category; // "2016 - 43"
                          var elementName = `${this.userOptions.name}`; // "3G - AMR"      
                          var contentId = this.userOptions.id;
                          var title = `Semana: ${yearWeek}`;
                          var key =`${yearWeek}-${contentId}`; // 2017-09-11
                          //var key = `${this.userOptions.id}${_.filter(this.points, ["state", "hover"])[0].category.split(' - ').join('').trim()}`;
                          break;
                        case 'pie':
                        
                          var point = _.filter(this.points, ["state", "hover"])[0];
                          // console.log(point);
                          var title = `${point.name}: (${point.y}) `;
                          var key = `${point.id}${vm.rangeOfWeekYear}`;
                          break;

                      }
                      // console.log(title);
                      // console.log(key);
                      vm.onPointClick(key, title);
                      $scope.$apply()
                    }
                }
          }
        },
        series: [],
      };

      switch(vm.mainGrapicType) {
        case 'area':
        case 'line': 
        //  console.log("data", vm.data);
          vm.chartConfig.xAxis = {
            categories: _.uniq(_.map(vm.data, (item) => item.REFFECHA))
          };

          vm.chartConfig.yAxis = vm.graphic.kpis.map((kpi, index) => {
            // console.log('kpi', kpi);
            return {
              max: kpi.YMAX > 0 ?  +kpi.YMAX : undefined,
              min: kpi.YMIN > 0 ?  +kpi.YMIN : undefined,
              title: {
                text: kpi.TITLE
            },
            labels: {
                format: '{value} ' + kpi.SUFFIX ,
                style: {
                    color: Highcharts.getOptions().colors[index]
                }
            },
            opposite: kpi.OPPOSITE > 0
            }
          });

          // Series
          var elementos = [];
          var elementosData = {};

          // agrupar data
          vm.data.forEach((item) => {
            if(!elementosData[item.ELEMENTO]) elementosData[item.ELEMENTO] = []; 

            elementosData[item.ELEMENTO].push(item)  
          });

          

          // series IDS
          elementos = Object.keys(elementosData);


          // Completar Series con valores nulos
          var totalColumns = vm.chartConfig.xAxis.categories.length;
          var totalGroups = vm.graphic.kpis.length;


          vm.graphic.kpis.forEach((kpi) => {
            var campo = kpi.NAME_FROM_PROCEDURE;
            // Get series
            elementos.forEach((el) => {
              var data = elementosData[el].map((item) => item[kpi.NAME_FROM_PROCEDURE]*1);
              if (data.length != totalColumns) {
                // LLenar columnas
                data = [];
                vm.chartConfig.xAxis.categories.forEach((xAxis) => {
                  var value = elementosData[el].find(item => item.REFFECHA === xAxis);
                  if (value) {
                    data.push(+value[kpi.NAME_FROM_PROCEDURE]);
                  } else {
                    data.push(null);
                  }
                });
              }
              
              var serieName = (totalGroups > 1) ? `${el}-${kpi.TITLE}`: el;

              // Showing last value:
              
              let last_value = data[data.length - 1];
              data.pop();
              data.push({y:last_value,dataLabels:{enabled:true}})
              
              vm.chartConfig.series.push({
                name: serieName,
                unidad: kpi.TITLE,
                suffix: kpi.SUFFIX,
                id: kpi.ID,
                type: kpi.GRAPHIC_TYPE,
                yAxis: (+kpi.YAXIS_GROUP -1),
                tooltip: {
                    valueSuffix: ' ' + kpi.SUFFIX
                },
                data: data
              });
            });
          });

          //let xAxisPoints = vm.chartConfig.xAxis.categories.length = vm.chartConfig.series[0].data.length;
          break;
        case 'pie':
          vm.rangeOfWeekYearArray = vm.data[vm.data.length -1].REFFECHA.split('-')
          vm.rangeOfWeekYear = `${vm.rangeOfWeekYearArray[1]}${vm.rangeOfWeekYearArray[0]}`;
          vm.chartConfig.plotOptions.pie = {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                    enabled: true,
                    format: '{point.name}: {point.percentage:.1f} %'
                }
            };

            vm.chartConfig.tooltip = {
                  pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
              };
            // Series 
            // console.log('data', vm.data);
            vm.chartConfig.series = [
              {
                name: vm.graphic.title,
                colorByPoint: true,
                data: vm.data.map((row) => {
                    
                  return {
                    name: row.ELEMENTO,
                    id: row.ORDEN,
                    y: row.VALOR1*1
                  }
                })
              }
            ];
    
          break;

      }
      vm.isLoading = false;
      // console.log('chart config',  vm.chartConfig);
    } // fin init

    

    vm.currentPoint = '';
    vm.onPointClick = (key, title) => {
      vm.currentPoint = key.replace(/ /g, '');
      vm.pointTitle = title;
      vm.showCommentPopup = true;
      // open model from comment popup component
      angular.element(`#comment-popup-form`).modal();
    };

   

}

angular.module('doc.features').component('graphicComponent', {
  template: require('./graphic.component.html'),
  controller: ['$scope', Controller],
  bindings: {
      data: "<",
      graphictable: '<',
      filtros: '<',
      graphic: "<",
      hideComments: '<',
      charId: '@'
  }
});