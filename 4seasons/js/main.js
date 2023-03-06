var owl = $('.first-owl');
owl.owlCarousel({
    center: true,
    loop: true,
    margin: 30,
    startPosition: 2,
    items: 3,
});

// Go to the next item
$('.slider__btn--next').click(function () {
    owl.trigger('next.owl.carousel');
})

// Go to the previous item
$('.slider__btn--prev').click(function () {
    owl.trigger('prev.owl.carousel', [300]);
})

var second = $('.second-owl');
second.owlCarousel({
    loop:true,
    margin:10,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1050:{
            items:6
        }
    },
    
})

$('.brands__btn--next').click(function () {
    second.trigger('next.owl.carousel');
})

// Go to the previous item
$('.brands__btn--prev').click(function () {
    second.trigger('prev.owl.carousel', [300]);
})