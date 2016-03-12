(function (factory) {
  'use strict';
  if (typeof exports === 'object') {
    // Node/CommonJS
    module.exports = factory(
      typeof angular !== 'undefined' ? angular : require('angular'),
      typeof Chart !== 'undefined' ? Chart : require('chart.js'));
  }  else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['angular', 'chart'], factory);
  } else {
    // Browser globals
    factory(angular, Chart);
  }
}(function (angular, Chart) {
  'use strict';

  Chart.defaults.global.responsive = true;
  Chart.defaults.global.multiTooltipTemplate = '<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>';

  Chart.defaults.global.colours = [
    '#97BBCD', // blue
    '#DCDCDC', // light grey
    '#F7464A', // red
    '#46BFBD', // green
    '#FDB45C', // yellow
    '#949FB1', // grey
    '#4D5360'  // dark grey
  ];

  var usingExcanvas = typeof window.G_vmlCanvasManager === 'object' &&
    window.G_vmlCanvasManager !== null &&
    typeof window.G_vmlCanvasManager.initElement === 'function';

  if (usingExcanvas) Chart.defaults.global.animation = false;

  return angular.module('chart.js', [])
    .provider('ChartJs', ChartJsProvider)
    .factory('ChartJsFactory', ['ChartJs', '$timeout', ChartJsFactory])
    .directive('chartBase', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory(); }])
    .directive('chartLine', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Line'); }])
    .directive('chartBar', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Bar'); }])
    .directive('chartRadar', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Radar'); }])
    .directive('chartDoughnut', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Doughnut'); }])
    .directive('chartPie', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('Pie'); }])
    .directive('chartPolarArea', ['ChartJsFactory', function (ChartJsFactory) { return new ChartJsFactory('PolarArea'); }]);

  /**
   * Wrapper for chart.js
   * Allows configuring chart js using the provider
   *
   * angular.module('myModule', ['chart.js']).config(function(ChartJsProvider) {
   *   ChartJsProvider.setOptions({ responsive: true });
   *   ChartJsProvider.setOptions('Line', { responsive: false });
   * })))
   */
  function ChartJsProvider () {
    var options = {};
    var ChartJs = {
      Chart: Chart,
      getOptions: function (type) {
        var typeOptions = type && options[type] || {};
        return angular.extend({}, options, typeOptions);
      }
    };

    /**
     * Allow to set global options during configuration
     */
    this.setOptions = function (type, customOptions) {
      // If no type was specified set option for the global object
      if (! customOptions) {
        customOptions = type;
        options = angular.extend(options, customOptions);
        return;
      }
      // Set options for the specific chart
      options[type] = angular.extend(options[type] || {}, customOptions);
    };

    this.$get = function () {
      return ChartJs;
    };
  }

  function ChartJsFactory (ChartJs, $timeout) {
    return function chart (type) {
      return {
        restrict: 'CA',
        scope: {
          data: '=?',
          labels: '=?',
          options: '=?',
          series: '=?',
          colours: '=?',
          getColour: '=?',
          chartType: '=',
          legend: '@',
          click: '=?',
          hover: '=?',

          chartData: '=?',
          chartLabels: '=?',
          chartOptions: '=?',
          chartSeries: '=?',
          chartColours: '=?',
          chartLegend: '@',
          chartClick: '=?',
          chartHover: '=?'
        },
        link: function (scope, elem/*, attrs */) {
          var chart, container = document.createElement('div');
          container.className = 'chart-container';
          elem.replaceWith(container);
          container.appendChild(elem[0]);

          if (usingExcanvas) window.G_vmlCanvasManager.initElement(elem[0]);

          ['data', 'labels', 'options', 'series', 'colours', 'legend', 'click', 'hover'].forEach(deprecated);
          function aliasVar (fromName, toName) {
            scope.$watch(fromName, function (newVal) {
              if (typeof newVal === 'undefined') return;
              scope[toName] = newVal;
            });
          }
          /* provide backward compatibility to "old" directive names, by
           * having an alias point from the new names to the old names. */
          aliasVar('chartData', 'data');
          aliasVar('chartLabels', 'labels');
          aliasVar('chartOptions', 'options');
          aliasVar('chartSeries', 'series');
          aliasVar('chartColours', 'colours');
          aliasVar('chartLegend', 'legend');
          aliasVar('chartClick', 'click');
          aliasVar('chartHover', 'hover');

          // Order of setting "watch" matter

          scope.$watch('data', function (newVal, oldVal) {
            if (! newVal || ! newVal.length || (Array.isArray(newVal[0]) && ! newVal[0].length)) return;
            var chartType = type || scope.chartType;
            if (! chartType) return;

            if (chart) {
              if (canUpdateChart(newVal, oldVal)) return updateChart(chart, newVal, scope, elem);
              chart.destroy();
            }

            createChart(chartType);
          }, true);

          scope.$watch('series', resetChart, true);
          scope.$watch('labels', resetChart, true);
          scope.$watch('options', resetChart, true);
          scope.$watch('colours', resetChart, true);

          scope.$watch('chartType', function (newVal, oldVal) {
            if (isEmpty(newVal)) return;
            if (angular.equals(newVal, oldVal)) return;
            if (chart) chart.destroy();
            createChart(newVal);
          });

          scope.$on('$destroy', function () {
            if (chart) chart.destroy();
          });

          function resetChart (newVal, oldVal) {
            if (isEmpty(newVal)) return;
            if (angular.equals(newVal, oldVal)) return;
            var chartType = type || scope.chartType;
            if (! chartType) return;

            // chart.update() doesn't work for series and labels
            // so we have to re-create the chart entirely
            if (chart) chart.destroy();

            createChart(chartType);
          }

          function createChart (type) {
            if (isResponsive(type, scope) && elem[0].clientHeight === 0 && container.clientHeight === 0) {
              return $timeout(function () {
                createChart(type);
              }, 50, false);
            }
            if (! scope.data || ! scope.data.length) return;
            scope.getColour = typeof scope.getColour === 'function' ? scope.getColour : getRandomColour;
            scope.colours = getColours(type, scope);
            var cvs = elem[0], ctx = cvs.getContext('2d');
            var data = Array.isArray(scope.data[0]) ?
              getDataSets(scope.labels, scope.data, scope.series || [], scope.colours) :
              getData(scope.labels, scope.data, scope.colours);
            var options = angular.extend({}, ChartJs.getOptions(type), scope.options);
            chart = new ChartJs.Chart(ctx)[type](data, options);
            scope.$emit('create', chart);

            // Bind events
            cvs.onclick = scope.click ? getEventHandler(scope, chart, 'click', false) : angular.noop;
            cvs.onmousemove = scope.hover ? getEventHandler(scope, chart, 'hover', true) : angular.noop;

            if (scope.legend && scope.legend !== 'false') setLegend(elem, chart);
          }

          function deprecated (attr) {
            if (typeof console !== 'undefined' && ChartJs.getOptions().env !== 'test') {
              var warn = typeof console.warn === 'function' ? console.warn : console.log;
              if (!! scope[attr]) {
                warn.call(console, '"%s" is deprecated and will be removed in a future version. ' +
                  'Please use "chart-%s" instead.', attr, attr);
              }
            }
          }
        }
      };
    };

    function canUpdateChart (newVal, oldVal) {
      if (newVal && oldVal && newVal.length && oldVal.length) {
        return Array.isArray(newVal[0]) ?
        newVal.length === oldVal.length && newVal.every(function (element, index) {
          return element.length === oldVal[index].length; }) :
          oldVal.reduce(sum, 0) > 0 ? newVal.length === oldVal.length : false;
      }
      return false;
    }

    function sum (carry, val) {
      return carry + val;
    }

    function getEventHandler (scope, chart, action, triggerOnlyOnChange) {
      var lastState = null;
      return function (evt) {
        var atEvent = chart.getPointsAtEvent || chart.getBarsAtEvent || chart.getSegmentsAtEvent;
        if (atEvent) {
          var activePoints = atEvent.call(chart, evt);
          if (triggerOnlyOnChange === false || angular.equals(lastState, activePoints) === false) {
            lastState = activePoints;
            scope[action](activePoints, evt);
            scope.$apply();
          }
        }
      };
    }

    function getColours (type, scope) {
      var colours = angular.copy(scope.colours ||
        ChartJs.getOptions(type).colours ||
        Chart.defaults.global.colours
      );
      while (colours.length < scope.data.length) {
        colours.push(scope.getColour());
      }
      return colours.map(convertColour);
    }

    function convertColour (colour) {
      if (typeof colour === 'object' && colour !== null) return colour;
      if (typeof colour === 'string' && colour[0] === '#') return getColour(hexToRgb(colour.substr(1)));
      return getRandomColour();
    }

    function getRandomColour () {
      var colour = [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
      return getColour(colour);
    }

    function getColour (colour) {
      return {
        fillColor: rgba(colour, 0.2),
        strokeColor: rgba(colour, 1),
        pointColor: rgba(colour, 1),
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: rgba(colour, 0.8)
      };
    }

    function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function rgba (colour, alpha) {
      if (usingExcanvas) {
        // rgba not supported by IE8
        return 'rgb(' + colour.join(',') + ')';
      } else {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
      }
    }

    // Credit: http://stackoverflow.com/a/11508164/1190235
    function hexToRgb (hex) {
      var bigint = parseInt(hex, 16),
        r = (bigint >> 16) & 255,
        g = (bigint >> 8) & 255,
        b = bigint & 255;

      return [r, g, b];
    }

    function getDataSets (labels, data, series, colours) {
      return {
        labels: labels,
        datasets: data.map(function (item, i) {
          return angular.extend({}, colours[i], {
            label: series[i],
            data: item
          });
        })
      };
    }

    function getData (labels, data, colours) {
      return labels.map(function (label, i) {
        return angular.extend({}, colours[i], {
          label: label,
          value: data[i],
          color: colours[i].strokeColor,
          highlight: colours[i].pointHighlightStroke
        });
      });
    }

    function setLegend (elem, chart) {
      var $parent = elem.parent(),
          $oldLegend = $parent.find('chart-legend'),
          legend = '<chart-legend>' + chart.generateLegend() + '</chart-legend>';
      if ($oldLegend.length) $oldLegend.replaceWith(legend);
      else $parent.append(legend);
    }

    function updateChart (chart, values, scope, elem) {
      if (Array.isArray(scope.data[0])) {
        chart.datasets.forEach(function (dataset, i) {
          (dataset.points || dataset.bars).forEach(function (dataItem, j) {
            dataItem.value = values[i][j];
          });
        });
      } else {
        chart.segments.forEach(function (segment, i) {
          segment.value = values[i];
        });
      }
      chart.update();
      scope.$emit('update', chart);
      if (scope.legend && scope.legend !== 'false') setLegend(elem, chart);
    }

    function isEmpty (value) {
      return ! value ||
        (Array.isArray(value) && ! value.length) ||
        (typeof value === 'object' && ! Object.keys(value).length);
    }

    function isResponsive (type, scope) {
      var options = angular.extend({}, Chart.defaults.global, ChartJs.getOptions(type), scope.options);
      return options.responsive;
    }
  }
}));
//Manually imported the angular-chart.js library because no CDN hosted it.
!function(t){"use strict";"function"==typeof define&&define.amd?define(["angular","chart.js"],t):"object"==typeof exports?module.exports=t(require("angular"),require("chart.js")):t(angular,Chart)}(function(t,e){"use strict";function n(){var n={},r={Chart:e,getOptions:function(e){var r=e&&n[e]||{};return t.extend({},n,r)}};this.setOptions=function(e,r){return r?(n[e]=t.extend(n[e]||{},r),void 0):(r=e,n=t.extend(n,r),void 0)},this.$get=function(){return r}}function r(n){function r(t,e){return t&&e&&t.length&&e.length?Array.isArray(t[0])?t.length===e.length&&t[0].length===e[0].length:e.reduce(a,0)>0?t.length===e.length:!1:!1}function a(t,e){return t+e}function o(e,r,a){if(r.data&&r.data.length){r.getColour="function"==typeof r.getColour?r.getColour:l,r.colours=c(e,r);var o=a[0],u=o.getContext("2d"),s=Array.isArray(r.data[0])?g(r.labels,r.data,r.series||[],r.colours):p(r.labels,r.data,r.colours),f=t.extend({},n.getOptions(e),r.options),h=new n.Chart(u)[e](s,f);return r.$emit("create",h),["hover","click"].forEach(function(t){r[t]&&(o["click"===t?"onclick":"onmousemove"]=i(r,h,t))}),r.legend&&"false"!==r.legend&&v(a,h),h}}function i(t,e,n){return function(r){var a=e.getPointsAtEvent||e.getBarsAtEvent||e.getSegmentsAtEvent;if(a){var o=a.call(e,r);t[n](o,r),t.$apply()}}}function c(r,a){for(var o=t.copy(a.colours||n.getOptions(r).colours||e.defaults.global.colours);o.length<a.data.length;)o.push(a.getColour());return o.map(u)}function u(t){return"object"==typeof t&&null!==t?t:"string"==typeof t&&"#"===t[0]?s(d(t.substr(1))):l()}function l(){var t=[f(0,255),f(0,255),f(0,255)];return s(t)}function s(t){return{fillColor:h(t,.2),strokeColor:h(t,1),pointColor:h(t,1),pointStrokeColor:"#fff",pointHighlightFill:"#fff",pointHighlightStroke:h(t,.8)}}function f(t,e){return Math.floor(Math.random()*(e-t+1))+t}function h(t,e){return"rgba("+t.concat(e).join(",")+")"}function d(t){var e=parseInt(t,16),n=e>>16&255,r=e>>8&255,a=255&e;return[n,r,a]}function g(e,n,r,a){return{labels:e,datasets:n.map(function(e,n){var o=t.copy(a[n]);return o.label=r[n],o.data=e,o})}}function p(t,e,n){return t.map(function(t,r){return{label:t,value:e[r],color:n[r].strokeColor,highlight:n[r].pointHighlightStroke}})}function v(t,e){var n=t.parent(),r=n.find("chart-legend"),a="<chart-legend>"+e.generateLegend()+"</chart-legend>";r.length?r.replaceWith(a):n.append(a)}function y(t,e,n){Array.isArray(n.data[0])?t.datasets.forEach(function(t,n){(t.points||t.bars).forEach(function(t,r){t.value=e[n][r]})}):t.segments.forEach(function(t,n){t.value=e[n]}),t.update(),n.$emit("update",t)}function C(t){return!t||Array.isArray(t)&&!t.length||"object"==typeof t&&!Object.keys(t).length}return function(e){return{restrict:"CA",scope:{data:"=",labels:"=",options:"=",series:"=",colours:"=?",getColour:"=?",chartType:"=",legend:"@",click:"=",hover:"="},link:function(n,a){function i(r,i){if(!C(r)&&!t.equals(r,i)){var u=e||n.chartType;u&&(c&&c.destroy(),c=o(u,n,a))}}var c,u=document.createElement("div");u.className="chart-container",a.replaceWith(u),u.appendChild(a[0]),"object"==typeof window.G_vmlCanvasManager&&null!==window.G_vmlCanvasManager&&"function"==typeof window.G_vmlCanvasManager.initElement&&window.G_vmlCanvasManager.initElement(a[0]),n.$watch("data",function(t,i){if(t&&t.length&&(!Array.isArray(t[0])||t[0].length)){var u=e||n.chartType;if(u){if(c){if(r(t,i))return y(c,t,n);c.destroy()}c=o(u,n,a)}}},!0),n.$watch("series",i,!0),n.$watch("labels",i,!0),n.$watch("options",i,!0),n.$watch("colours",i,!0),n.$watch("chartType",function(e,r){C(e)||t.equals(e,r)||(c&&c.destroy(),c=o(e,n,a))}),n.$on("$destroy",function(){c&&c.destroy()})}}}}e.defaults.global.responsive=!0,e.defaults.global.multiTooltipTemplate="<%if (datasetLabel){%><%=datasetLabel%>: <%}%><%= value %>",e.defaults.global.colours=["#97BBCD","#DCDCDC","#F7464A","#46BFBD","#FDB45C","#949FB1","#4D5360"],t.module("chart.js",[]).provider("ChartJs",n).factory("ChartJsFactory",["ChartJs",r]).directive("chartBase",["ChartJsFactory",function(t){return new t}]).directive("chartLine",["ChartJsFactory",function(t){return new t("Line")}]).directive("chartBar",["ChartJsFactory",function(t){return new t("Bar")}]).directive("chartRadar",["ChartJsFactory",function(t){return new t("Radar")}]).directive("chartDoughnut",["ChartJsFactory",function(t){return new t("Doughnut")}]).directive("chartPie",["ChartJsFactory",function(t){return new t("Pie")}]).directive("chartPolarArea",["ChartJsFactory",function(t){return new t("PolarArea")}])});
//# sourceMappingURL=angular-chart.min.js.map
