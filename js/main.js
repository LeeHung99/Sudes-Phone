angular.module('myapp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "page/home.html"
            })
            .when("/chinhsach", {
                templateUrl: "page/chinhsach.html"
            })
            .when("/tintuc", {
                templateUrl: "page/tintuc.html"
            })
            .when("/lienhe", {
                templateUrl: "page/lienhe.html"
            })
            .when("/cart", {
                templateUrl: "page/shop-cart.html",
                controller: "shopcartCtr"
            })
            .when("/paynow",{
                templateUrl: "page/pay-now.html",
                controller: "paynowCtr"
            })
            .when("/login", {
                templateUrl: "account/login.html"
            })
            .when("/register", {
                templateUrl: "account/register.html"
            })
            .when("/product-detail/:id", {
                templateUrl: "product-detail.html",
                controller: "productdetailCtr"
            })
            .when("/danhmucsp/:category", {
                templateUrl: "danhmucsp.html",
                controller: "danhmucspCtr"
            })
            .otherwise({
                redirectTo: "/home"
            })
    })
    .controller('loading', ($rootScope) => {
        $rootScope.loading = true;
    })
    .run(function ($rootScope) {
        $rootScope.$on('$routeChangeStart', function () {
            $rootScope.loading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.loading = false;
        });
        $rootScope.$on('$routeChangeError', function () {
            $rootScope.loading = false;
        });
    })
    .controller('myCtr', function ($scope, $http) {
        $scope.listSP = [];
        $scope.listCate = [];
        $scope.cart = [];
        $scope.discount = "LCHPS27390";
        $scope.priceDiscount = 500000;
        $scope.dem = 0;
        $http.get("js/data.json").then(
            function (res) {
                // khi tải thành công
                $scope.listSP = res.data;
            },
            function (res) {
                // khi tải thất bại
            }
        )
        $http.get("js/category.json").then(
            function (ress) {
                $scope.listCate = ress.data;
            },
            function (ress) {

            }
        )
        $scope.addToCart = function (sp) {
            if ($scope.cart.find(item => item.id == sp.id) == undefined) {
                sp.quantity = 1;
                $scope.cart.push(sp);
            } else {
                $scope.cart.find(item => item.id == sp.id).quantity++;
            }
            $scope.dem = $scope.cart.length;
        }

    })
    .controller('productdetailCtr', function ($scope, $routeParams) {
        $scope.id = $routeParams.id;
        $scope.detail = [];
        // console.log($scope.id)
        for (var i = 1; i <= $scope.listSP.length; i++) {
            if (i == $scope.id) {
                $scope.detail = $scope.listSP[$scope.id - 1];
                break;
            }
        }
    })
    .controller('danhmucspCtr', function ($scope, $routeParams) {
        $scope.title = $routeParams.category;
        $scope.image = "image/banner-" + $scope.title + ".webp";
        $scope.category = [];
        $scope.catedetail = [];
        // console.log($scope.listCate);
        for (var i = 1; i <= $scope.listSP.length; i++) {
            if ($scope.title == $scope.listSP[i - 1].category) {
                $scope.category.push($scope.listSP[i - 1]);
            }
        }
        for (var i = 1; i <= $scope.listCate.length; i++) {
            if ($scope.title == $scope.listCate[i - 1].type) {
                $scope.catedetail.push($scope.listCate[i - 1]);
            }
        }
        // console.log($scope.catedetail);
        if ($scope.category.length == 0) {
            $scope.category = $scope.listSP;
        }
        $scope.page = 1;
        $scope.limit = 8;
        $scope.start = 0;
        $scope.changePage = function (page) {
            $scope.page = page;
            $scope.start = ($scope.page - 1) * $scope.limit;
        }
        $scope.totalPage = function () {
            var totalPage = Math.ceil($scope.category.length / $scope.limit);
            var pages = [];
            for (let i = 1; i <= totalPage; i++) {
                pages.push(i);
            }
            return pages;
        }
    })
    .controller('shopcartCtr', function ($scope) {
        // $scope.sum = 0;
        // $scope.cart.forEach(element => {
        //     $scope.sum += ((element.price - (element.price * element.sale / 100)) * element.quantity)
        // });
        $scope.calculateTotal = function () {
            $scope.sum = 0;
            $scope.cart.forEach(element => {
                $scope.sum += ((element.price - (element.price * element.sale / 100)) * element.quantity)
                // console.log($scope.sum);
            });
            return $scope.sum;
        };
    })
    .controller('paynowCtr',function ($scope,$http){
        console.log($scope.cart)
        $scope.dsTinh = [];
        $scope.tinh = {};
        $scope.huyen = {};
        $scope.xa = {};
        $scope.shipcod = 40000;
        $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json').then(
            function (res) {
                $scope.dsTinh = res.data;
                // console.log($scope.tinh)
            }
        )

        $scope.calculateTotal = function () {
            $scope.sum = 0;
            $scope.cart.forEach(element => {
                $scope.sum += ((element.price - (element.price * element.sale / 100)) * element.quantity)
                // console.log($scope.sum);
            });
            return $scope.sum;
        };
    })