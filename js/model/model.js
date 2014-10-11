/*jshint browser: true, indent:4, white: true, eqeqeq: false, boss: true, curly: false, loopfunc: true */

var MyLocalStorage = {};

MyLocalStorage.getItem = function (key) {
    return new MyItem(JSON.parse(localStorage.getItem(key)));
};

MyLocalStorage.setItem = function (key, object) {
    localStorage.setItem(key, JSON.stringify(object));
    return this.getItem(key);
};

function MyItem(object, key) {
    this.item = object;
    this.key = key;
    this.addSubItem = function (subItem) {
        if (typeof this.item.push == 'function') {
            this.item.push(subItem);
            this.save();
            return this;
        }
        return false;
    };
    this.setItem = function (object) {
        this.item = object;
        this.save();
        return this;
    };
    this.save = function () {
        MyLocalStorage.setItem(this.key, this.item);
    };
    this.toString = function () {
        return this.item.toString();
    };
}