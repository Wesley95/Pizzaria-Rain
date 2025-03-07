/*
	DP Number Picker jQuery Plugin, Version 1.0.1
	Copyright (C) Dustin Poissant 2014
	License CC BY-NC-SA 3.0 US
	http://creativecommons.org/licenses/by-nc-sa/3.0/us/
*/
;
(function (e) {
	e.fn.dpNumberPicker = function () {
		function i(e, t) {
			if (typeof t == "string" && t.length > 0) {
				var n = t.indexOf(".");
				if (n == -1) {
					var r = Math.floor(e).toString();
					while (r.length < t.length) r = "0" + r;
					return r
				}
				var r = Math.floor(e).toString();
				while (r.length < n) r = "0" + r;
				var i = Math.round(Math.round(Math.pow(10, t.length - n - 1)) * (e - Math.floor(e))).toString();
				while (i.length < t.length - n - 1) i += "0";
				return r + "." + i
			} else
				return e
		}
		function s(e) {
			while (isNaN(parseFloat(e)) && e.length > 0)
				e = e.substring(1);
			return parseFloat(e)
		}
		var t = {
			min: false,
			max: false,
			value: 0,
			step: 1,
			format: false,
			editable: true,
			addText: "+",
			subText: "-",
			formatter: function (e) {
				return e
			},
			beforeIncrease: function () { },
			afterIncrease: function () { },
			beforeDecrease: function () { },
			afterDecrease: function () { },
			beforeChange: function () { },
			afterChange: function () { },
			onMin: function () { },
			onMax: function () { }
		};

		var n = arguments;
		if (arguments.length > 0 && typeof arguments[0] == "string") {
			var n = arguments;
			var r = n[0].toLowerCase();
			if (r == "increase" || r == "add" || r == "addition" || r == "incrament")
				this.each(function () {
					this.increase()
				});
			if (r == "decrease" || r == "sub" || r == "subtract" || r == "decrament")
				this.each(function () {
					this.decrease()
				});
			if (n.length > 1 && (r == "change" || r == "setvalue" || r == "value" || r == "set"))
				this.each(function () {
					this.setValue(n[1])
				});
			if (n.length > 1 && (r == "update" || r == "refresh"))
				this.each(function () {
					this.update()
				});
			return this
		} else if (arguments.length > 0 && typeof arguments[0] == "object") {
			this.each(function () { this.options = e.extend(t, n[0]) })
		} else this.each(function () {
			this.options = t
		});

		this.each(function () {
			var t = this;
			var n = e(this);
			var r = "<div class='dp-numberPicker-sub'>" + t.options.subText + "</div><input type='text' class='dp-numberPicker-input'";
			if (!t.options.editable)
				r += " disabled";
			if (t.options.format)
				r += " value='" + t.options.formatter.call(t, i(t.options.value, t.options.format)) + "' ";
			else
				r += " value='" + t.options.formatter.call(t, t.options.value) + "' ";
			r += "' /><div class='dp-numberPicker-add'>" + t.options.addText + "</div>";
			n.addClass("dp-numberPicker").html(r);
			t.increase = function () {
				n.children().removeClass("disabled");
				var e = false;
				var r = t.options.value + t.options.step;
				if (t.options.max !== false && t.options.max < r) r = t.options.max;
				if (r != t.options.value) {
					t.options.beforeChange.call(t);
					t.options.beforeIncrease.call(t);
					e = true
				} if (t.options.max !== false && t.options.max == r) {
					n.children(".dp-numberPicker-add").addClass("disabled");
					t.options.onMax.call(t)
				}
				t.options.value = r;
				t.update();
				if (e) {
					t.options.afterChange.call(t);
					t.options.afterIncrease.call(t)
				}
				return this
			};

			t.decrease = function () {
				n.children().removeClass("disabled");
				var e = false;
				var r = t.options.value - t.options.step;
				if (t.options.min !== false && t.options.min > r) r = t.options.min;
				if (r != t.options.value) {
					t.options.beforeChange.call(t);
					t.options.beforeDecrease.call(t);
					e = true
				} if (t.options.min !== false && t.options.min == r) {
					n.children(".dp-numberPicker-sub").addClass("disabled");
					t.options.onMin.call(t)
				}
				t.options.value = r;
				t.update();
				if (e) {
					t.options.afterChange.call(t);
					t.options.afterDecrease.call(t)
				}
				return this
			};

			t.setValue = function (e) {
				n.children().removeClass("disabled");
				var r = false;
				var i = false;
				if (typeof e == "string") e = s(e);
				if (isNaN(e)) e = t.options.value;
				if (t.options.max !== false && t.options.max < e)
					e = t.options.max;
				if (t.options.min !== false && t.options.min > e)
					e = t.options.min;
				if (t.options.value > e) {
					t.options.beforeChange.call(t);
					t.options.beforeDecrease.call(t);
					r = true
				} if (t.options.value < e) {
					t.options.beforeChange.call(t);
					t.options.beforeIncrease.call(t);
					r = true;
					i = true
				} if (t.options.max !== false && t.options.max == e) {
					n.children(".dp-numberPicker-add").addClass("disabled");
					t.options.onMax.call(t)
				} if (t.options.min !== false && t.options.min == e) {
					n.children(".dp-numberPicker-sub").addClass("disabled");
					t.options.onMin.call(t)
				}
				t.options.value = e;
				t.update();
				if (r) {
					t.options.afterChange();
					if (i) t.options.afterIncrease.call(t);
					else t.options.afterDecrease.call(t)
				}
				return this
			};

			t.update = function () {
				if (t.options.format && t.options.format.length > 0)
					n.children(".dp-numberPicker-input").val(t.options.formatter.call(t, i(t.options.value, t.options.format)));
				else n.children(".dp-numberPicker-input").val(t.options.formatter.call(t, t.options.value));
				return this
			};

			n.children(".dp-numberPicker-add").on("click", function () {
				t.increase()
			});
			n.children(".dp-numberPicker-sub").on("click", function () {
				t.decrease()
			});
			n.children(".dp-numberPicker-input").on("change", function () {
				t.setValue(s(n.children(".dp-numberPicker-input").val()))
			})
		});

		return this
	}
})(jQuery);