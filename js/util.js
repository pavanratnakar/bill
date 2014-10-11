 /*jshint browser: true, indent:4, white: true, eqeqeq: false, boss: true, curly: false, loopfunc: true */

var pSplitAdvisorUtil = {
    load: function (url, callback) {
        var xhr;

        if (typeof XMLHttpRequest !== 'undefined') {
            xhr = new XMLHttpRequest();
        } else {
            cosole.log('what');
            var versions = ["MSXML2.XmlHttp.5.0",
                            "MSXML2.XmlHttp.4.0",
                            "MSXML2.XmlHttp.3.0",
                            "MSXML2.XmlHttp.2.0",
                            "Microsoft.XmlHttp"];

            for (var i = 0, len = versions.length; i < len; i++) {
                try {
                    xhr = new ActiveXObject(versions[i]);
                    break;
                }
                catch (e) {}
            } // end for
        }

        xhr.onreadystatechange = ensureReadiness;

        function ensureReadiness() {
            if (xhr.readyState < 4) {
                return;
            }

            if (xhr.status !== 200) {
                return;
            }

            // all is well
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        }
        xhr.open('GET', url, true);
        xhr.send('');
    },
    showPopup: function (html, callback) {
        setTimeout(callback, 1000);
        fb.start(html);
    },
    getFormData: function (form) {
        var formElements = form.elements,
            postData = {};

        for (var i = 0; i < formElements.length; i++) {
            if (formElements[i].type != "submit" || formElements[i].type != "fieldset") {
                postData[formElements[i].name] = formElements[i].value;
            }
        }
        return postData;
    },
    children: function (el) {
        var i = 0, children = [], child;
        while (child = el.childNodes[i++]) {
            if (child.nodeType === 1) children.push(child);
        }
        return children;
    },
    some: function (fun /*, thisArg*/) {
        if (this == null) {
          throw new TypeError('Array.prototype.some called on null or undefined');
        }

        if (typeof fun !== 'function') {
          throw new TypeError();
        }

        var t = Object(this);
        var len = t.length >>> 0;

        var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
        for (var i = 0; i < len; i++) {
          if (i in t && fun.call(thisArg, t[i], i, t)) {
            return true;
          }
        }

        return false;
    }
};