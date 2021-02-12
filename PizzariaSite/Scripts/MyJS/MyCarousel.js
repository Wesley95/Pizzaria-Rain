//var count_groups = 0;//QUANTIDADE MÁXIMA DE GRUPOS
//var count_click = 0;
//var still_animate = false;
//var durationTime = 600;

//moveGroup("left");
//moveGroup("right");

//$(document).ready(function () {

//    $("div.my-carousel div.my-carousel-all-group").each(function (index, obj) {

//        let all_group = $(obj).find("div.my-carousel-group");
//        count_groups = $(all_group).length;

//        $(all_group).eq(0).prop("display", "block").addClass("actived-group");
//        $(all_group).eq(0).parents("div.my-carousel").find("input[type=hidden]").attr("data-click", 0).attr("data-max", count_groups).data("block", false);

//        for (var l = 1; l < count_groups; l++) {

//            $(all_group).eq(l).css("display", "none");
//        }
//    });
//});

//function moveGroup(rightleft) {

//    $(document).on("click", "button." + rightleft + "-side-carousel", function () {
//        let multiply_value = 1;
//        let datavalues = $(this).parents("div.my-carousel").find("input[type=hidden]");
//        still_animate = $(datavalues).data("block");

//        if (!still_animate) {

//            count_click = $(datavalues).attr("data-click");
//            count_groups = $(datavalues).attr("data-max");

//            switch (rightleft) {
//                case "left":
//                    decrement();
//                    break;
//                case "right":
//                    multiply_value = -1;
//                    increment();
//                    break;
//            }

//            $(datavalues).attr("data-click", count_click).attr("data-max", count_groups).data("block", true);

//            animToRight(multiply_value, $(this), count_click);
//        }
//    });
//}


//function increment() {

//    count_click++;
//    count_click = count_click > (count_groups - 1) ? 0 : count_click;
//}

//function decrement() {

//    count_click--;
//    count_click = count_click == -1 ? (count_groups - 1) : count_click;
//}

//function animToRight(toright, buttonclicked, click_count) {

//    let obj = $(buttonclicked).parents("div.my-carousel").find("div.my-carousel-all-group div.my-carousel-group.actived-group").removeClass("actived-group");
//    let newactive = $(buttonclicked).parents("div.my-carousel").find("div.my-carousel-all-group div.my-carousel-group").
//        eq(click_count).css("display", "block").addClass("actived-group");

//    let anim_plus = $(obj).outerWidth();

//    $(newactive).css("right", (toright * -1) * anim_plus + "px");
//    $(obj).css("right", (toright * -1) * anim_plus + "px");

//    //$(obj).animate({
//    //    right: (toright * anim_plus) + "px"
//    //}, {
//    //    queue: false,
//    //    complete: function () {
//    //        $(obj).css("display", "none");
//    //    }
//    //});

//    //$(newactive).animate({
//    //    right: 0 + "px"
//    //}, {
//    //    queue: false,
//    //    slow: true,
//    //    complete: function () {
//    //        $(buttonclicked).parents("div.my-carousel").find("input[type=hidden]").data("block", false);
//    //    }
//    //});
//}