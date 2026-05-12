import angular from 'angular';
import { format2Places, formatWhole } from './utilsfunctions';
angular
  .module('zombieApp', [])
  .config([
    '$compileProvider',
    function ($compileProvider) {
      $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript|data|blob):/);
    }
  ])
  .controller('ZombieController', ['$scope', '$interval', '$document', function ($scope, $interval, $document) {}])
  .directive('levelSelect', function () {
    return {
      templateUrl: './templates/levelselect.html'
    };
  })
  .directive('levelStats', function () {
    return {
      templateUrl: './templates/levelstats.html'
    };
  })
  .directive('graveyardMenu', function () {
    return {
      templateUrl: './templates/graveyardmenu.html'
    };
  })
  .directive('runesmithMenu', function () {
    return {
      templateUrl: './templates/runesmithmenu.html'
    };
  })
  .directive('optionsMenu', function () {
    return {
      templateUrl: './templates/optionsmenu.html'
    };
  })
  .directive('shopMenu', function () {
    return {
      templateUrl: './templates/shopmenu.html'
    };
  })
  .directive('constructionMenu', function () {
    return {
      templateUrl: './templates/constructionmenu.html'
    };
  })
  .directive('prestigeMenu', function () {
    return {
      templateUrl: './templates/prestigemenu.html'
    };
  })
  .directive('championsHoldMenu', function () {
    return {
      templateUrl: './templates/championshold.html'
    };
  })
  .directive('factoryMenu', function () {
    return {
      templateUrl: './templates/factorymenu.html'
    };
  })
  .directive('draggableItem', [
    '$rootScope',
    function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, el, attrs, controller) {
          var itemId = scope.item.id;

          if (attrs.draggableItem == 'true') {
            angular.element(el).attr('draggable', 'true');
            el.bind('dragstart', function (e) {
              document.getElementById('champ-hold').classList.toggle('no-tooltip');
              e.dataTransfer.setData('text', itemId);
              var rect = el[0].getBoundingClientRect();
              e.dataTransfer.setDragImage(el[0], rect.width / 2, rect.height / 2);
              $rootScope.$emit('item-drag-start', itemId);
              setTimeout(function () {
                angular.element(el)[0].style.opacity = '0.3';
              });
            });
            el.bind('dragend', function (e) {
              document.getElementById('champ-hold').classList.toggle('no-tooltip');
              angular.element(el)[0].style.opacity = '';
              $rootScope.$emit('item-drag-end', itemId);
            });
          }
        }
      };
    }
  ])
  .directive('droppableTarget', [
    '$rootScope',
    function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, el, attrs, controller) {
          var type = scope.item.s;

          el.bind('dragover', function (e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
            return false;
          });

          el.bind('dragenter', function (e) {
            if (e.target && e.target.classList && e.target.classList.contains('icon')) {
              angular.element(e.target.parentElement).addClass('over');
            }
          });

          el.bind('dragleave', function (e) {
            if (e.target && e.target.classList && e.target.classList.contains('icon')) {
              angular.element(e.target.parentElement).removeClass('over');
            }
          });

          el.bind('drop', function (e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            if (e.stopPropagation) {
              e.stopPropagation(); // Necessary. Allows us to drop.
            }
            if (e.target.classList.contains('icon')) {
              angular.element(e.target.parentElement).removeClass('over');
            }
            var data = e.dataTransfer.getData('text');
            var item = scope.zm.skeletonMenu.itemById(data);
            if (item) {
              var cssClass = scope.zm.skeletonMenu.itemType(item);
              document.getElementsByClassName('equipped')[0].classList.remove(cssClass);
            }
            scope.zm.skeletonMenu.itemDropped(data, type);
          });
          $rootScope.$on('item-drag-start', function (e, result) {
            var item = scope.zm.skeletonMenu.itemById(result);
            if (item) {
              var cssClass = scope.zm.skeletonMenu.itemType(item);
              document.getElementsByClassName('equipped')[0].classList.add(cssClass);
            }
          });
          $rootScope.$on('item-drag-end', function (e, result) {
            var item = scope.zm.skeletonMenu.itemById(result);
            if (item) {
              var cssClass = scope.zm.skeletonMenu.itemType(item);
              document.getElementsByClassName('equipped')[0].classList.remove(cssClass);
            }
          });
        }
      };
    }
  ]);
