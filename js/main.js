 /*jshint browser: true, indent:4, white: true, eqeqeq: false, boss: true, curly: false, loopfunc: true */

var pSplitAdvisor = function () {

    this._eventListeners = [];

    this.setUp = function () {
        this._eventListeners = [];
        // setup local data storage
        MyLocalStorage
            .setItem('friends', [{
                id: '1',
                name: 'Pavan Ratnakar',
                age: '28'
            }, {
                id: '2',
                name: 'Rohan',
                age: '28'
            }, {
                id: '3',
                name: 'Louis',
                age: '28'
            }, {
                id: '4',
                name: 'Shonil',
                age: '28'
            }]);
        MyLocalStorage
            .setItem('bills', [{
                'description': 'Sunnyvale Cab',
                'friends': [2, 3],
                'amount': '500'
            }, {
                'description': 'Fuel',
                'friends': [4],
                'amount': '400'
            }, {
                'description': 'I dont remember',
                'friends': [3, 4],
                'amount': '500'
            },
            {
                'description': 'Car',
                'friends': [],
                'amount': '400'
            }]);
    };

    // FRIEND RELATED STUFF

    this.showFriends = function () {
        var t = this;

        for (var i = 0; i < MyLocalStorage.getItem('friends').item.length; ++i) {
            t.showFriend(MyLocalStorage.getItem('friends').item[i]);
        }
    };

    this.showFriend = function (user) {
        var fd = document.getElementById('friends').getElementsByClassName('content')[0];

        fd.innerHTML = fd.innerHTML + '<div class="friend">' + user.name + '<span class="remove">X</span></div>';
    };

    this.removeFriend = function (index) {
        var friends = MyLocalStorage.getItem('friends').item,
            c = document.getElementById('friends').getElementsByClassName('content')[0];

        friends = friends.splice(index, 1);
        MyLocalStorage.setItem('friends', friends);
        c.removeChild(c.getElementsByClassName('friend')[index]);
    };

    this.addFriend = function (data) {
        var friends = MyLocalStorage.getItem('friends').item;
        console.log(friends);
        if (data.name) {
            data.id = MyLocalStorage.getItem('friends').item.length + 1;
            friends.push(data);
            MyLocalStorage.setItem('friends', friends);
            this.showFriend(data);
        }
    };

    this.getFriendById = function (id) {
        var friends = MyLocalStorage.getItem('friends').item,
            friend = null;
        friends.some(function (f, i) {
            if (parseInt(id, 10) === parseInt(f.id, 10)) {
                friend = f;
                return true;
            }
        });
        return friend;
    };

    this._friendEvents = function () {
        var t = this,
            div = document.getElementById('friends').getElementsByClassName('content')[0];

        div.onclick = function (e) {
            var tgt = e.target,
                j = 0,
                items;

            if (tgt === this) return;
            items = pSplitAdvisorUtil.children(this);
            while (tgt.parentNode !== this) tgt = tgt.parentNode;
            while (items[j] !== tgt) j++;
            if (e.target.tagName === 'SPAN') {
                t.removeFriend(j);
            }
        };
    };

    // EVENTS

    this._addFriend = function () {
        var t = this,
            ff;

        pSplitAdvisorUtil.load('templates/addUser.html', function (data) {
            if (data && data.responseText) {
                pSplitAdvisorUtil.showPopup(data.responseText, function () {
                    ff = document.getElementById('add-user');
                    if (ff) {
                        if (ff.addEventListener) {
                            ff.addEventListener("submit", function () {
                                t.addFriend(pSplitAdvisorUtil.getFormData(ff));
                                fb.end();
                                return false;
                            }, false);
                        } else if (ff.attachEvent) {
                            ff.attachEvent('onsubmit', function () {
                                t.addFriend(pSplitAdvisorUtil.getFormData(ff));
                                fb.end();
                                return false;
                            });
                        }
                    }
                });
            }
        });
    };

    // BILL RELATED STUFF

    this.showBills = function () {
        var t = this;

        for (var i = 0; i < MyLocalStorage.getItem('bills').item.length; ++i) {
            t.showBill(MyLocalStorage.getItem('bills').item[i]);
        }
    };

    // NOTE : I WOULD LOVE TO USE UNDERSCORE HERE FOR TEMPLATING
    this.showBill = function (bill) {
        var fd = document.getElementById('bills').getElementsByClassName('content')[0],
            t = '',
            owe = (parseFloat(bill.amount, 10) / + (bill.friends.length + 1)).toFixed(2),
            user = '';

        t = '\
            <div class="bill pure-g">\
                <div class="description pure-u-1-4">'
                    + bill.description +
                '</div>\
                <div class="amount pure-u-1-4">\
                    Rs ' + parseFloat(bill.amount, 10) +
                '</div>\
                <div class="owe pure-u-1-4">\
                    Rs ' + owe +
                '</div>';

        if (bill.friends.length > 0) {
            t = t + '<div class="friends pure-u-1-4">';
            for (var i = 0; i < bill.friends.length; ++i) {
                user = this.getFriendById(bill.friends[i]);
                t = t + '<p><span class="bold">' + user.name + '</span> has to pay <span class="bold">' + owe + '</span></p>';
            }
            t = t + '</div>';
        }

        t = t + '<span class="remove">X</span>\
            </div>';

        fd.innerHTML = fd.innerHTML + t;
    };

    this.removeBill = function (index) {
        var bills = MyLocalStorage.getItem('bills').item,
            c = document.getElementById('bills').getElementsByClassName('content')[0];

        bills = bills.splice(index, 1);
        MyLocalStorage.setItem('bills', bills);
        c.removeChild(c.getElementsByClassName('bill')[index]);
    };

    this.addBill = function (data) {
        var bills = MyLocalStorage.getItem('bills').item;
        if (data.description && data.amount) {
            data.friends = [];
            data.friends.push(data.friend);
            bills.push(data);
            MyLocalStorage.setItem('bills', bills);
            this.showBill(data);
        }
    };

    this._billEvents = function () {
        var t = this,
            div = document.getElementById('bills').getElementsByClassName('content')[0];

        div.onclick = function (e) {
            var tgt = e.target,
                j = 0,
                items;

            if (tgt === this) return;
            items = pSplitAdvisorUtil.children(this);
            while (tgt.parentNode !== this) tgt = tgt.parentNode;
            while (items[j] !== tgt) j++;
            if (e.target.tagName === 'SPAN') {
                t.removeBill(j);
            }
        };
    };

    this._addBill = function () {
        var t = this,
            ff;

        pSplitAdvisorUtil.load('templates/addBill.html', function (data) {
            if (data && data.responseText) {
                pSplitAdvisorUtil.showPopup(data.responseText, function () {
                    ff = document.getElementById('add-bill');
                    if (ff) {
                        // TODO : SHOULD MAKE UTIL METHOD FOR THIS
                        var myselect = ff.getElementsByTagName("select")[0];
                        for (var i = 0; i < MyLocalStorage.getItem('friends').item.length; ++i) {
                            var objOption = document.createElement("option");
                            objOption.text = MyLocalStorage.getItem('friends').item[i].name;
                            objOption.value = MyLocalStorage.getItem('friends').item[i].id;
                            myselect.options.add(objOption);
                        }
                        if (ff.addEventListener) {
                            ff.addEventListener("submit", function () {
                                t.addBill(pSplitAdvisorUtil.getFormData(ff));
                                fb.end();
                                return false;
                            }, false);
                        } else if (ff.attachEvent) {
                            ff.attachEvent('onsubmit', function () {
                                t.addBill(pSplitAdvisorUtil.getFormData(ff));
                                fb.end();
                                return false;
                            });
                        }
                    }
                });
            }
        });
    };

    this._initEvents = function () {
        var t = this,
            au = document.getElementById('friends').getElementsByClassName('add-friend')[0],
            bu = document.getElementById('bills').getElementsByClassName('add-bill')[0];

        au.onclick = function () {
            t._addFriend();
        };
        bu.onclick = function () {
            t._addBill();
        };
        t._friendEvents();
        t._billEvents();
    };

    this.setUp();
    this.showFriends();
    this.showBills();
    this._initEvents();
};

var m = pSplitAdvisor();